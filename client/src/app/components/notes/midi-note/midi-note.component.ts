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

  public width: number = 0;
  public widthCSS: string = `${this.width}vw`;

  getWidth() {
    const start: number = parseInt(this.data.attack + '');
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
