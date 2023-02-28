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
        Tone.Transport.schedule((time) => {
            synth.NotePlayback(data[i].value, data[i].release);
        }, data[i].attack);
    }
}

function manageVoices() {

}

function calculateOverlaps(notes: Note[]) {
    let latestRelease = 0;
    for (let i = 0; i < notes.length; i++) {
        
    }
}

// /**
//  * Calculates time held of note
//  * @param attack attack of note from recording array
//  * @param release release of note from recording array
//  * @returns a bars:beats:sixteenths length of the note
//  */
// function makeDuration(attack: Tone.Unit.Time, release: Tone.Unit.Time) : Tone.Unit.Time {
//     let a = Tone.Time(attack).toSeconds();
//     let r = Tone.Time(release).toSeconds();
//     return r - a;
// }