import * as Tone from 'tone'
export class Note {
    public value: string;
    public attack: Tone.Unit.Time;
    public release: Tone.Unit.Time;
    constructor(value: string, attack: Tone.Unit.Time, release: Tone.Unit.Time = "") {
        this.value = value;
        this.attack = attack;
        this.release = release;
    }
}