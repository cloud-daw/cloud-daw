import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';

@Component({
  selector: 'app-midi-block',
  templateUrl: './midi-block.component.html',
  styleUrls: ['./midi-block.component.css']
})
export class MidiBlockComponent {
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  // @Output() trackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  
  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);

  public isVisible = this.track.midi.data.length > 0 ? 'visible' : 'hidden';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['track']) console.log('changes in Block: ', changes['track'].currentValue.midi.data);
  }
}
