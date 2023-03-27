import * as Tone from 'tone';
import { Note } from '../../models/recording/note';
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import { Recording } from '../../models/recording/recording';
import { Project } from '../../models/project'
import { Transport } from 'tone/build/esm/core/clock/Transport';



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
            ScheduleOfflinePlayback(project.tracks[i].midi, transport)
        }
        transport.start();
    }, x).then((buffer) => {
        console.log('bounced, buffer: ', buffer);
        const player = new Tone.Player(buffer, () => {
            console.log('starting player');
            player.start();
        }).toDestination();
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
    return lengthInSeconds;
}

function ScheduleOfflinePlayback(recording: Recording, transport: Transport) {
    const data = recording.data;
    const synth = recording.synth;
    const release = synth.release;
    //const overlaps = calculateOverlaps(data, release);
    const overlaps = recording.maxOverlaps;
    synth.setVoices(overlaps);
    let availableSynths: SynthAvailability[] = [];
    let useSynthIdx = 0;
    for (let i = 0; i < synth.voices.length; i++) {
        availableSynths.push(new SynthAvailability(i));
    }
    const times = data.map(note => {
        let s = Tone.Time(note.attack).toSeconds();
        let e = Tone.Time(note.release).toSeconds() + release;
        return {
            start: s,
            end: e,
        }
    });
    for (let i = 0; i < data.length; i++) {
        useSynthIdx = manageVoices(availableSynths, times[i].end, times[i].start);
        transport.schedule((time) => {
            synth.voices[useSynthIdx].triggerAttackRelease(data[i].value, data[i].duration, time);
        }, data[i].attack);
    }
    return true;
}

function manageVoices(availableSynths: SynthAvailability[], release: number, attack: number) : number {
    let synthIdx = -1;
    for (let i = 0; i < availableSynths.length; i++) {
        //check for expired synths
        if (availableSynths[i].isAvailable == synthStatus.unavailable && availableSynths[i].releases_at < attack) {
            availableSynths[i].isAvailable = synthStatus.available;
            availableSynths[i].releases_at = 0;
        }
        if (availableSynths[i].isAvailable == synthStatus.available && synthIdx < 0) {
            availableSynths[i].isAvailable = synthStatus.unavailable;
            availableSynths[i].releases_at = release;
            synthIdx = availableSynths[i].idx;
        }
    }
    return synthIdx;
}