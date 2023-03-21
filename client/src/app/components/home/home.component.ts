import { Component, HostListener, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { first } from 'rxjs/operators';
import { Metronome } from '../../models/instruments/metronome';
import { MidiInstrument } from '../../models/instruments/midi-instrument'; //for now, do here -> in future, put in track
import {Project} from '../../models/project'
import { Recording } from '../../models/recording/recording';
import { Note } from '../../models/recording/note';
import { SchedulePlayback } from '../../services/recording/playback-service.service';
import * as Tone from 'tone'; 
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { SliderComponent } from '../controls/slider/slider/slider.component';
import { MidiBlockComponent } from '../midi/midi-block/midi-block.component';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
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
  constructor(public firebaseService: FirebaseService, public _router: Router) {
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

  public isExpanded: boolean = false;
  public showSelectInstrument: boolean = false;

  public octave: number = 4;

  public showEditor: boolean = false;

  public editMode: boolean = false;

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
    this.loading = false;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  promptSelectInstrument() {
    this.showSelectInstrument = !this.showSelectInstrument;
  }

  newTrack(instrument: MidiInstrument) {
    if (!this.isRecording) {
      this.trackIdCounter++;
      const newTrack = new MidiTrack(`Track ${this.trackIdCounter}`, this.trackIdCounter, instrument, true);
      this.tracks.add(newTrack);
      this.project.addTrack(newTrack);
      this.setSelectedTrack(newTrack);
      this.showSelectInstrument = false;
    }
  }

  onDeleteTrack(trackId: number) {
    this.recordings.delete(trackId);
    this.project.deleteTrack(trackId);
  }

  setSelectedTrack(track: MidiTrack) {
    if (!this.isRecording) {
      const temp = this.selectedTrack;
      temp.selected = false;
      this.selectedTrack = track;
      this.selectedTrack.selected = true;
      this.setRecordingToTrack(this.selectedTrack.id);
      console.log(`Selected track: ${this.selectedTrack.title}`, track.title);
    }
  }

  /**
   * Set the selected track if midi block is clicked once. 
   */
  // setSelectedTrackFromBlock(track: MidiTrack) {
  //   if (!this.isRecording) {
  //     this.isSingleClick = true;
  //     setTimeout(()=>{
  //       if(this.isSingleClick) {
  //         const temp = this.selectedTrack;
  //         temp.selected = false;
  //         this.selectedTrack = track;
  //         this.selectedTrack.selected = true;
  //         this.setRecordingToTrack(this.selectedTrack.id);
  //         console.log(`Selected track: ${this.selectedTrack.title}`, track.title);
  //       }
  //     }, 250)
  //   }
  // }

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
    //this.firebaseService.saveProject(this.projectKey, InfoizeProject(this.project))
  }

  onRewind(event: boolean) {
    this.onPause(event);
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
    const nearest = event;
    const setBar = Math.floor((nearest / 10));
    const setBeat = (nearest % 10);
    this.metronome.OnPositionChange(setBar, setBeat);
  }

  catchSliderStartPos(event: any) {
    this.maxVW = event;
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
    const recordingAtId = this.recordings.has(id)
      ? this.recordings.get(id)
      : new Recording(this.selectedTrack.instrument);
    this.currentRecording = recordingAtId || new Recording(this.selectedTrack.instrument);
    this.project.updateTrackRecordingAtId(id, this.currentRecording)
  }

  

  onUndo(event: number) {
    console.log('undo clicked');
  }

  onIncreaseOctave() {
    this.selectedTrack.instrument.increaseOctave();
    if (this. octave < 7) this.octave++;
  }

  onDecreaseOctave() {
    this.selectedTrack.instrument.decreaseOctave();
    if (this. octave > 0) this.octave--;
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
    this.project.masterVolume = db;
  }

  

  openMidiEditor() {
    this.showEditor = true;
    console.log('open dit?', this.showEditor);
  }

  closeMidiEditor() {
    this.showEditor = false;
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

  onLogout(){
    this.firebaseService.logout();
    this._router.navigateByUrl('/login');
    //this.isLogout.emit()
  }  

  ngOnChanges(changes: SimpleChanges) {
    console.log('home level changes: ', changes);
  }

}