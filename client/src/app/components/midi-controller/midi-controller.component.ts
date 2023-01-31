import { Component, Output, Input, EventEmitter } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';

@Component({
  selector: 'app-midi-controller',
  templateUrl: './midi-controller.component.html',
  styleUrls: ['./midi-controller.component.css']
})
export class MidiControllerComponent {
  private keyDict: Record<string, number>;
  public instrument: MidiInstrument;
  public keys: Array<number>;
  public tempNote: string
  private midiNotes: Array<string>;
  constructor(instrument: MidiInstrument) {
      this.instrument = instrument;
      this.keys = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      this.midiNotes = [
        'note1', //replace with component
        'note2',
      ];
      this.tempNote = ''
      this.keyDict = {
          "C4": 0,
          "C#4" : 1,
          "D4" : 2,
          "D#4" : 3,
          "E4" : 4,
          "F4" : 5,
          "F#4" : 6,
          "G4" : 7,
          "G#4" : 8,
          "A4" : 9,
          "A#4" : 10,
          "B4" : 11,
          "C5" : 12,
          "C#5" : 13,
          "D5" : 14,
          "D#5" : 15,
          "E5" : 16,
      }
  }

  // ngOnChanges(instrument: MidiInstrument) {
  //   console.log('Play Detected:', this.instrument.currentNote);
  //   for (let i = 0; i < this.keys.length; i++) {
  //     if (this.keyDict[instrument.currentNote] == i) {
  //       this.keys[i] = 1
  //     }
  //     else {
  //       this.keys[i] = 0
  //     }
  //   }
  // }
  showNotes(note: string) {
    if (this.instrument.isPlaying) {
      this.keys[this.keyDict[note]] = 1;
      this.tempNote = note;
      console.log(note, 'Show')
    }
  }

  hideNotes(note: string) {
    if (!this.instrument.isPlaying) {
      this.keys[this.keyDict[this.tempNote]] = 0;
      console.log(this.tempNote, 'Hide')
      this.tempNote = '';
    }
  }
}


