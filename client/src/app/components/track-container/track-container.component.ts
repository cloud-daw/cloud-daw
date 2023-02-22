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
  @Input() tracks: Set<MidiTrack> = new Set<MidiTrack>();
  @Input() currentTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
}
