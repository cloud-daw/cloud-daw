import { Note } from '../models/recording/note';
import { MidiInstrument } from '../models/instruments/midi-instrument'
import * as Tone from 'tone';

export function SchedulePlayback(data: Note[], synth: MidiInstrument) {
    data.forEach((note) => {
        Tone.Transport.schedule((time) => {
            console.log(MakeDuration(note.attack, note.release));
            synth.NotePlayback(note.value, MakeDuration(note.attack, note.release));
        }, note.attack);
    })
}

function MakeDuration(attack: string, release: string) {
    let attackMBS = attack.split(':');
    let releaseMBS = release.split(':');
    let durationMBS = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        durationMBS[i] = parseInt(releaseMBS[i]) - parseInt(attackMBS[i]);
    }
    return durationMBS.join(':');
}