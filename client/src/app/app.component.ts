import { Component } from '@angular/core';
import { ApiHttpService } from './services/httpservice.service';
import { Observable } from 'rxjs';
import { Metronome } from './models/instruments/metronome';
import { MidiInstrument } from './models/instruments/midi-instrument'; //for now, do here -> in future, put in track
import { HostListener } from '@angular/core'; //for now, put in track later (to be trapped w/ focus from here)
import { MidiControllerComponent } from './components/midi-controller/midi-controller.component';
import { Recording } from './models/recording/recording';
import { Note } from './models/recording/note';
import { SchedulePlayback } from './services/playback-service.service';
import * as Tone from 'tone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CloudDaw';
  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    console.log(event);
    if (!this.synth.isPlaying) {
      let note = this.synth.Play(event.key);
      this.controller.showNotes(this.synth.currentNote);
      if (this.isRecording) this.testRecording.RecordNote(new Note(note, Tone.Transport.position.toString(), ""))
    }
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    this.synth.Release();
    this.controller.hideNotes(this.synth.currentNote);
    if (this.isRecording) this.testRecording.AddRelease(this.testRecording.data.length - 1, Tone.Transport.position.toString())
  }

  constructor(public ApiHttpService: ApiHttpService) { 
    this.status = 'no stat update';
    //this.status$ = this.ApiHttpService.getStatus() //SAMPLE: grabs observable return from server
    this.synth = new MidiInstrument("test");
    this.controller = new MidiControllerComponent(this.synth);
    this.metronome = new Metronome(120, 4); //120 bpm at 4/4
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
  metronomeOn: boolean = true;
  testRecording: Recording = new Recording();
  isRecording: boolean = false;
  

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

}
