import { Note } from '../../models/recording/note';
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import { Recording } from '../../models/recording/recording';
import * as Tone from 'tone';



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

export function SchedulePlayback(recording: Recording) {
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
        let e = Tone.Time(note.release).toSeconds() + synth.release;
        return {
            start: s,
            end: e,
        }
    });
    for (let i = 0; i < data.length; i++) {
        useSynthIdx = manageVoices(availableSynths, times[i].end, times[i].start);
        Tone.Transport.scheduleOnce((time) => {
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