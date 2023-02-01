import { Note } from './note';

export class Recording {
    public data: Note[] = [];
    constructor(data?: Note[]) {
        if (data) this.data = data;
    }

    public SchedulePlayback() {
        
    }

    public RecordNote(note: Note) {
        this.data.push(note);
    }

    //TODO: Improve recording process
    public AddRelease(index: number, release: string) {
        this.data[index].release = release;
    }

    /**
     * 
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