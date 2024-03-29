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
            return new MidiInstrument('Drums', drums, 2, true, 'drumkits/kit0')
        }
        case 'Jazz Guitar': {
            const guitar = LoadSampler('guitar/jazzguitar');
            return new MidiInstrument('Jazz Guitar', guitar, 0.2, true, 'guitar/jazzguitar'); 
        }
        case 'Acoustic Guitar': {
            const guitar = LoadSampler('guitar/acoustic');
            return new MidiInstrument('Acoustic Guitar', guitar, 0.3, true, 'guitar/acoustic'); 
        }
        case 'Funky Guitar': {
            const inst = LoadSampler('guitar/funky');
            return new MidiInstrument('Funky Guitar', inst, 0.3, true, 'guitar/funky'); 
        }
        case 'Sansula': {
            const inst = LoadSampler('sansula');
            return new MidiInstrument('Sansula', inst, 0.5, true, 'sansula'); 
        }
        case 'Cello': {
            const inst = LoadSampler('cello');
            return new MidiInstrument('Cello', inst, 0.3, true, 'cello'); 
        }
        case 'Harmonium': {
            const inst = LoadSampler('harmonium');
            return new MidiInstrument('Harmonium', inst, 0.2, true, 'harmonium'); 
        }
        case 'Grand Piano': {
            const inst = LoadSampler('piano/grandpiano');
            return new MidiInstrument('Grand Piano', inst, 0.3, true, 'piano/grandpiano'); 
        }
        case 'Electric Piano': {
            const inst = LoadSampler('piano/electric');
            return new MidiInstrument('Electric Piano', inst, 0.3, true, 'piano/electric'); 
        }
        case 'String Synth': {
            const inst = LoadSampler('synth/strings');
            return new MidiInstrument('String Synth', inst, 0.3, true, 'synth/strings'); 
        }
        case 'Pinch Lead Synth': {
            const inst = LoadSampler('synth/lead');
            return new MidiInstrument('Pinch Lead Synth', inst, 0.3, true, 'synth/lead'); 
        }
        case 'House Organ': {
            const inst = LoadSampler('organ/house');
            return new MidiInstrument('House Organ', inst, 0.3, true, 'organ/house'); 
        }
        case 'Electric Organ': {
            const loadurl = 'organ/electric'
            const inst = LoadSampler(loadurl);
            return new MidiInstrument('Electric Organ', inst, 0.3, true, loadurl); 
        }
        case 'Jazz Organ': {
            const loadurl = 'organ/jazz'
            const inst = LoadSampler(loadurl);
            return new MidiInstrument('Jazz Organ', inst, 0.3, true, loadurl); 
        }
        default: {
            return new MidiInstrument('Pluck Synth');
        }
    }
}

export function GetAllSynthKeywords(): string[] {
    return [
    'Drums', //  Drums
    'Grand Piano',
    'Electric Piano',
    'Jazz Guitar',
    'Acoustic Guitar',
    'Funky Guitar',
    'Jazz Organ',
    'Electric Organ',
    'Cello',
    'String Synth',
    'Pinch Lead Synth',
    'Pluck Synth', //   Default
    // 'Radio Synth', //   AMSynth
    // 'Retro Synth', //   FMSynth
    'Vintage Synth', // MONOSynth
    'Sansula',
    'Harmonium',
  ]
}

interface AudioURLS {
    [note: string]: string;
}
//only drums for now
function LoadSampler(sample: string): Tone.Sampler {
    let loaded = false;
    const audioURLS = getAudioUrls(sample);
    const sampler = new Tone.Sampler({
        urls: audioURLS,
        baseUrl: `../../../../assets/audio/${sample}/`,
        onload: () => {
            console.log('done loading');
            loaded = true;
        }
    });
    return sampler;
}

export function LoadSamplerBlocking(sample: string, callback: (sampler: Tone.Sampler) => void): void {
    const audioURLs = getAudioUrls(sample);
  const sampler = new Tone.Sampler({
    urls: audioURLs,
    baseUrl: `../../../../assets/audio/${sample}/`,
    onload: () => {
      console.log('done loading');
      callback(sampler);
    },
  });
}

function getAudioUrls(sample: string) {
    let audioURLS;
    switch (sample) {
        case 'drumkits/kit0':
            audioURLS = {
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
                'B4': 'cymbals/crash.mp3'
            }
            break;
        case 'guitar/jazzguitar':
            audioURLS = {
                'C5': 'jazz.mp3',
            }
            break;
        case 'guitar/acoustic':
            audioURLS = {
                'C4': 'acoustic.mp3',
            }
            break;
        case 'guitar/funky':
            audioURLS = {
                'D#4': 'peroxide.mp3',
            }
            break;
        case 'sansula':
            audioURLS = {
                'A3': 'sansula-a.mp3',
            }
            break;
        case 'cello':
            audioURLS = {
                'C3': 'c2.mp3',
            }
            break;
        case 'harmonium':
            audioURLS = {
                'C4': 'c3.mp3',
            }
            break;
        case 'piano/grandpiano':
            audioURLS = {
                'E4': 'piano-e.mp3',
            }
            break;
        case 'piano/electric':
            audioURLS = {
                'D3': 'g4.wav',
            }
            break;
        case 'synth/strings':
            audioURLS = {
                'C4': 'c-strings.mp3',
            }
            break;
        case 'synth/lofi':
            audioURLS = {
                'A#3': 'lofi-b.mp3',
            }
            break;
        case 'synth/lead':
            audioURLS = {
                'C4': 'pinch-c3.mp3',
            }
            break;
        case 'organ/house':
            audioURLS = {
                'B4': 'house-b.mp3',
            }
            break;
        case 'organ/electric':
            audioURLS = {
                'C4': 'electric-organ-c.mp3',
            }
            break;
        case 'organ/jazz':
            audioURLS = {
                'C4': 'jazz-c.mp3',
            }
            break;
        default:
            audioURLS = {
                'err': 'err'
            }
            break;
    }
    return audioURLS;
}