import { Component, Output, EventEmitter, HostListener, ViewEncapsulation } from '@angular/core';
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
import { TrackContainerComponent } from '../track-container/track-container.component';
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
    this.synthOnKeydown(event.key);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    this.synthOnKeyup(event.key)
  }
  
  constructor(public firebaseService: FirebaseService, public ApiHttpService: ApiHttpService, public _router: Router) {
    this.synth = new MidiInstrument("test");
    this.controller = new MidiControllerComponent(this.synth);
    this.metronome = new Metronome(120, 4); //120 bpm at 4/4
    this.currentTrack = new MidiTrack('Track 0', 0, this.synth, true);
    this.tracks = new Set();
    this.tracks.add(this.currentTrack);
    this.trackIdCounter = 0;
    this.testRecording = new Recording(this.synth);
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
  trackIdCounter: number;
  metronomeOn: boolean = true;
  testRecording: Recording;
  isRecording: boolean = false;
  keyboardStatus: Record<string, number>;
  state = 'curr'

  newTrack() {
    this.trackIdCounter++;
    let newTrack = new MidiTrack(`Track ${this.trackIdCounter}`, this.trackIdCounter, this.synth, true);
    this.tracks.add(newTrack);
    this.currentTrack = newTrack;
  }

  synthOnKeydown(key: string) {
    if (this.keyboardStatus[key] != keyStatus.isPlaying) {
      this.keyboardStatus[key] = keyStatus.isPlaying;
      let note = this.synth.Play(key);
      if (this.isRecording) this.testRecording.RecordNote(note, Tone.Transport.position.toString());
    }
  }

  synthOnKeyup(key: string) {
    if (this.keyboardStatus[key] == keyStatus.isPlaying) {
        this.keyboardStatus[key] = keyStatus.notPlaying;
        let note = this.synth.Release(key);
        if (this.isRecording) this.testRecording.AddRelease(note, Tone.Transport.position.toString());
    }
  }

  onPlay(event: boolean) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      Tone.start();
      if (this.testRecording.data.length > 0) {
        SchedulePlayback(this.testRecording.data, this.synth);
      }
      this.metronome.Start();
    }
  }

  onPause(event : boolean) {
    this.isPlaying = false;
    this.isRecording = false;
    this.metronome.Stop();
    console.log(this.testRecording);
  }

  onRewind(event : boolean) {
    this.metronome.Reset();
  }

  onRecord(event: boolean) {
    this.isRecording = true;
  }

  onUndo(event: number) {
    console.log('undo clicked');
    console.log(event);
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
          if (this.isRecording) this.testRecording.RecordNote(key, Tone.Transport.position.toString());
          break;
        case keyStatus.toRelease:
          this.keyboardStatus[k] = keyStatus.notPlaying;
          key = this.synth.Release(k);
          if (this.isRecording) this.testRecording.AddRelease(key, Tone.Transport.position.toString());
          break;
        default:
          break;
      }
    }
  }

  onLogout(){
    this.firebaseService.logout();
    this._router.navigateByUrl('/login');
    //this.isLogout.emit()
  }
}
