import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import * as Tone from 'tone';

class Instrument {
  static Default: MidiInstrument = new MidiInstrument('Default');
  static AMSynth: MidiInstrument = new MidiInstrument('AMSynth', Tone.AMSynth);
  static FMSynth: MidiInstrument = new MidiInstrument('FMSynth', Tone.FMSynth);
  static MonoSynth: MidiInstrument = new MidiInstrument('MonoSynth', Tone.MonoSynth);
}


@Component({
  selector: 'app-select-instrument',
  templateUrl: './select-instrument.component.html',
  styleUrls: ['./select-instrument.component.css']
})

export class SelectInstrumentComponent {

  @Input() isPrompted: boolean = true;
  @Output() createTrack: EventEmitter<MidiInstrument> = new EventEmitter<MidiInstrument>();

  public instruments: MidiInstrument[] = 
    [
      Instrument.Default,
      Instrument.AMSynth,
      Instrument.FMSynth,
      Instrument.MonoSynth
    ]

  createTrackWithInstrument(instrument: MidiInstrument) {
    this.createTrack.emit(instrument);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isPrompted']) {
      console.log('KDMDMSS', this.isPrompted);
    }
  }

}
