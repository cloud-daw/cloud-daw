import { first } from 'rxjs/operators';
import { Component, AfterViewInit, HostListener, SimpleChanges, ViewChildren, QueryList, OnInit,Input, Renderer2, EventEmitter, Output, ElementRef, ViewChild, AfterViewChecked  } from '@angular/core';
import { Observable } from 'rxjs';
import { Metronome } from '../../models/instruments/metronome';
import { MidiInstrument } from '../../models/instruments/midi-instrument'; //for now, do here -> in future, put in track
import { Project } from '../../models/project'
import { ProjectInfo } from 'src/app/models/db/project-info';
import { Recording } from '../../models/recording/recording';
import { Note } from '../../models/recording/note';
import { SchedulePlayback, ScheduleAudioPlayback } from '../../services/recording/playback-service.service';
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
import { ProjectManagementService } from 'src/app/services/project-management.service';
import { AudioTrack } from 'src/app/models/instruments/audio-track';
import { GetAllSynthKeywords, GetSynthByKeyword } from 'src/app/lib/dicts/synthdict';
  
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
export class HomeComponent implements AfterViewInit, OnInit, AfterViewChecked{
  
  @ViewChildren('blockRef') blockRefs?: QueryList<MidiBlockComponent>;
  // @ViewChild('midiContainerRef', { static: false }) midiContainerRef: ElementRef | any;
  @ViewChildren('midiContainer') midiContainerRefs?: QueryList<Element | any>;

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    if(this.editingMode == false) {
      this.synthOnKeydown(event.key);
      //if (this.keyboardStatus[event.key] != keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toAttack; //schedules attack
      let myDiv = document.getElementById(event.key);
      if(this.isDrums) {
        myDiv = document.getElementById(event.key+'1');
      }
      console.log(myDiv);
      if (myDiv) {
        myDiv.classList.add("active");
      }
  }
    //this.PlayRelease();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {


    if(this.editingMode == false) {
      this.synthOnKeyup(event.key);

      //if (this.keyboardStatus[event.key] == keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toRelease; //schedules release
      let myDiv = document.getElementById(event.key);
      if(this.isDrums) {
        myDiv = document.getElementById(event.key+'1');
      }
      if (myDiv) {
        myDiv.classList.remove("active");
        console.log('test');
      }
      //this.PlayRelease();
  }
  }


  currMousekey: string = '';

  @HostListener('window:mouseup', ['$event'])
  handleMouseupEvent(event: MouseEvent) {
    if (this.currMousekey != '') {
      let myDiv = document.getElementById(this.currMousekey);
      if(this.isDrums) {
        myDiv = document.getElementById(this.currMousekey+'1');
      }  
      if (myDiv) {
        myDiv.classList.remove("active");
      }
    }
    this.synthOnKeyup(this.currMousekey);
    this.currMousekey = '';
  }

  onTrackUpdated(track: MidiTrack) {
    console.log('track updated');
    this.selectedTrack = track;
    //this.project.save();
    console.log(this.project);
    // console.log('from home', this.selectedTrack.midi.data);
  }

  onKeyMousedown(key: string) {
    this.currMousekey = key;
    let myDiv = document.getElementById(this.currMousekey);
    if(this.isDrums) {
      myDiv = document.getElementById(this.currMousekey+'1');
    }
    if (myDiv) {
      myDiv.classList.add("active");
    }
    this.synthOnKeydown(key);
  }

  onKeyMouseup(key: string) {
    if (this.currMousekey != '') {
      let myDiv = document.getElementById(this.currMousekey);
      if(this.isDrums) {
        myDiv = document.getElementById(this.currMousekey+'1');
      }  
      if (myDiv) {
        myDiv.classList.remove("active");
      }
    }
    this.synthOnKeyup(this.currMousekey);
    this.currMousekey = '';
  }
  // projects
  @Input() projectName: string = '';
  @Input() projectInfo!: ProjectInfo;
  @Input() projectKey: string = '';
  @Output() close = new EventEmitter<void>();
  projectFound : boolean = false;
  isNew: boolean = false;
  audio: AudioTrack = new AudioTrack('audio 1');

  project!: Project;
  loading: boolean = true;
  constructor(public firebaseService: FirebaseService, public _router: Router, private _renderer: Renderer2, private projectManagement: ProjectManagementService) {
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

  public isExpanded: boolean = true;
  public showSelectInstrument: boolean = false;
  public showUploadAudio: boolean = false;

  public octave = 4;
  public showEditor: boolean = false;
  public isDrums: boolean = false;
  public blockMode: BlockMode = BlockMode.Block;
  public isTutorial: boolean = false;
  public tutorialState = 0;

  midiContainerRef: Element | any;

  public reRender: number = 0;

  public newTrackInstrument: boolean = false;
  instruments: string[] = GetAllSynthKeywords();

  initVars() {
    this.masterVolume = this.project.masterVolume;
    this.synth = this.project.tracks[0].instrument;
    this.tempo = this.project.tempo;
    this.timeoutValue = (60 / this.tempo) * 1000; //in ms
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
    // // this.midiContainerRef = this._renderer.selectRootElement('#midiContainer');
    // // this.midiContainerRef = this.midiContainerElementRef;
    // this.midiContainerRefs?.changes.subscribe((changes: QueryList<Element | any>)  => {
    //   this.midiContainerRef = changes.first.nativeElement;
    //   console.log('>?>?>?>?>?>?>?>?>?>?>?>?>VIEW INITIED:', this.midiContainerRef.nativeElement);
    // });
  }

  ngAfterViewChecked() {
    if (!this.midiContainerRef) {
      const firstRef = this.midiContainerRefs?.first;
      if (firstRef) {
        this.midiContainerRef = firstRef.nativeElement;
        console.log('>?>?>?>?>?>?>?>?>?>?>?>?>VIEW INITIALIZED:', this.midiContainerRef.nativeElement);
      }
    }
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
    this.showSelectInstrument = true;
  }

  promptNewAudioTrack(e: any) {
    // this.newAudioTrack = true;
    if (e.target && e.target.files.length > 0) {
      this.showUploadAudio = !this.showUploadAudio;
      this.createNewAudioTrack(e);
    }
  }

  promptChangeTrackInstrument() {
    this.newTrackInstrument = false;
    this.showSelectInstrument = !this.showSelectInstrument;
  }

  createNewAudioTrack(e: any) {
    if (!this.isRecording) {
      this.trackIdCounter++;
      const newAudioTrack = new MidiTrack('Untitled Audio Track', this.trackIdCounter, new MidiInstrument(''), true, true);
      newAudioTrack.setAudio(e.target.files[0], () => {
        this.tracks.add(newAudioTrack);
        this.project.addTrack(newAudioTrack);
        this.setSelectedTrack(newAudioTrack);
      })
    }
  }

  //new Midi Track
  newTrack(inst: string) {
    const instrument = GetSynthByKeyword(inst);
    if (!this.isRecording) {
      this.trackIdCounter++;
      const newTrack = new MidiTrack('Untitled Track', this.trackIdCounter, instrument, true);
      this.tracks.add(newTrack);
      this.setSelectedTrack(newTrack);
      this.project.addTrack(newTrack);
      this.showSelectInstrument = false;
    }
  }

  changeTrackInstrument(inst: string) {
    const instrument = GetSynthByKeyword(inst);
    if (!this.isRecording) {
      this.selectedTrack.instrument = instrument;
      this.project.changeTrackInstrument(this.selectedTrack.id, instrument);
      this.setRecordingToTrack(this.selectedTrack.id); 
      if (this.recordings.has(this.selectedTrack.id)) {
        this.recordings.get(this.selectedTrack.id)!.synth = instrument;
      } 
      this.showSelectInstrument = false;
      console.log('in change track instrument');
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

  onEditTrackName(value: boolean) {
    this.editingMode = value;
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
      this.isPlaying = true;
      this.metronome.ClearTransport();
      let thing : {isAudio: boolean, recording: Recording | undefined, audio: AudioTrack | undefined};
      this.tracks.forEach((track) => {
        thing = track.GetThingForPlayback();
        if (thing.isAudio && thing.audio) {
          ScheduleAudioPlayback(thing.audio)
        }
        else if (thing.recording) {
          SchedulePlayback(thing.recording)
        }
      })
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
  public editingMode: boolean = false;


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
    this.project.updateTrackRecordingAtId(this.selectedTrack.id, this.currentRecording)
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
  
  onTrackChange(track: MidiTrack) {
    this.project.save();
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

  onTempoChange(event: number) {
    console.log('catching change tempo', event);
    this.metronome.SetTempo(event);
    this.project.tempo = event;
    this.tempo = event;
    this.project.save();
  }

  onMainVolumeChange(event: number) {
    this.masterVolume = event;
    this.adjustMasterVolume(this.masterVolume);
    this.project.masterVolume = this.masterVolume;
    this.project.save();
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
    console.log(this.tutorialState)
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

  onProjects(){
    console.log("going to projects")
    this.close.emit();
  }

  onLogout(){
    this.firebaseService.logout();
    this._router.navigateByUrl('/login');
  }  

  ngOnChanges(changes: SimpleChanges) {
    console.log('home level changes: ', changes);
  }

  async getProjectKey(projectName: string) : Promise<string> {
    console.log("Trying to get key from project name")
    let foundKey = ""
    const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
    return new Promise((resolve, reject) => {
        this.firebaseService.getProjectByEmail(sessionEmail).pipe().subscribe(x => {
            for (let i = 0; i < x.length; i++) {
                if (projectName === x[i].name) {
                    resolve(x[i].key)
                }
            }
            reject()
        });
    })
    
  }

  goHomeOnUndefined() {
      localStorage.setItem("inProject", "false")
      localStorage.removeItem('openProjectName')
      this.close.emit();
  }

  async ngOnInit(){
    //no longer async
    this.isTutorial = "true" == localStorage.getItem('isTutorial');
    try {
      this.project = HydrateProjectFromInfo(this.projectInfo);
      if (this.project === undefined) throw new Error('project undefined');
    } catch (err){
      this.goHomeOnUndefined();
    }
    
    console.log(this.projectInfo)
    console.log('KEY:', this.projectKey);
    this.initVars();
    this.getProjectKey(this.projectName).then((key) => {
      this.project.updateEmitter.subscribe(() => {
        console.log("updateEmitter event emitted.");
        console.log("project name in ngonInit: " + this.projectName);
        this.firebaseService.saveProject(key, InfoizeProject(this.project))
      })
  }).catch((err) => {this.goHomeOnUndefined()});
    // toggle the necessary elements of the tutorial.
    const nextBtn = <HTMLElement>document.getElementById("next-button-tutorial");
    const instructions = <HTMLElement>document.getElementById("tutorialInstructions");

    this.loading = false; //putting this below the next block breaks for some reason

    if (this.isTutorial) {
        nextBtn.style.display = "block";
        instructions.style.display = "block";
    }

    // reset tutorial state so that tutorial always starts from the beginning.
    this.tutorialState = 0;
  }

}