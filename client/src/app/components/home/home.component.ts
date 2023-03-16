import { Component, HostListener, SimpleChanges, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Metronome } from '../../models/instruments/metronome';
import { MidiInstrument } from '../../models/instruments/midi-instrument'; //for now, do here -> in future, put in track
import { MidiControllerComponent } from '../midi-controller/midi-controller.component';
import { Recording } from '../../models/recording/recording';
import { Note } from '../../models/recording/note';
import { SchedulePlayback } from '../../services/recording/playback-service.service';
import { ApiHttpService } from '../../services/http/httpservice.service';
import * as Tone from 'tone'; 
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { MidiTrackComponent } from '../midi-track/midi-track.component';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { SliderComponent } from '../controls/slider/slider/slider.component';
import { MidiBlockComponent } from '../midi-block/midi-block.component';
  
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../midi-track/midi-track.component.css']
})
export class HomeComponent implements OnInit{
  @ViewChildren('blockRef') blockRefs?: QueryList<MidiBlockComponent>;

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


  currMousekey : string = '';

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
  
  constructor(public firebaseService: FirebaseService, public ApiHttpService: ApiHttpService, public _router: Router) {
    this.synth = new MidiInstrument("test");
    this.controller = new MidiControllerComponent(this.synth);
    this.tempo = 120;
    this.signature = 4;
    this.metronome = new Metronome(this.tempo, this.signature); //120 bpm at 4/4
    this.selectedTrack = new MidiTrack('Track 0', 0, this.synth, true);
    this.tracks = new Set<MidiTrack>();
    this.tracks.add(this.selectedTrack);
    this.currentRecording = new Recording(this.synth);
    this.recordings = new Map<number, Recording>();
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
  synth: MidiInstrument;
  controller: MidiControllerComponent;
  metronome: Metronome;
  selectedTrack: MidiTrack;
  // tracks: Set<MidiTrack>;
  tracks: Set<MidiTrack>;
  metronomeOn: boolean = true;
  currentRecording: Recording;
  recordings: Map<number, Recording>;
  isRecording: boolean = false;
  keyboardStatus: Record<string, number>;
  public trackIdCounter: number = 0;
  controlEvent = controlStatus.reset;

  public isExpanded = false;
  public isTutorial: boolean = false;
  public tutorialState = 0;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  newTrack() {
    this.trackIdCounter++;
    let newTrack = new MidiTrack(`Track ${this.trackIdCounter}`, this.trackIdCounter, this.synth, true);
    this.tracks.add(newTrack);
    this.selectedTrack = newTrack;
    this.updateRecording(this.selectedTrack.id);
  }

  synthOnKeydown(key: string) {
    if (this.keyboardStatus[key] != keyStatus.isPlaying) {
      this.keyboardStatus[key] = keyStatus.isPlaying;
      let note = this.synth.Play(key);
      if (this.isRecording) this.currentRecording.RecordNote(note);
    }
  }

  synthOnKeyup(key: string) {
    if (this.keyboardStatus[key] == keyStatus.isPlaying) {
        this.keyboardStatus[key] = keyStatus.notPlaying;
        let note = this.synth.Release(key);
        if (this.isRecording) this.currentRecording.AddRelease(note);
    }
  }

  onPlay(event: boolean) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.metronome.ClearTransport();
      Array.from(this.recordings.values()).forEach((r: Recording) => {
        SchedulePlayback(r.data, r.synth)
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
  }

  onRewind(event : boolean) {
    this.metronome.Reset();
    this.controlEvent = controlStatus.reset;
  }

  onRecord(event: boolean) {
    if (!this.isRecording) this.isRecording = true;
    if (!this.isPlaying) this.onPlay(true);
    else {
      this.isRecording = false
      this.onStopRecord();
    }
  }

  handleSliderChange(event: any) {
    console.log('slider change: ' + event);
    const nearest = event;
    const setBar = Math.floor((nearest / 10));
    const setBeat = (nearest % 10);
    this.metronome.OnPositionChange(setBar, setBeat);
  }

  catchSliderStartPos(event: any) {
    this.maxVW = event;
    console.log('caught: ' + this.maxVW);
  }

  /**
   * Called when recording is stopped. 
   * Updates the recordings map with key: selectedTrackid and value: currentRecording
   * Calls @method updateRecording(selectedTrack.id)
   */
  private onStopRecord() {
    this.recordings.set(this.selectedTrack.id, this.currentRecording);
    this.selectedTrack.midi = this.currentRecording;
    this.updateRecording(this.selectedTrack.id);
    // this.blockRefs?.forEach((block) => {
    //   if (block.track.id == this.selectedTrack.id) {
    //     block.updateVisual();
    //   }
    // });
    console.log(this.recordings);
  }

  /**
   * @param id: id of track to set recording data to
   * updates currentRecording value to currently stored recording data at @param id
   * If the selected track has no recording data, create a new empty recording with the track's current instrument
   */
  private updateRecording(id: number) {
    let recordingAtId = this.recordings.has(id)
      ? this.recordings.get(id)
      : new Recording(this.selectedTrack.instrument);
    this.currentRecording = recordingAtId || new Recording(this.selectedTrack.instrument);
  }

  /**
   * @param track: might not be needed? idk angular sucks
   * Runs every time a different track is selected.
   * Calls @method updateRecording() with the currently selected track.
   */
  onSelectedTrackChange(track: MidiTrack) {
    this.updateRecording(this.selectedTrack.id);
    console.log(this.selectedTrack.title, this.selectedTrack.midi.data);
  }

  onUndo(event: number) {
    console.log('undo clicked');
    console.log(event);
  }

  onIncreaseOctave() {
    this.selectedTrack.instrument.increaseOctave();
  }

  onDecreaseOctave() {
    this.selectedTrack.instrument.decreaseOctave();
  }

  onMainVolumeChange(event: number) {
    this.masterVolume = event;
    this.adjustMasterVolume(this.masterVolume);
  }
  
  /**
   * Changes master node volume level.
   * @param db The new value for master volume
   */
  private adjustMasterVolume(db: number) {
    Tone.Destination.volume.value = db;
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
    if (this.tutorialState == 0) {
        header.textContent = "Welcome To Cloud DAW"
        body.textContent = "Here at cloud DAW, we stand for simplicity and making music creation accessible to all! Throughout this tutorial we will introduce you to most of the tools you have at your fingertips to make your wildest musical dream a reality. \n\n Follow along with the red rectangles. \nClick Next to go to the next page."
    }
    // main controls
    else if (this.tutorialState == 1) {
        mainCtrl.style.border = "3px #22C55E solid"
        header.textContent = "Main Controls"
        body.textContent = "These are your main controls, you can Rewind, Play, Pause, or Record respectively with these buttons. < Add more info. about them here >"
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
        body.textContent = "Press the Show/Hide Piano button to see the piano"
    }
    // piano
    else if (this.tutorialState == 4) {
        this.isExpanded = true;
        togglePiano.style.border = "none"
        piano.style.border = "3px #22C55E solid"
        body.textContent = "Press the keys displayed on the piano keys to create the notes they correspond to."
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
        octaveInc.style.border = "none"
        octaveDec.style.border = "none"
        tracks.style.border = "3px #22C55E solid"
        const nextBtn = <HTMLElement>document.getElementById("next-button-tutorial")
        nextBtn.textContent = "Finish"
        header.textContent = "Tracks"
        body.textContent = "Here is a list of all of your tracks, You can use 'Add Track' to add a new track, select tracks by clicking on them, or remove them."
    }
    else {
        tracks.style.border = "none"
        const instructions = <HTMLElement>document.getElementById("tutorialInstructions")
        instructions.style.display = "none"
        const nextBtn = <HTMLElement>document.getElementById("next-button-tutorial")
        nextBtn.textContent = "Next"
        this.tutorialState = 0
        this.isTutorial = false
        this.isExpanded = false
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

  ngOnInit(){
    this.isTutorial = "true" == localStorage.getItem('isTutorial');
    console.log()
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