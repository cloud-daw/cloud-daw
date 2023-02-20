import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { TrackContainerComponent } from '../track-container/track-container.component';
import { MidiTrack } from 'src/app/models/tracks/midi-track';

@Component({
  selector: 'app-midi-track',
  templateUrl: './midi-track.component.html',
  styleUrls: ['./midi-track.component.css']
})

export class MidiTrackComponent {
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() tracks: Set<MidiTrack> = new Set<MidiTrack>();
  private _currentTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);

  @Input()
    set currentTrack(track: MidiTrack) {
      this.currentTrackChange.emit(track);
      this._currentTrack = track;
    }
  
    get currentTrack() {
      return this._currentTrack;
    }

  @Output() currentTrackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  
  formatLabel(value: number): string {
    return `${value}db`;
  }

  deleteTrack() {
    this.tracks.delete(this.track);
  }

  updateCurrentTrack() {
    this.currentTrack = this.track;
    this.track.selected = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    //changes['currentTrack'].currentValue = this.currentTrack;
    if (changes['currentTrack']) {
      if (this.track != this.currentTrack) {
        this.track.selected = false;
      }
    }
    
    console.log(changes);
    //console.log('selected: ' + changes['currentTrack'].currentValue.title, 'track: ' + changes['track'].currentValue.title);
  }
}
