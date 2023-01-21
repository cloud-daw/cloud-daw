import * as Tone from 'tone';

export class MidiInstrument {
    public name: string;
    public soundpack?: AudioBuffer; //i think this is the right type
    public sound: string;
    public engine: any;
    constructor(name: string) {
        this.name = name;
        this.sound = "something.mp3" //to load for later
        this.engine = new Tone.Synth().toDestination();
    }
    Play(noteKey : string, length: number) {
       //code to emit sound 
        let now = Tone.now();
        let note = noteKey.toUpperCase() + '4';
        this.engine.triggerAttackRelease(note, length, now);
    }
}