import { Component } from '@angular/core';
import { ApiHttpService } from './services/httpservice.service';
import { Observable, of } from 'rxjs';
import { MidiInstrument } from './instruments/midi-instrument'; //for now, do here -> in future, put in track
import { HostListener } from '@angular/core'; //for now, put in track later (to be trapped w/ focus from here)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CloudDaw';
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event);
    this.synth.Play(event.key, 1);
  }

  constructor(public ApiHttpService: ApiHttpService) { 
    this.status = 'no stat update';
    this.status$ = this.ApiHttpService.getStatus() //SAMPLE: grabs observable return from server
    this.synth = new MidiInstrument("test");
  }
  status: string;
  status$: Observable<any>;
  masterVolume: number = 0;
  isPlaying: boolean = false;
  tempo: number = 120; //default
  signature: number[] = [1, 2, 3, 4]; //default 4/4
  timeoutValue: number = (60 / this.tempo) * 1000; //in ms
  synth: MidiInstrument;

  

  show() { // test, example method for backend comms
    this.status$.subscribe({
      next: s => {
        console.log('show, s');
        console.log(s);
        this.status = s.status || 'uh oh';
      },
      error: e => this.status = e.message || 'err',
      complete: () => console.log('complete'),
    });
  }

  onPlay(event : boolean) {
    console.log('play clicked');
    console.log(event);
    this.isPlaying = true;
  }

  onPause(event : boolean) {
    console.log('pause clicked');
    console.log(event);
    this.isPlaying = false;
  }

  onRewind(event : boolean) {
    console.log('rewind clicked');
    console.log(event);
  }

  onRecord(event : boolean) {
    console.log('record clicked');
    console.log(event);
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
