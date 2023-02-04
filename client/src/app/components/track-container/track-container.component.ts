import { Component } from '@angular/core';
import { MidiTrackComponent } from '../midi-track/midi-track.component';

@Component({
  selector: 'app-track-container',
  templateUrl: './track-container.component.html',
  styleUrls: ['./track-container.component.css']
})
export class TrackContainerComponent {
  constructor(tracks: Array<MidiTrackComponent>) { 
    this.tracks = tracks;
  }
  tracks: Array<MidiTrackComponent>;
}
