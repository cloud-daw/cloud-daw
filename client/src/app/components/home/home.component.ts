import { Component, Output, EventEmitter, HostListener, ViewEncapsulation, SimpleChanges, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
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
import { MidiTrack } from '../../models/tracks/midi-track';
import { MidiBlockComponent } from '../midi-block/midi-block.component';

  
/**
 * Int status of keys for keyboard
 */
enum keyStatus { 
  notPlaying = 0,
  toRelease = 1,
  toAttack = 2,
  isPlaying = 3,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../midi-track/midi-track.component.css'],
})
export class HomeComponent {
  @ViewChildren('blockRef')blockRefs?: QueryList<MidiBlockComponent>;

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    if (this.keyboardStatus[event.key] != keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toAttack; //schedules attack
    const myDiv = document.getElementById(event.key);
    if (myDiv) {
      myDiv.classList.add("active");
    }   
    this.PlayRelease();
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    if (this.keyboardStatus[event.key] == keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toRelease; //schedules release
    const myDiv = document.getElementById(event.key);
    if (myDiv) {
      myDiv.classList.remove("active");
    }
    this.PlayRelease();
  }

  @HostListener('mousedown', ['$event'])
  handleMousedownEvent(event: MouseEvent) {
    const clickedDivId = (event.target as HTMLElement).id;
    if (this.keyboardStatus[clickedDivId] != keyStatus.isPlaying) this.keyboardStatus[clickedDivId] = keyStatus.toAttack; //schedules attack
    const myDiv = document.getElementById(clickedDivId);
    if (myDiv) {
      myDiv.classList.add("active");
    }   
    this.PlayRelease();
  }

  @HostListener('mouseup', ['$event'])
  handleMouseupEvent(event: MouseEvent) {
    const clickedDivId = (event.target as HTMLElement).id;
    if (this.keyboardStatus[clickedDivId] == keyStatus.isPlaying) this.keyboardStatus[clickedDivId] = keyStatus.toRelease; //schedules release
    const myDiv = document.getElementById(clickedDivId);
    if (myDiv) {
      myDiv.classList.remove("active");
    }   
    this.PlayRelease();
  }

  // onDivClick(event: MouseEvent) {
  //   console.log('Div clicked!');
  //   // this.keyboardStatus[event.key] = keyStatus.toAttack;
  //   const clickedDivId = (event.target as HTMLElement).id;
  //   this.keyboardStatus[clickedDivId] = keyStatus.toAttack;
  //   //const myDiv = document.getElementById(clickedDivId);
  //   //myDiv.classList.add("active");
  //   this.PlayRelease();
  // }

  
  constructor(public firebaseService: FirebaseService, public ApiHttpService: ApiHttpService, public _router: Router) {
    this.synth = new MidiInstrument("test");
    this.controller = new MidiControllerComponent(this.synth);
    this.metronome = new Metronome(120, 4); //120 bpm at 4/4
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
        }
  }
  //status$: Observable<any>;
  masterVolume: number = 0;
  isPlaying: boolean = false;
  tempo: number = 120; //default
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

  public isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    console.log(this.isExpanded);
  }

  newTrack() {
    this.trackIdCounter++;
    let newTrack = new MidiTrack(`Track ${this.trackIdCounter}`, this.trackIdCounter, this.synth, true);
    this.tracks.add(newTrack);
    this.selectedTrack = newTrack;
    this.updateRecording(this.selectedTrack.id);
  }

  onPlay(event: boolean) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      Tone.start();
      this.metronome.Start();
    }
    let selectedTrackRecording = this.recordings.get(this.selectedTrack.id);
    if (selectedTrackRecording) {
      SchedulePlayback(selectedTrackRecording.data, this.synth);
    }
  }

  onPause(event : boolean) {
    this.isPlaying = false;
    if (this.isRecording) this.onStopRecord();
    this.isRecording = false;

    this.metronome.Stop();
    console.log(this.currentRecording);
  }

  onRewind(event : boolean) {
    this.metronome.Reset();
  }

  onRecord(event: boolean) {
    this.isRecording = true;
  }

  /**
   * Called when recording is stopped. 
   * Updates the recordings map with key: selectedTrackid and value: currentRecording
   * Calls @method updateRecording(selectedTrack.id)
   */
  private onStopRecord() {
    console.log('stopping recording on track: ', this.selectedTrack.id, this.currentRecording.data);
    this.recordings.set(this.selectedTrack.id, this.currentRecording);
    this.selectedTrack.midi = this.currentRecording;
    this.updateRecording(this.selectedTrack.id);
    this.blockRefs?.forEach((block) => {
      if (block.track.id == this.selectedTrack.id) {
        block.updateVisual();
      }
    });
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
    console.log(this.selectedTrack.title, this.currentRecording.data);
  }

  onUndo(event: number) {
    console.log('undo clicked');
    console.log(event);
  }

  onMainVolumeChange(event: number) {
    this.masterVolume = event;
  }

  /**
   * Uses keyboard status dictionary (scheduled on note plays) to record correct attack & release time
   */
  PlayRelease() {
    let key;
    for (let k in this.keyboardStatus) {
      switch (this.keyboardStatus[k]) {
        case keyStatus.toAttack: //to play
          this.keyboardStatus[k] = keyStatus.isPlaying;
          key = this.synth.Play(k);
          if (this.isRecording) this.currentRecording.RecordNote(key, Tone.Transport.position.toString());
          break;
        case keyStatus.toRelease:
          this.keyboardStatus[k] = keyStatus.notPlaying;
          key = this.synth.Release(k);
          if (this.isRecording) this.currentRecording.AddRelease(key, Tone.Transport.position.toString());
          break;
        default:
          break;
      }
    }
  }

  onLogout(){
    this.firebaseService.logout()
    this._router.navigateByUrl('/login')
    //this.isLogout.emit()
  }  

  ngOnChanges(changes: SimpleChanges) {
    console.log('home level changes: ', changes);
  }

}