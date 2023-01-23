import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-midi-note',
  templateUrl: './midi-note.component.html',
  styleUrls: ['./midi-note.component.css']
})
export class MidiNoteComponent {
  @Input() key: number | undefined;
  @Input() note: string | undefined;
  
  constructor() {
    
  }
}
