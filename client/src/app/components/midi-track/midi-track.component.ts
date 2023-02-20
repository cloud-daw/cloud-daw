import { Component, Inject, Input } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { TrackContainerComponent } from '../track-container/track-container.component';
import { MidiTrack } from 'src/app/models/tracks/midi-track';

@Component({
  selector: 'app-midi-track',
  templateUrl: './midi-track.component.html',
  styleUrls: ['./midi-track.component.css']
})

export class MidiTrackComponent {
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument("test"));
  
  formatLabel(value: number): string {
    return `${value}db`;
  }
  
}
