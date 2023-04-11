import { Recording } from '../../models/recording/recording'
import {Note} from '../../models/recording/note'
import * as Tone from 'tone'



enum divisions {
    whole = 1,
    half = 2,
    quarter = 4,
    eighth = 8,
    sixteenth = 16

}

/**
 * Aligns note attack values to timeline by interval division & strength
 * @param recording recording to quantize
 * @param division indicates place to quantize to. w=1, h=2, q=4, s=16, ts=32
 */
export function QuantizeRecording(recording: Recording, division: number = 16): Recording {
    const quantizer = getQuantizeExpression(division);
    for (let i = 0; i < recording.data.length; i++) {
        recording.data[i] = quantizeNote(recording.data[i], quantizer)
    }
    recording.UpdateDurations();
    console.log(recording)
    return recording
}

function quantizeNote(note: Note, quantizer: (measure: number, beat: number, sixteenth: number) => number[]): Note {
    console.log('prequant', note)
    const mbsArr = splitNoteTime(note);
    const quantizedArray = quantizer(mbsArr[0], mbsArr[1], mbsArr[2])
    note.attack = quantizedArray.join(':');
    console.log('postquant', note);
    return note;
}

const quantizeOnSixteenth = (measure: number, beat: number, sxth: number) => {
    if ((sxth % 1) > 0.5) {
        sxth = Math.ceil(sxth);
    }
    else {
        sxth = Math.floor(sxth);
    }
    if (sxth == 4) {
        sxth = 0
        beat++;
    }
    if (beat == 4) {
        beat = 0
        measure++;
    }
    return [measure, beat, sxth]
}

const quantizeOnEighth = (measure: number, beat: number, sxth: number) => {
    if ((sxth % 2) >= 1) {
        sxth = Math.ceil(sxth)
    }
    else {
        sxth = Math.floor(sxth)
    }
    if (sxth == 4) {
        sxth = 0
        beat++;
    }
    if (beat == 4) {
        beat = 0
        measure++;
    }
    return [measure, beat, sxth]
}

const quantizeOnQuarter = (measure: number, beat: number, sxth: number) => {
    if (sxth > 2) {
        beat++;
    }
    sxth = 0;
    if (beat == 4) {
        beat = 0
        measure++;
    }
    return [measure, beat, sxth]
}

const quantizeOnHalf = (measure: number, beat: number, sxth: number) => {
    if (beat % 2 != 0) {
        beat++;
    }
    sxth = 0;
    if (beat == 4) {
        beat = 0
        measure++;
    }
    return [measure, beat, sxth]
}

const quantizeOnWhole = (measure: number, beat: number, sxth: number) => {
    if (beat >= 2) {
        measure++;
    }
    beat = 0;
    sxth = 0;
    return [measure, beat, sxth]
}
/**
 * 
 * @param note input note to split attack
 * @returns attack time split as [measure, beat, sixteenth]
 */
function splitNoteTime(note: Note): number[] {
    const timeString = note.attack.toString();
    return timeString.split(':').map(x => parseFloat(x));
}

/**
 * 
 * @param division 1,2,4,8,16,32
 * @returns mod, tdx where x is 1 for whole values & 2 for partial, tdx index of mbs array to check first
 */
function getQuantizeExpression(division: divisions): (measure: number, beat: number, sixteenth: number) => number[] {
    let exp;
    switch (division) { //set values of modifier, timedex based on inputs
        case divisions.whole:
            exp = quantizeOnWhole;
            break;
        case divisions.half:
            exp = quantizeOnHalf;
            break;
        case divisions.quarter:
            exp = quantizeOnQuarter;
            break;
        case divisions.eighth:
            exp = quantizeOnEighth;
            break;
        case divisions.sixteenth:
            exp = quantizeOnSixteenth;
            break;
        default: //shouldn't happen
            exp = quantizeOnSixteenth;
            break;
    }
    return exp;
}