import { Component, Input, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { Note } from 'src/app/models/recording/note';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import * as Tone from 'tone';

interface NotesDict {
  [note: string]: number;
}

@Component({
  selector: 'app-midi-note',
  templateUrl: './midi-note.component.html',
  styleUrls: ['./midi-note.component.css'],
})
export class MidiNoteComponent {
  @Input() track: MidiTrack = new MidiTrack(
    'default',
    0,
    new MidiInstrument(''),
    false
  );
  @Input() data: Note = new Note('', 0);
  @Input() vw: number = 0;
  @Input() bars: number = 16;
  @Input() isRecording: boolean = false;
  @Input() noteColor: string = '';

  public widthCSS: string = `0vw`;
  public leftCSS: string = `0vw`;
  public topCSS: string = `0vw`;

  public notesDict: { [key: string]: number } = {
    C0   : 1,
    'C#0': 2,
    D0   : 3,
    'D#0': 4,
    E0   : 5,
    F0   : 6,
    'F#0': 7,
    G0   : 8,
    'G#0': 9,
    A0   : 10,
    'A#0': 11,
    B0   : 12,
    C1   : 13,
    'C#1': 14,
    D1   : 15,
    'D#1': 16,
    E1   : 17,
    F1   : 18,
    'F#1': 19,
    G1   : 20,
    'G#1': 21,
    A1   : 22,
    'A#1': 23,
    B1   : 24,
    C2   : 25,
    'C#2': 26,
    D2   : 27,
    'D#2': 28,
    E2   : 29,
    F2   : 30,
    'F#2': 31,
    G2   : 32,
    'G#2': 33,
    A2   : 34,
    'A#2': 35,
    B2   : 36,
    C3   : 37,
    'C#3': 38,
    D3   : 39,
    'D#3': 40,
    E3   : 41,
    F3   : 42,
    'F#3': 43,
    G3   : 44,
    'G#3': 45,
    A3   : 46,
    'A#3': 47,
    B3   : 48,
    C4   : 49,
    'C#4': 50,
    D4   : 51,
    'D#4': 52,
    E4   : 53,
    F4   : 54,
    'F#4': 55,
    G4   : 56,
    'G#4': 57,
    A4   : 58,
    'A#4': 59,
    B4   : 60,
    C5   : 61,
    'C#5': 62,
    D5   : 63,
    'D#5': 64,
    E5   : 65,
    F5   : 66,
    'F#5': 67,
    G5   : 68,
    'G#5': 69,
    A5   : 70,
    'A#5': 71,
    B5   : 72,
    C6   : 73,
    'C#6': 74,
    D6   : 75,
    'D#6': 76,
    E6   : 77,
    F6   : 78,
    'F#6': 79,
    G6   : 80,
    'G#6': 81,
    A6   : 82,
    'A#6': 83,
    B6   : 84,
    C7   : 85,
    'C#7': 86,
    D7   : 87,
    'D#7': 88,
    E7   : 89,
    F7   : 90,
    'F#7': 91,
    G7   : 92,
    'G#7': 93,
    A7   : 94,
    'A#7': 95,
    B7   : 96,
  };

  //Start (TEMP GPT SOLUTION)
  notesDict2: NotesDict = {};

  notePositions: NotesDict = {
    C: 0,
    'C#': 1,
    D: 2,
    'D#': 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    'G#': 8,
    A: 9,
    'A#': 10,
    B: 11
  };

  containerHeight = 6; // in em
  containerTop = 0; // in pixels
  noteHeight = this.containerHeight / 28; // each octave has 4 white keys and 3 black keys (total 7), so 6em/28 = 0.214em

  populateNotePos() {
    for (let octave = 0; octave <= 7; octave++) {
      for (const note in this.notePositions) {
        const noteName = note + octave.toString();
        const position = (7 - octave) * 4 + this.notePositions[note]; // calculate the position from the top of the container
        const top = (position * this.noteHeight).toFixed(3); // calculate the top value in em with 3 decimal places
        this.notesDict[noteName] = this.containerTop + parseFloat(top); // add the note and its position to the dictionary
      }
    }
  }
  //End (TEMP GPT SOLUTION)

  convertBBSToPosition(position: Tone.Unit.Time) {
    if (!position) return 0;
    let strPosArr: string[] = position.toString().split(':');
    const bar = parseInt(strPosArr[0]);
    const beat = parseInt(strPosArr[1]);
    const sixteenth = parseFloat(strPosArr[2]);
    const bbsInterval = this.vw / (this.bars * 16);
    const normedBar = 16 * (bar - 1);
    const normedBeat = 4 * beat;
    const bbsSum = normedBar + normedBeat + sixteenth;
    //console.log('final BBS return value should be', bbsSum * bbsInterval);
    return bbsSum * bbsInterval; //as VW
  }

  // convertDurationToWidth(duration: Tone.Unit.Time) {
  //   if (!duration) return 0;
  //   const interval = this.vw / this.bars;
  //   return parseFloat(duration.toString()) * interval;
  // }
    
  calculateWidth(start: number, end: number) {
    return end - start;
  }

  updateDisplay() {
    const start: number = this.convertBBSToPosition(this.data.attack);
    const end: number = this.convertBBSToPosition(this.data.release);
    const width = this.calculateWidth(start, end);
    const getNoteValue = Math.abs(100-this.notesDict[this.data.value]);
    const modifier = 1;
    const topOffset = getNoteValue * modifier;

    this.setDimensions(width, start, topOffset);
  }

  setDimensions(width: number, left: number, top: number) {
    this.widthCSS = `${width}vw`;
    this.leftCSS = `${left}vw`;
    this.topCSS = `${Math.abs(top)}%`;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateDisplay();
    console.log('update display');
    if (changes['isRecording']) {
      if (this.data) {
        // console.log('recording data??', this.data, this.data.attack.toString().split(':'));
      }
      if (this.data && !this.isRecording) {
        this.updateDisplay();
      }
    }
  }
}
