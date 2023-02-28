import { Note } from '../../models/recording/note';
import { MidiInstrument } from '../../models/instruments/midi-instrument'
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

export function SchedulePlayback(data: Note[], synth: MidiInstrument) {
    console.log('in schedule:', synth.name);
    const overlaps = calculateOverlaps(data);
    synth.setVoices(overlaps);
    console.log('setted voices', synth.voices);
    let availableSynths: SynthAvailability[] = [];
    let useSynthIdx = 0;
    for (let i = 0; i < synth.voices.length; i++) {
        availableSynths.push(new SynthAvailability(i));
    }
    const times = data.map(note => {
        let s = Tone.Time(note.attack).toSeconds();
        let e = Tone.Time(note.release).toSeconds();
        return {
            start: s,
            end: e,
        }
    });
    console.log('times: ', times);
    for (let i = 0; i < data.length; i++) {
        useSynthIdx = manageVoices(availableSynths, times[i].end, times[i].start);
        console.log('idx: ', i);
        console.log('synthidx: ', useSynthIdx);
        Tone.Transport.schedule((time) => {
            console.log(data[i].value, 'note should play now: ', time);
            synth.voices[useSynthIdx].triggerAttackRelease(data[i].value, data[i].duration, time);
        }, data[i].attack);
    }
    return true;
}

function manageVoices(availableSynths: SynthAvailability[], release: number, attack: number) : number {
    let synthIdx = -1;
    console.log('relevant release, attack: ', release, attack)
    for (let i = 0; i < availableSynths.length; i++) {
        console.log('running loop');
        //check for expired synths
        if (availableSynths[i].isAvailable == synthStatus.unavailable && availableSynths[i].releases_at < attack) {
            console.log('reset release:', availableSynths[i].idx);
            availableSynths[i].isAvailable = synthStatus.available;
            availableSynths[i].releases_at = 0;
        }
        if (availableSynths[i].isAvailable == synthStatus.available && synthIdx < 0) {
            console.log('synth available');
            availableSynths[i].isAvailable = synthStatus.unavailable;
            availableSynths[i].releases_at = release;
            synthIdx = availableSynths[i].idx;
        }
    }
    console.log('avail synths: ', availableSynths);
    return synthIdx;
}

/**
 * 
 * @param notes an array of notes from a recording
 * @returns maximum overlaps between notes in array
 */
function calculateOverlaps(notes: Note[]) : number {
    let currOverlap = 0;
    let maxOverlap = 0;
    let synthIdx: number[] = []
    synthIdx.length = notes.length;
    synthIdx.fill(0);
    let startsCounter = 0;
    let ranges : {time: number, quality: number}[] = [];
    for (let i = 0; i < notes.length; i++) {
        ranges.push({ time: Tone.Time(notes[i].attack).toSeconds(), quality: play.start });
        ranges.push({ time: Tone.Time(notes[i].release).toSeconds(), quality: play.end });
    }
    ranges.sort((a, b) => (a.time - b.time));
    console.log('ranges: ', ranges);
    for (let i = 0; i < ranges.length; i++) {
        if (ranges[i].quality == play.start) {
            currOverlap++;
            synthIdx[startsCounter] = currOverlap;
            startsCounter++;
        }
        if (ranges[i].quality == play.end) {
            currOverlap--;
        }
        maxOverlap = Math.max(maxOverlap, currOverlap);
    }
    console.log('max overlaps:', maxOverlap);
    console.log('overlaps in time', synthIdx);
    return maxOverlap;
}