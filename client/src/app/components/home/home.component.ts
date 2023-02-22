import { Component, Output, EventEmitter, HostListener, ViewEncapsulation, SimpleChanges, Input } from '@angular/core';
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
  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    if (this.keyboardStatus[event.key] != keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toAttack; //schedules attack
    this.PlayRelease();
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    if (this.keyboardStatus[event.key] == keyStatus.isPlaying) this.keyboardStatus[event.key] = keyStatus.toRelease; //schedules release
    this.PlayRelease();
  }
  
  constructor(public firebaseService: FirebaseService, public ApiHttpService: ApiHttpService, public _router: Router) {
    this.synth = new MidiInstrument("test");
    this.controller = new MidiControllerComponent(this.synth);
    this.metronome = new Metronome(120, 4); //120 bpm at 4/4
    this.currentTrack = new MidiTrack('Track 0', 0, this.synth, true);
    this.tracks = new Set();
    this.tracks.add(this.currentTrack);
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
  currentTrack: MidiTrack;
  tracks: Set<MidiTrack>;
  metronomeOn: boolean = true;
  currentRecording: Recording;
  recordings: Map<number, Recording>;
  isRecording: boolean = false;
  keyboardStatus: Record<string, number>;

  public trackIdCounter: number = 0;

  newTrack() {
    this.trackIdCounter++;
    let newTrack = new MidiTrack(`Track ${this.trackIdCounter}`, this.trackIdCounter, this.synth, true);
    this.tracks.add(newTrack);
    this.currentTrack = newTrack;
  }

  onPlay(event: boolean) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      Tone.start();
      this.metronome.Start();
    }
    let currentTrackRecording = this.recordings.get(this.currentTrack.id);
    if (currentTrackRecording) {
      SchedulePlayback(currentTrackRecording.data, this.synth);
    }
  }

  onPause(event : boolean) {
    this.isPlaying = false;
    this.isRecording = false;
    if (!this.isRecording) this.onStopRecord();
    this.metronome.Stop();
    console.log(this.currentRecording);
  }

  onRewind(event : boolean) {
    this.metronome.Reset();
  }

  onRecord(event: boolean) {
    this.isRecording = false;
  }

  private onStopRecord() {
    //append recording to current track recording data
    console.log('stopping recording on track: ', this.currentTrack.id, this.currentRecording.data);
    this.recordings.set(this.currentTrack.id, this.currentRecording);
    this.currentTrack.midi = this.currentRecording;
    // this.updateRecording(this.currentTrack.id);
    console.log(this.recordings);
  }

  private updateRecording(id: number) {
    let setRecording = this.recordings.has(id)
      ? this.recordings.get(id)
      : new Recording(this.currentTrack.instrument);
    this.currentRecording = setRecording || new Recording(this.currentTrack.instrument);
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

  onCurrentTrackChange(newTrack: MidiTrack) {
    console.log('New track:', newTrack);
    // Do something with the new value of currentTrack
    this.currentTrack = newTrack;
  }
}
