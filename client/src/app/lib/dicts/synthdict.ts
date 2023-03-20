import * as Tone from 'tone'
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';

export function GetSynthByKeyword(keyword: string) : MidiInstrument {
    switch (keyword) {
        case 'MonoSynth': {
            return new MidiInstrument('MonoSynth', Tone.MonoSynth);
        }
        case 'AMSynth': {
            return new MidiInstrument('AMSynth', Tone.AMSynth);
        }
        case 'FMSynth': {
            return new MidiInstrument('FMSynth', Tone.FMSynth);
        }
        default: {
            return new MidiInstrument('Default');
        }
    }
}

export function GetAllSynthKeywords(): string[] {
    return [
    'Default',
    'AMSynth',
    'FMSynth',
    'MonoSynth'
  ]
}