import { first } from 'rxjs/operators';
import { Component, AfterViewInit, HostListener, SimpleChanges, ViewChildren, QueryList, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Metronome } from '../../models/instruments/metronome';
import { MidiInstrument } from '../../models/instruments/midi-instrument'; //for now, do here -> in future, put in track
import {Project} from '../../models/project'
import { Recording } from '../../models/recording/recording';
import { Note } from '../../models/recording/note';
import { SchedulePlayback } from '../../services/recording/playback-service.service';
import { BounceProjectToMP3 } from 'src/app/services/recording/bounce-service.service';
import * as Tone from 'tone'; 
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { MidiTrackComponent } from '../midi/midi-editor/midi-track/midi-track.component';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { SliderComponent } from '../controls/slider/slider/slider.component';
import { MidiBlockComponent } from '../midi/midi-editor/midi-block/midi-block.component';
import { MakeNewProject } from 'src/app/lib/db/new-project';
import { HydrateProjectFromInfo } from 'src/app/lib/db/hydrate-project';
import { InfoizeProject } from 'src/app/lib/db/infoize-project';
import { MakeInfoFromDbRes } from 'src/app/lib/db/model-project';
  
/**
 * Int status of keys for keyboard
 */
enum keyStatus { 
  notPlaying = 0,
  isPlaying = 1,
}
enum controlStatus {
  play = 0,
  pause = 1,
  reset = 2,
}
export enum BlockMode {
  Block,
  Editor
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css',]
})
export class HomeComponent implements AfterViewInit, OnInit{
  
  @ViewChildren('blockRef') blockRefs?: QueryList<MidiBlockComponent>;
  // @ViewChild('midiContainerRef', { static: false }) midiContainerRef: ElementRef | any;
  @ViewChildren('midiContainer') midiContainerRefs?: QueryList<Element | any>;

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    this.synthOnKeydown(event.key);
    //if (this.keyboardStatus[event.key] != keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toAttack; //schedules attack
    const myDiv = document.getElementById(event.key);
    if (myDiv) {
      myDiv.classList.add("active");
    }
    //this.PlayRelease();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    this.synthOnKeyup(event.key);

    //if (this.keyboardStatus[event.key] == keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toRelease; //schedules release
    const myDiv = document.getElementById(event.key);
    if (myDiv) {
      myDiv.classList.remove("active");
    }
    //this.PlayRelease();
  }


  currMousekey: string = '';

  @HostListener('window:mouseup', ['$event'])
  handleMouseupEvent(event: MouseEvent) {
    if (this.currMousekey != '') {
      const myDiv = document.getElementById(this.currMousekey);
      if (myDiv) {
        myDiv.classList.remove("active");
      }
    }
    this.synthOnKeyup(this.currMousekey);
    this.currMousekey = '';
  }

  onTrackUpdated(track: MidiTrack) {
    this.selectedTrack = track;
    this.project.save();
    console.log(this.project);
    // console.log('from home', this.selectedTrack.midi.data);
  }

  onKeyMousedown(key: string) {
    this.currMousekey = key;
    const myDiv = document.getElementById(this.currMousekey);
    if (myDiv) {
      myDiv.classList.add("active");
    }
    this.synthOnKeydown(key);
  }

  onKeyMouseup(key: string) {
    if (this.currMousekey != '') {
      const myDiv = document.getElementById(this.currMousekey);
      if (myDiv) {
        myDiv.classList.remove("active");
      }
    }
    this.synthOnKeyup(this.currMousekey);
    this.currMousekey = '';
  }
  isNew: boolean = false;
  project: Project;

  projectKey: string = "";
  loading: boolean = true;
  constructor(public firebaseService: FirebaseService, public _router: Router, private _renderer: Renderer2) {
    const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
    this.project = MakeNewProject(sessionEmail);
    firebaseService.getProjectByEmail(sessionEmail).pipe(first()).subscribe({
      next: res => {
        if (res.length > 0) {
          const resProjectInfo = MakeInfoFromDbRes(res[0])
          this.project = HydrateProjectFromInfo(resProjectInfo)
          this.projectKey = res[0].key;
          console.log('loaded proj', this.project)
        }
        else {
          firebaseService.initProject(InfoizeProject(this.project));
        }
        this.initVars()
        this.project.updateEmitter.subscribe(() => {
          firebaseService.saveProject(this.projectKey, InfoizeProject(this.project))
        })
      },
      error: err => {
        console.log('err gpbe', err)
        this.project = MakeNewProject(sessionEmail);
        this.initVars()
        this.project.updateEmitter.subscribe(() => {
          firebaseService.saveProject(this.projectKey, InfoizeProject(this.project))
        })
      },
      complete: () => {
        console.log('Project Loaded!')
        this.loading = false;
      }
    });
    this.keyboardStatus = {
      "a": keyStatus.notPlaying,
      "w": keyStatus.notPlaying,
      "s": keyStatus.notPlaying,
      "e": keyStatus.notPlaying,
      "d": keyStatus.notPlaying,
      "f": keyStatus.notPlaying,
      "t": keyStatus.notPlaying,
      "g": keyStatus.notPlaying,
      "y": keyStatus.notPlaying,
      "h": keyStatus.notPlaying,
      "u": keyStatus.notPlaying,
      "j": keyStatus.notPlaying,
      "k": keyStatus.notPlaying,
      "o": keyStatus.notPlaying,
      "l": keyStatus.notPlaying,
      "p": keyStatus.notPlaying,
      ";": keyStatus.notPlaying,
    };
    
    Tone.start();
  }
  //status$: Observable<any>;
  masterVolume: number = 0;
  isPlaying: boolean = false;
  tempo: number = 120; //default
  bars : number = 16;
  signature: number = 4;
  maxVW: number = 0;
  timeoutValue: number = (60 / this.tempo) * 1000; //in ms
  synth!: MidiInstrument;
  metronome!: Metronome;
  selectedTrack!: MidiTrack;
  // tracks: Set<MidiTrack>;
  tracks!: Set<MidiTrack>;
  metronomeOn: boolean = true;
  currentRecording!: Recording;
  recordings!: Map<number, Recording>;
  isRecording: boolean = false;
  keyboardStatus: Record<string, number>;
  public trackIdCounter: number = 0;
  controlEvent = controlStatus.reset;

  public isExpanded = false;
  public showSelectInstrument = false;

  public octave = 4;
  public showEditor: boolean = false;
  public isDrums: boolean = false;
  public blockMode: BlockMode = BlockMode.Block;
  public isTutorial: boolean = false;
  public tutorialState = 0;

  midiContainerRef: Element | any;

  public reRender: number = 0;

  public newTrackInstrument: boolean = false;

  initVars() {
    this.masterVolume = this.project.masterVolume;
    this.synth = this.project.tracks[0].instrument;
    this.tempo = this.project.tempo;
    this.signature = this.project.signature;
    this.metronome = this.project.metronome;
    this.selectedTrack = this.project.tracks[0]
    this.tracks = new Set<MidiTrack>();
    this.tracks.add(this.selectedTrack);
    this.currentRecording = this.project.tracks[0].midi;
    this.recordings = new Map<number, Recording>();
    for (let i = 0; i < this.project.tracks.length; i++) {
      this.tracks.add(this.project.tracks[i]);
      this.recordings.set(this.project.tracks[i].id, this.project.tracks[i].midi);
      this.trackIdCounter = Math.max(this.trackIdCounter, this.project.tracks[i].id)
    }
    this.trackIdCounter++;
  }

  ngAfterViewInit() {
    // this.midiContainerRef = this._renderer.selectRootElement('#midiContainer');
    // this.midiContainerRef = this.midiContainerElementRef;
    this.midiContainerRefs?.changes.subscribe((changes: QueryList<Element | any>)  => {
      this.midiContainerRef = changes.first.nativeElement;
      console.log('>?>?>?>?>?>?>?>?>?>?>?>?>VIEW INITIED:', this.midiContainerRef.nativeElement);
    });
  }

  onReRender(num: number) {
    this.reRender = num;
    console.log('rerendering from home');
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  promptNewTrackInstrument() {
    this.newTrackInstrument = true;
    this.showSelectInstrument = !this.showSelectInstrument;
  }

  promptChangeTrackInstrument() {
    this.newTrackInstrument = false;
    this.showSelectInstrument = !this.showSelectInstrument;
  }

  newTrack(instrument: MidiInstrument) {
    if (!this.isRecording) {
      this.trackIdCounter++;
      const newTrack = new MidiTrack('Untitled Track', this.trackIdCounter, instrument, true);
      this.tracks.add(newTrack);
      this.project.addTrack(newTrack);
      this.setSelectedTrack(newTrack);
      this.showSelectInstrument = false;
    }
  }

  changeTrackInstrument(instrument: MidiInstrument) {
    if (!this.isRecording) {
      this.selectedTrack.instrument = instrument;
      this.setSelectedTrack(this.selectedTrack);
      this.project.changeTrackInstrument(this.selectedTrack.id, instrument);
      this.project.updateTrackRecordingAtId(this.selectedTrack.id, this.recordings.get(this.selectedTrack.id) as Recording);
      this.showSelectInstrument = false;
    }
  }

  onDeleteTrack(trackId: number) {
    if (!this.isRecording) {
      this.recordings.delete(trackId);
      this.project.deleteTrack(trackId);
      if (this.selectedTrack.id == trackId) {
        this.setSelectedTrack(this.project.tracks[0]);
      }
    }
  }

  setSelectedTrack(track: MidiTrack) {
    if (!this.isRecording) {
      const temp = this.selectedTrack;
      temp.selected = false;
      this.selectedTrack = track;
      this.selectedTrack.selected = true;
      if (this.selectedTrack.instrument.name === "Drums") {
        this.isDrums = true;
      }
      else {
        this.isDrums = false;
      }
      this.setRecordingToTrack(this.selectedTrack.id);
      console.log(`Selected track: ${this.selectedTrack.title}`, track.title);
    }
  }

  synthOnKeydown(key: string) {
    if (this.keyboardStatus[key] != keyStatus.isPlaying) {
      this.keyboardStatus[key] = keyStatus.isPlaying;
      let note = this.selectedTrack.instrument.Play(key);
      if (this.isRecording) this.currentRecording.RecordNote(note);
    }
  }

  synthOnKeyup(key: string) {
    if (this.keyboardStatus[key] == keyStatus.isPlaying) {
        this.keyboardStatus[key] = keyStatus.notPlaying;
        let note = this.selectedTrack.instrument.Release(key);
        if (this.isRecording) this.currentRecording.AddRelease(note);
    }
  }

  onPlay(event: boolean) {
    if (!this.isPlaying) {
      // this.selectedTrack.instrument.AdjustVolume(-100);
      // this.selectedTrack.instrument.Play('a');
      // this.selectedTrack.instrument.Release('a');
      // setTimeout(() => {
      //   this.selectedTrack.instrument.AdjustVolume(0);
      // }, 500);
      this.isPlaying = true;
      this.metronome.ClearTransport();
      Array.from(this.recordings.values()).forEach((r: Recording) => {
        SchedulePlayback(r);
        console.log('recording', r);
      });
      this.metronome.Start();
    }
    this.controlEvent = controlStatus.play;
  }

  onPause(event : boolean) {
    this.isPlaying = false;
    if (this.isRecording) this.onStopRecord();
    this.isRecording = false;
    this.metronome.Pause();
    this.controlEvent = controlStatus.pause;
    //this.firebaseService.saveProject(this.projectKey, InfoizeProject(this.project))
  }

  onRewind(event: boolean) {
    this.onPause(event);
    this.metronome.Reset();
    this.controlEvent = controlStatus.reset;
  }

  onRecord(event: boolean) {
    if (!this.isRecording) this.isRecording = true;
    else {
      this.isRecording = false
      this.onPause(event);
      this.onStopRecord();
      return;
    }
    if (!this.isPlaying) this.onPlay(true);
    if (this.isPlaying) this.isRecording = true;
  }

  handleSliderChange(event: any) {
    const nearest = event;
    const setBar = Math.floor((nearest / 10));
    const setBeat = (nearest % 10);
    this.metronome.OnPositionChange(setBar, setBeat);
  }

  catchSliderStartPos(event: any) {
    this.maxVW = event;
  }

  public editMode: boolean = false;

  openEditor() {
    this.blockMode = BlockMode.Editor;
    this.showEditor = true;
    console.log('opening editor', this.showEditor);
  }

  closeEditor(bool: boolean) {
    this.blockMode = BlockMode.Block;
    this.showEditor = bool;
  }

  /**
   * Called when recording is stopped. 
   * Updates the recordings map with key: selectedTrackid and value: currentRecording
   * Calls @method setRecordingToTrack(selectedTrack.id)
   */
  private onStopRecord() {
    this.recordings.set(this.selectedTrack.id, this.currentRecording);
    this.selectedTrack.midi = this.currentRecording;
    this.setRecordingToTrack(this.selectedTrack.id);
  }

  /**
   * @param id: id of track to set recording data to
   * updates currentRecording value to currently stored recording data at @param id
   * If the selected track has no recording data, create a new empty recording with the track's current instrument
   */
  private setRecordingToTrack(id: number) {
    let recordingAtId = this.recordings.has(id)
      ? this.recordings.get(id)
      : new Recording(this.selectedTrack.instrument);
    this.currentRecording = recordingAtId || new Recording(this.selectedTrack.instrument);
    this.project.updateTrackRecordingAtId(id, this.currentRecording)
  }

  /**
   * @param track: might not be needed? idk angular sucks
   * Runs every time a different track is selected.
   * Calls @method setRecordingToTrack() with the currently selected track.
   */
  onSelectedTrackChange(track: MidiTrack) {
    this.setRecordingToTrack(this.selectedTrack.id);
    this.octave = this.selectedTrack.instrument.currentOctave;
    console.log('track changes are being made');
  }

  onUndo(event: number) {
    console.log('undo clicked');
  }

  onIncreaseOctave() {
    this.selectedTrack.instrument.increaseOctave();
    this.octave = this.selectedTrack.instrument.currentOctave;
    // if (this.octave < 7) this.octave++;
  }

  onDecreaseOctave() {
    this.selectedTrack.instrument.decreaseOctave();
    this.octave = this.selectedTrack.instrument.currentOctave;
    //if (this.octave > 0) this.octave--;
  }

  onMainVolumeChange(event: number) {
    this.masterVolume = event;
    this.adjustMasterVolume(this.masterVolume);
  }

  bounceToMP3() {
    BounceProjectToMP3(this.project);
  }
  
  /**
   * Changes master node volume level.
   * @param db The new value for master volume
   */
  private adjustMasterVolume(db: number) {
    Tone.Destination.volume.value = db;
    this.project.masterVolume = db;
  }

  // /**
  //  * Uses keyboard status dictionary (scheduled on note plays) to record correct attack & release time
  //  */
  // PlayRelease() {
  //   let key;
  //   for (let k in this.keyboardStatus) {
  //     switch (this.keyboardStatus[k]) {
  //       case keyStatus.toAttack: //to play
  //         this.keyboardStatus[k] = keyStatus.isPlaying;
  //         key = this.synth.Play(k);
  //         if (this.isRecording) this.currentRecording.RecordNote(key);
  //         break;
  //       case keyStatus.toRelease:
  //         this.keyboardStatus[k] = keyStatus.notPlaying;
  //         key = this.synth.Release(k);
  //         if (this.isRecording) this.currentRecording.AddRelease(key);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }
  
  onTutorialNext() {
    const header = <HTMLElement>document.getElementById("tutorialInstructionsHeader");
    const body = <HTMLElement>document.getElementById("tutorialInstructionsBody");
    const mainCtrl = <HTMLElement>document.getElementById("center-main-controls")
    const volume = <HTMLElement>document.getElementById("volume")
    const togglePiano = <HTMLElement>document.getElementById("togglePiano")
    const piano = <HTMLElement>document.getElementById("piano")
    const octaveInc = <HTMLElement>document.getElementById("octaveInc")
    const octaveDec = <HTMLElement>document.getElementById("octaveDec")
    const tracks = <HTMLElement>document.getElementById("tracks")
    const editor = <HTMLElement>document.getElementById("midi-editor")
    if (this.tutorialState == 0) {
        header.textContent = "Welcome To Cloud DAW"
        body.textContent = "Here at cloud DAW, we stand for simplicity and making music creation accessible to all! Throughout this tutorial we will introduce you to most of the tools you have at your fingertips to make your wildest musical dream a reality. \n\n Follow along with the red rectangles. \nClick Next to go to the next page."
    }
    // main controls
    else if (this.tutorialState == 1) {
        mainCtrl.style.border = "3px #22C55E solid"
        header.textContent = "Main Controls"
        body.textContent = "These are your main controls, you can Rewind, Play, Pause, or Record respectively with these buttons. Hit record and begin playing music to record the notes you play. Hit record again, or pause, to stop recording. Hit rewind or drag the slider to the desired position, then click play to listen to what you have recorded."
    }
    // volume
    else if (this.tutorialState == 2) {
        mainCtrl.style.border = "none"
        volume.style.border = "3px #22C55E solid"
        header.textContent = "Volume Control"
        body.textContent = "You can use this slider to control the master volume of your tracks"
    }
    // piano toggle button
    else if (this.tutorialState == 3) {
        volume.style.border = "none"
        header.textContent = "Piano"
        togglePiano.style.border = "3px #22C55E solid"
        body.textContent = "Press the Show/Hide Instrument button to see the instrument"
    }
    // piano
    else if (this.tutorialState == 4) {
        this.isExpanded = true;
        togglePiano.style.border = "none"
        piano.style.border = "3px #22C55E solid"
        body.textContent = "Press the keys displayed on the instrument to create the notes they correspond to."
    }
    // octave control
    else if (this.tutorialState == 5) {
        piano.style.border = "none"
        octaveInc.style.border = "3px #22C55E solid"
        octaveDec.style.border = "3px #22C55E solid"
        header.textContent = "Octaves"
        body.textContent = "Eventhough only a single octave of keys is displayed at a time, you can use these buttons to increase or decrease an octave and use the same keys."
    }
    // tracks
    else if (this.tutorialState == 6) {
        this.isExpanded = false
        octaveInc.style.border = "none"
        octaveDec.style.border = "none"
        tracks.style.border = "3px #22C55E solid"
        header.textContent = "Tracks"
        body.textContent = "Here is a list of all of your tracks, You can use 'Add Track' to be prompted to select an instrument to use to add a new track. You can select tracks by clicking on them, or remove them."
    }
    // Opening Editor
    else if (this.tutorialState == 7) {
        tracks.style.border = "none"
        header.textContent = "Editor"
        body.textContent = "You can double click any track to open the editing window for the track."
        this.showEditor = true
    }

    // editor
    else if (this.tutorialState == 8) {
        const nextBtn = <HTMLElement>document.getElementById("next-button-tutorial")
        nextBtn.textContent = "Finish"
        header.textContent = "Editor"
        body.textContent = "In this editor window, you can edit the horizontal position of each note by clicking it and dragging it to the desired position. You can also select a note and pitch it up or down using the up and down arrow keys respectively."
        editor.style.border = "3px #22C55E solid"
    }
    else {
        editor.style.border = "none"
        const instructions = <HTMLElement>document.getElementById("tutorialInstructions")
        instructions.style.display = "none"
        const nextBtn = <HTMLElement>document.getElementById("next-button-tutorial")
        nextBtn.textContent = "Next"
        this.tutorialState = 0
        this.isTutorial = false
        this.isExpanded = false
        this.showEditor = false
        // there is no need to automatically open tutorials if user completed tutorials once.
        localStorage.setItem('isTutorial', "false")
    }
    this.tutorialState++; 
  }

  onTutorial() {
    this.isTutorial = !this.isTutorial;

    // there is no need to automatically open tutorials if user chooses to close it once.
    localStorage.setItem('isTutorial', "false")
    // reset tutorial state so that tutorial always starts from the beginning.
    this.tutorialState = 0;
    this.onTutorialNext();

    // toggle the necessary elements of the tutorial.
    const nextBtn = <HTMLElement>document.getElementById("next-button-tutorial");
    const instructions = <HTMLElement>document.getElementById("tutorialInstructions");
    if (this.isTutorial) {
        nextBtn.style.display = "block";
        instructions.style.display = "block";
    } else{
        nextBtn.style.display = "none";
        instructions.style.display = "none";
        const mainCtrl = <HTMLElement>document.getElementById("center-main-controls")
        const volume = <HTMLElement>document.getElementById("volume")
        const togglePiano = <HTMLElement>document.getElementById("togglePiano")
        const piano = <HTMLElement>document.getElementById("piano")
        const octaveInc = <HTMLElement>document.getElementById("octaveInc")
        const octaveDec = <HTMLElement>document.getElementById("octaveDec")
        const tracks = <HTMLElement>document.getElementById("tracks")

        mainCtrl.style.border = "none"
        volume.style.border = "none"
        togglePiano.style.border = "none"
        piano.style.border = "none"
        octaveInc.style.border = "none"
        octaveDec.style.border = "none"
        tracks.style.border = "none"
    }
  }

  onLogout(){
    this.firebaseService.logout();
    this._router.navigateByUrl('/login');
  }  

  ngOnChanges(changes: SimpleChanges) {
    console.log('home level changes: ', changes);
  }

  ngOnInit() {
    //if (this.keyboardStatus[event.key] != keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toAttack; //schedules attack
    this.isTutorial = "true" == localStorage.getItem('isTutorial');
    // toggle the necessary elements of the tutorial.
    const nextBtn = <HTMLElement>document.getElementById("next-button-tutorial");
    const instructions = <HTMLElement>document.getElementById("tutorialInstructions");
    if (this.isTutorial) {
        nextBtn.style.display = "block";
        instructions.style.display = "block";
    }
    // reset tutorial state so that tutorial always starts from the beginning.
    this.tutorialState = 0;
    this.onTutorialNext();
  }

}