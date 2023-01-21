import * as Tone from 'tone';

export class MidiInstrument {
    public name: string;
    public soundpack?: AudioBuffer; //i think this is the right type
    public sound: string;
    public engine: any;
    private keyDict: Record<string, string>;
    constructor(name: string) {
        this.name = name;
        this.sound = "something.mp3" //to load for later
        this.engine = new Tone.Synth().toDestination();
        this.keyDict = {
            "a": "C4",
            "w": "C#4",
            "s": "D4",
            "e": "D#4",
            "d": "E4",
            "f": "F4",
            "t": "F#4",
            "g": "G4",
            "y": "G#4",
            "h": "A4",
            "u": "A#4",
            "j": "B4",
            "k": "C5"
        }
    }
    Play(noteKey : string, length: number) {
       //code to emit sound 
        let now = Tone.now();
        this.engine.triggerAttackRelease(this.keyDict[noteKey], length, now);
    }
}