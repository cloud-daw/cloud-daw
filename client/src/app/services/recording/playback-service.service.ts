import { Note } from '../../models/recording/note';
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import * as Tone from 'tone';

/**
 * Initializes playback data for a given synth's recording
 * @param data Note array from recording
 * @param synth Instrument to play
 */
export function SchedulePlayback(data: Note[], synth: MidiInstrument) {
    let len = data.length;
    let dur : Tone.Unit.Time;
    for (let i = 0; i < len; ++i) {
        dur = makeDuration(data[i].attack, data[i].release)
        Tone.Transport.scheduleOnce((time) => {
            synth.NotePlayback(data[i].value, dur);
        }, data[i].attack);
    }
}

/**
 * Calculates time held of note
 * @param attack attack of note from recording array
 * @param release release of note from recording array
 * @returns a bars:beats:sixteenths length of the note
 */
function makeDuration(attack: Tone.Unit.Time, release: Tone.Unit.Time) : Tone.Unit.Time {
    let a = Tone.Time(attack).toSeconds();
    let r = Tone.Time(release).toSeconds();
    return r - a;
}