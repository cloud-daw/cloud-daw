import { Component, Input } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';

@Component({
  selector: 'app-midi-editor',
  templateUrl: './midi-editor.component.html',
  styleUrls: ['./midi-editor.component.css']
})
export class MidiEditorComponent {

  @Input() track = new MidiTrack('', 0, new MidiInstrument(''), false)

}
