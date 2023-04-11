import * as Tone from 'tone';
import { Note } from '../../models/recording/note';
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import { Recording } from '../../models/recording/recording';
import { Project } from '../../models/project'
import { Transport } from 'tone/build/esm/core/clock/Transport';
import { LoadSamplerBlocking } from 'src/app/lib/dicts/synthdict';

const AudioBufferToWav = require('audiobuffer-to-wav')

/* Note class for reference:

class Note {
    public value: string;
    public attack: Tone.Unit.Time;
    public release: Tone.Unit.Time;
    public duration: Tone.Unit.Time;
    constructor(value: string, attack: Tone.Unit.Time, release: Tone.Unit.Time = "", duration: Tone.Unit.Time = "") {
        this.value = value;
        this.attack = attack;
        this.release = release;
        this.duration = duration;
    }
}

*/

enum synthStatus {
    available = 0,
    unavailable = 1,
}

enum play {
    start = 0,
    end = 1,
}

class SynthAvailability {
    public idx: number;
    public isAvailable: number;
    public releases_at: number;
    constructor(idx: number) {
        this.idx = idx;
        this.isAvailable = synthStatus.available;
        this.releases_at = 0;
    }

}

export function BounceProjectToMP3(project: Project) {
    const x = findLengthOfProject(project);
    console.log('length of project, ', x);
    Tone.Offline(({ transport }) => {
        for (let i = 0; i < project.tracks.length; i++) {
            ScheduleOfflinePlaybackBasic(project.tracks[i].midi, transport)
            //ScheduleOfflinePlaybackTest(transport, i); 
        }
        transport.position = '1:0:0';
        transport.start();
    }, x).then((buffer) => {
        console.log('bounced, buffer: ', buffer);
        const audioBuffer = buffer.get();
        const wavFile = AudioBufferToWav(audioBuffer);
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([wavFile], { type: 'audio/wav' }));
        downloadLink.download = 'audio.wav';
        downloadLink.click();
    }).catch((err) => {
        console.log('error: ', err);
    });
}

/**
 * 
 * @param project 
 * @returns # of seconds, ceiling to next measure, to bounce offline
 */
function findLengthOfProject(project: Project): number {
    console.log('proj fields', project.tempo, project.signature)
    const tempo = project.tempo;
    const signature = project.signature;
    const measuresPerMinute = tempo / signature;
    let maxMeasure = 0;
    for (let i = 0; i < project.tracks.length; i++) {
        for (let j = 0; j < project.tracks[i].midi.data.length; j++) {
            maxMeasure = Math.max(parseInt(project.tracks[i].midi.data[j].release.toString().split(':')[0]), maxMeasure);
        }
    }
    const lengthInSeconds = ((maxMeasure + 1) / measuresPerMinute) * 60;
    return lengthInSeconds + 2; //give room
}

function ScheduleOfflinePlaybackBasic(recording: Recording, transport: Transport) {
    //const synth = recording.synth.name != 'Drums' ? new Tone.PolySynth(recording.synth.synth).toDestination() : recording.synth.instrument;
    console.log('bounceback', recording)
    if (!(recording.synth.instrument instanceof Tone.Sampler)) {
        const synth = new Tone.PolySynth(recording.synth.synth).toDestination() //TODO: need to set parameters (volume, etc) to match project
        for (let i = 0; i < recording.data.length; i++) {
            transport.scheduleOnce((time) => {
                synth.triggerAttackRelease(recording.data[i].value, recording.data[i].duration, time)
            }, recording.data[i].attack)
        }
    }
    else {
        LoadSamplerBlocking(recording.synth.sample_name, (sampler: Tone.Sampler) => {
            sampler.toDestination(); //TODO: need to set parameters (volume, etc) to match project
            for (let i = 0; i < recording.data.length; i++) {
                transport.schedule((time) => {
                    sampler.triggerAttack(recording.data[i].value, time)
                }, recording.data[i].attack)
            }
        });
    }
}