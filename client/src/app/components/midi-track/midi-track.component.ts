import { Component, Inject, Input } from '@angular/core';
import { TrackInfo } from 'src/app/app.component';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { TrackContainerComponent } from '../track-container/track-container.component';

@Component({
  selector: 'app-midi-track',
  templateUrl: './midi-track.component.html',
  styleUrls: ['./midi-track.component.css']
})

export class MidiTrackComponent {
  @Input() info: TrackInfo = {title: '', id: 0, instrument: new MidiInstrument("test")}
  
  // constructor(info: TrackInfo) {
  //   this.title = info.title;
  //   this.id = info.id;
  //   this.instrument = info.instrument;
  // }

  // title: String;
  // id: number;
  // instrument: MidiInstrument;
}
