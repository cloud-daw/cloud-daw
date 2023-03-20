import { Note } from './note';
import { MidiInstrument } from '../instruments/midi-instrument';
import { MakeKeyDict } from '../../lib/dicts/keydict';
import * as Tone from 'tone'

export class Recording {
    public data: Note[];
    public synth: MidiInstrument;
    constructor(synth: MidiInstrument, data: Note[] = []) {
        this.synth = synth;
        this.data = data;
    }

    /**
     * Pushes newly played note onto recording array
     * @param key key value e.g. 'C4'
     * @param attack attack time in bars:beats:sixteenths
     */
    public RecordNote(key: string) {
        let attack = Tone.Transport.position;
        this.data.push(new Note(key, attack));
    }

    /**
     * Sets the release of note in recording array
     * @param key key to add release to e.g. 'C4'
     * @param release release time in bars:beats:sixteenths
     */
    public AddRelease(key: string) {
        let release = Tone.Transport.position;
        for (let i = this.data.length - 1; i >= 0; i--) {
            if (this.data[i].value == key && this.data[i].release == "") {
                this.data[i].release = release;
                this.data[i].duration = this.makeDuration(this.data[i].attack, this.data[i].release)
                break;
            }
        }
    }

        /**
         * Calculates time held of note
         * @param attack attack of note from recording array
         * @param release release of note from recording array
         * @returns a bars:beats:sixteenths length of the note
         */
        private makeDuration(attack: Tone.Unit.Time, release: Tone.Unit.Time) : Tone.Unit.Time {
            let a = Tone.Time(attack).toSeconds();
            let r = Tone.Time(release).toSeconds();
            return r - a;
        }

    /**
     * Deletes note from an array
     * @param note can pass in Note to delete. less efficient
     * @param index can pass in index of note in data array. more efficient, less straightforward
     */
    public DeleteNote(note?: Note, index?: number) {
        if (note) {
            let ind = this.data.indexOf(note);
            this.data.splice(ind, 1);
        }
        else if (index) {
           this.data.splice(index, 1); 
        }
    }

    /**
     * General function to change recording data. will deprecate upon more efficient method calls (specific to note fields)
     * @param newNote adjusted note
     * @param note original note (optional)
     * @param index index of original note (optional)
     */
    public EditNote(newNote: Note, note?: Note, index?: number) {
        if (note) {
            let ind = this.data.indexOf(note);
            this.data[ind] = newNote;
        }
        else if (index) {
           this.data[index] = newNote;
        }
    }

}
