import { Note } from './note';
import { MidiInstrument } from '../instruments/midi-instrument';
import { MakeKeyDict } from '../../lib/keydict';

export class Recording {
    public data: Note[] = [];
    public synth: MidiInstrument;
    constructor(synth: MidiInstrument, data?: Note[]) {
        this.synth = synth;
        if (data) this.data = data;
    }

    /**
     * Pushes newly played note onto recording array
     * @param key key value e.g. 'C4'
     * @param attack attack time in bars:beats:sixteenths
     */
    public RecordNote(key: string, attack: string) {
        this.data.push(new Note(key, attack, ""));
    }

    /**
     * Sets the release of note in recording array
     * @param key key to add release to e.g. 'C4'
     * @param release release time in bars:beats:sixteenths
     */
    public AddRelease(key: string, release: string) {
        for (let i = this.data.length - 1; i >= 0; i--) {
            if (this.data[i].value == key && this.data[i].release == "") {
                this.data[i].release = release;
                break;
            }
        }
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