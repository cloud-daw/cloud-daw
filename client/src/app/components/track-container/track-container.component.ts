import { Component, Input } from '@angular/core';
import { MidiTrackComponent } from '../midi-track/midi-track.component';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';

@Component({
  selector: 'app-track-container',
  templateUrl: './track-container.component.html',
  styleUrls: ['./track-container.component.css']
})

export class TrackContainerComponent {
  @Input() tracks: Array<MidiTrack> = [];
  //@Input() trackInfo: TrackInfo = {title: '', id: 0, instrument: new MidiInstrument("test")};
  // constructor(tracks: Array<MidiTrackComponent>) {
  //   this.tracks = tracks;
  // }
  // tracks: Array<MidiTrackComponent>;
}
