import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { GetAllSynthKeywords, GetSynthByKeyword } from 'src/app/lib/dicts/synthdict';



@Component({
  selector: 'app-select-instrument',
  templateUrl: './select-instrument.component.html',
  styleUrls: ['./select-instrument.component.css']
})

export class SelectInstrumentComponent {

  @Input() isPrompted: boolean = true;
  @Output() createTrack: EventEmitter<MidiInstrument> = new EventEmitter<MidiInstrument>();

  public instruments = GetAllSynthKeywords();

  createTrackWithInstrument(instrument: string) {
    this.createTrack.emit(GetSynthByKeyword(instrument));
  }
}
