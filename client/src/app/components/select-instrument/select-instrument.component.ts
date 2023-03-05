import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import * as Tone from 'tone';

@Component({
  selector: 'app-select-instrument',
  templateUrl: './select-instrument.component.html',
  styleUrls: ['./select-instrument.component.css']
})
export class SelectInstrumentComponent {

  @Input() isPrompted: boolean = true;
  @Output() createTrack: EventEmitter<MidiInstrument> = new EventEmitter<MidiInstrument>();

  public instruments: MidiInstrument[] = [new MidiInstrument('Default'), new MidiInstrument('AMSynth', Tone.AMSynth), new MidiInstrument('FMSynth', Tone.FMSynth)]

  createTrackWithInstrument(instrument: MidiInstrument) {
    this.createTrack.emit(instrument);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isPrompted']) {
      console.log('KDMDMSS', this.isPrompted);
    }
  }

}
