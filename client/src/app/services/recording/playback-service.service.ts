import { Note } from '../../models/recording/note';
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import * as Tone from 'tone';

/**
 * Initializes playback data for a given synth's recording
 * @param data Note array from recording
 * @param synth Instrument to play
 */
export function SchedulePlayback(data: Note[], synth: MidiInstrument) {
    data.forEach((note) => {
        Tone.Transport.schedule((time) => {
            synth.NotePlayback(note.value, MakeDuration(note.attack, note.release));
        }, note.attack);
    })
}

/**
 * Calculates time held of note
 * @param attack attack of note from recording array
 * @param release release of note from recording array
 * @returns a bars:beats:sixteenths length of the note
 */
function MakeDuration(attack: string, release: string) {
    let attackMBS = attack.split(':');
    let releaseMBS = release.split(':');
    let durationMBS = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        durationMBS[i] = parseInt(releaseMBS[i]) - parseInt(attackMBS[i]);
    }
    return durationMBS.join(':');
}