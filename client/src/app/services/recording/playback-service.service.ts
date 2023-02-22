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
    let dur : string;
    for (let i = 0; i < len; ++i) {
        dur = makeDuration(data[i].attack, data[i].release)
        console.log(dur);
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
function makeDuration(attack: string, release: string) : string {
    let attackBBS = attack.split(':');
    let releaseBBS = release.split(':');
    let bars: number = parseInt(releaseBBS[0]) - parseInt(attackBBS[0])
    let beats: number = parseInt(releaseBBS[1]) - parseInt(attackBBS[1])
    let sixteenths: number = parseFloat(releaseBBS[2]) - parseFloat(attackBBS[2])
    if (sixteenths < 0) {
        beats -= 1;
        sixteenths += 4;
    }
    if (beats < 0) {
        bars -= 1;
        beats += 4;
    }
    return bars + ':' + beats + ':' + sixteenths;
}