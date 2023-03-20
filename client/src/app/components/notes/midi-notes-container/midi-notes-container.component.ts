import { Component, Input } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { MidiNoteComponent } from '../midi-note/midi-note.component';
import * as Tone from 'tone';

@Component({
  selector: 'app-midi-notes-container',
  templateUrl: './midi-notes-container.component.html',
  styleUrls: ['./midi-notes-container.component.css']
})
export class MidiNotesContainerComponent {
  
  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Input() vw : number = 100;
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() 
    set track(value: MidiTrack) {
      this._track = value;
    }
    get track(): MidiTrack {
      return this._track;
    }
  private _track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() isRecording: boolean = false;
}
