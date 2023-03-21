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
        case 'Drums': {
            const drums = LoadSampler('drumkits/kit0');
            return new MidiInstrument('Drums', drums, 2)
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
    'MonoSynth',
    'Drums'
  ]
}

//only drums for now
function LoadSampler(sample: string): Tone.Sampler {
    let loaded = false;
    const sampler = new Tone.Sampler({
        urls: {
            'C4': 'kick/kick.mp3',
            'C#4': 'snare/sidestick.mp3',
            'D4': 'snare/base.mp3',
            'D#4': 'snare/rimshot.mp3',
            'E4': 'toms/low.mp3',
            'F4': 'toms/mid.mp3',
            'F#4': 'toms/high.mp3',
            'G4': 'hihat/closed.mp3',
            'G#4': 'hihat/semi.mp3',
            'A4': 'cymbals/ride.mp3',
            'A#4': 'cymbals/ridebell.mp3',
            'B4': 'cymbals/crash.mp3',

        },
        baseUrl: `../../../../assets/audio/${sample}/`,
        onload: () => {
            console.log('done loading');
            loaded = true;

        }
    });
    return sampler;
}