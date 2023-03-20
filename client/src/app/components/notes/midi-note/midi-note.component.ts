import { Component, Input, SimpleChanges } from '@angular/core';
import { Note } from 'src/app/models/recording/note';

@Component({
  selector: 'app-midi-note',
  templateUrl: './midi-note.component.html',
  styleUrls: ['./midi-note.component.css']
})
export class MidiNoteComponent {
  @Input() data: Note = new Note('', 0);
  @Input() vw: number = 0;
  @Input() bars: number = 16;

  public width: number = 0;
  public widthCSS: string = `${this.width}vw`;

  convertBBSToPosition(position: string) {
    let strPosArr: string[] = position.split(':')
    const bar = parseInt(strPosArr[0])
    const beat = parseInt(strPosArr[1])
    const sixteenth = parseFloat(strPosArr[2])
    const bbsInterval = this.vw / (this.bars * 16)
    const normedBar = 16 * (bar - 1);
    const normedBeat = 4 * beat;
    const bbsSum = normedBar + normedBeat + sixteenth
    return bbsSum * bbsInterval; //as VW
  }

  getWidth() {
    const start: number = this.convertBBSToPosition(this.data.attack + '');
    const end: number = parseInt(this.data.release + '');
    
    this.width;
  }

  updateVisual() {
    this.getWidth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (!this.data) {
        this.updateVisual();
      }
    }
  }
}
