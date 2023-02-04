import { Component } from '@angular/core';
import { ApiHttpService } from './services/httpservice.service';
import { Observable } from 'rxjs';
import { Metronome } from './models/instruments/metronome';
import { MidiInstrument } from './models/instruments/midi-instrument'; //for now, do here -> in future, put in track
import { HostListener } from '@angular/core'; //for now, put in track later (to be trapped w/ focus from here)
import { MidiControllerComponent } from './components/midi-controller/midi-controller.component';
import { MidiTrackComponent } from './components/midi-track/midi-track.component';
import { TrackContainerComponent } from './components/track-container/track-container.component';
import * as Tone from 'tone';
import { Recording } from './models/recording/recording';
import { Note } from './models/recording/note';
import { SchedulePlayback } from './services/playback-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CloudDaw';

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    //console.log(event);
    if (this.keyboardStatus[event.key] != 3) {
      this.keyboardStatus[event.key] = 2;
      //let key = this.synth.Play(event.key);
      //if (this.isRecording) this.testRecording.RecordNote(key, Tone.Transport.position.toString());
    }
    console.log(this.keyboardStatus);
    this.PlayRelease();
    console.log(this.keyboardStatus);
    //this.controller.showNotes(this.synth.currentNote); //update to use array
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    console.log(event)
    if (this.keyboardStatus[event.key] == 3) this.keyboardStatus[event.key] = 1;
    console.log(this.keyboardStatus);
    this.PlayRelease();
    console.log(this.keyboardStatus);
    //let key = this.synth.Release(event.key);
    //if (this.isRecording) this.testRecording.AddRelease(key, Tone.Transport.position.toString())
    //this.controller.hideNotes(this.synth.currentNote); //update to use array
  }

  constructor(public ApiHttpService: ApiHttpService) { 
    this.status = 'no stat update';
    //this.status$ = this.ApiHttpService.getStatus() //SAMPLE: grabs observable return from server
    this.synth = new MidiInstrument("test");
    this.controller = new MidiControllerComponent(this.synth);
    this.metronome = new Metronome(120, 4); //120 bpm at 4/4
    this.tracks = [new MidiTrackComponent()];
    this.trackContainer = new TrackContainerComponent(this.tracks);
    this.testRecording = new Recording(this.synth);
    this.keyboardStatus = { //0 = do nothing, 1 = to release, 2 = to play, 3 = is playing
            "a": 0,
            "w": 0,
            "s": 0,
            "e": 0,
            "d": 0,
            "f": 0,
            "t": 0,
            "g": 0,
            "y": 0,
            "h": 0,
            "u": 0,
            "j": 0,
            "k": 0,
            "o": 0,
            "l": 0,
            "p": 0,
            ";": 0,
        }
  }
  status: string;
  //status$: Observable<any>;
  masterVolume: number = 0;
  isPlaying: boolean = false;
  tempo: number = 120; //default
  timeoutValue: number = (60 / this.tempo) * 1000; //in ms
  synth: MidiInstrument;
  controller: MidiControllerComponent;
  metronome: Metronome;
  tracks: Array<MidiTrackComponent>;
  trackContainer: TrackContainerComponent;
  metronomeOn: boolean = true;
  testRecording: Recording;
  isRecording: boolean = false;
  keyboardStatus: Record<string, number>;
  

  // show() { // test, example method for backend comms
  //   this.status$.subscribe({
  //     next: s => {
  //       console.log('show, s');
  //       console.log(s);
  //       this.status = s.status || 'uh oh';
  //     },
  //     error: e => this.status = e.message || 'err',
  //     complete: () => console.log('complete'),
  //   });
  // }

  onPlay(event: boolean) {
    if (!this.isPlaying) {
      console.log('play clicked');
      console.log(event);
      this.isPlaying = true;
      Tone.start();
      this.metronome.Start();
    }
    if (this.testRecording.data.length > 0) {
      SchedulePlayback(this.testRecording.data, this.synth);
    }
  }

  onPause(event : boolean) {
    console.log('pause clicked');
    console.log(event);
    this.isPlaying = false;
    this.isRecording = false;
    this.metronome.Stop();
    console.log(this.testRecording);
  }

  onRewind(event : boolean) {
    console.log('rewind clicked');
    console.log(event);
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
    console.log('volume changed');
    console.log(event);
    this.masterVolume = event;
  }

  PlayRelease() {
    let key;
    for (let k in this.keyboardStatus) {
      switch (this.keyboardStatus[k]) {
        case 2: //to play
          this.keyboardStatus[k] = 3 //set to is playing
          key = this.synth.Play(k);
          if (this.isRecording) this.testRecording.RecordNote(key, Tone.Transport.position.toString());
          break;
        case 1: //to release
          this.keyboardStatus[k] = 0; //set to nothing
          key = this.synth.Release(k);
          if (this.isRecording) this.testRecording.AddRelease(key, Tone.Transport.position.toString());
          break;
        default:
          break;
      }
    }
  }

}
