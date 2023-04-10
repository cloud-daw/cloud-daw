import * as Tone from 'tone'
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';

export function GetSynthByKeyword(keyword: string) : MidiInstrument {
    switch (keyword) {
        case 'Vintage Synth': {
            return new MidiInstrument('Vintage Synth', Tone.MonoSynth);
        }
        case 'Radio Synth': {
            return new MidiInstrument('Radio Synth', Tone.AMSynth);
        }
        case 'Retro Synth': {
            return new MidiInstrument('Retro Synth', Tone.FMSynth);
        }
        case 'Drums': {
            const drums = LoadSampler('drumkits/kit0');
            return new MidiInstrument('Drums', drums, 2)
        }
        default: {
            return new MidiInstrument('Pluck Synth');
        }
    }
}

export function GetAllSynthKeywords(): string[] {
    return [
    'Pluck Synth', //   Default
    'Radio Synth', //   AMSynth
    'Retro Synth', //   FMSynth
    'Vintage Synth', // MONOSynth
    'Drums' //  Drums
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

export function LoadSamplerBlocking(sample: string, callback: (sampler: Tone.Sampler) => void): void {
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
      callback(sampler);
    },
  });
}