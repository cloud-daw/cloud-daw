import { Component, Input, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { Note } from 'src/app/models/recording/note';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import * as Tone from 'tone';

@Component({
  selector: 'app-midi-note',
  templateUrl: './midi-note.component.html',
  styleUrls: ['./midi-note.component.css']
})

export class MidiNoteComponent {
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() data: Note = new Note('', 0);
  @Input() vw: number = 0;
  @Input() bars: number = 16;
  @Input() isRecording: boolean = false;

  public isVisible: string = this.track.midi.data.length > 0 ? 'visible' : 'hidden';

  public width: number = this.convertDurationToWidth(this.data.duration);
  public widthCSS: string = `${this.width}vw`;

  public left: number = this.convertBBSToPosition(this.data.attack);
  public leftCSS: string = `${this.left}vw`;

  convertBBSToPosition(position: Tone.Unit.Time) {
    if (!position) return 0;
    let strPosArr: string[] = position.toString().split(':')
    const bar = parseInt(strPosArr[0])
    const beat = parseInt(strPosArr[1])
    const sixteenth = parseFloat(strPosArr[2])
    const bbsInterval = this.vw / (this.bars * 16)
    const normedBar = 16 * (bar - 1);
    const normedBeat = 4 * beat;
    const bbsSum = normedBar + normedBeat + sixteenth
    return bbsSum * bbsInterval; //as VW
  }

  convertDurationToWidth(duration: Tone.Unit.Time) {
    if (!duration) return 0;
    const interval = this.vw / this.bars;
    return (parseFloat(duration.toString()) * interval)
  }

  updateDisplay() {
    const start: number = this.convertBBSToPosition(this.data.attack);
    const width: number = this.convertDurationToWidth(this.data.duration);
    this.width = width;
    this.widthCSS = `${this.width}vw`;
    this.left = start;
    this.leftCSS = `${this.left}vw`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isRecording']) {
      if (this.data && !this.isRecording) {
        console.log('displaying notes for :', this.track.id, this.width, this.left);
        this.updateDisplay();
      }
    }
  }
}
