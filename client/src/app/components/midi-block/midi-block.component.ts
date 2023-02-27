import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { MidiTrackComponent } from '../midi-track/midi-track.component';

@Component({
  selector: 'app-midi-block',
  templateUrl: './midi-block.component.html',
  styleUrls: ['./midi-block.component.css']
})
export class MidiBlockComponent {
  @ViewChild(MidiTrackComponent, { read: ElementRef }) trackComponentRef?: ElementRef;

  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Input() 
    set track(value: MidiTrack) {
      this._track = value;
    }
    get track(): MidiTrack {
      return this._track;
    }
  private _track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);

  // @Output() trackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  

  public isVisible: string = this.track.midi.data.length > 0 ? 'visible' : 'hidden';
  public blockWidth: string = this.track.midi.data.length + 'em';

  updateVisual() {
    this.isVisible = this.track.midi.data.length > 0 ? 'visible' : 'hidden';
    this.blockWidth = this.track.midi.data.length + 'em';
    //console.log('Recording stopped... Displaying midi for track', this.track.id, this.track.midi);
  }

}
