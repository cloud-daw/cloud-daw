import { FormGroup } from '@angular/forms';
import * as Tone from 'tone';

//monophonic (poly requires refactor) instrument class

export class MidiInstrument {
    public name: string;
    public soundpack?: AudioBuffer; //i think this is the right type
    public sound: string;
    public instrument: Tone.Synth;
    public isPlaying: boolean;
    public currentNote: string;
    private keyDict: Record<string, string>;
    private attack: number;
    private release: number;
    constructor(name: string) {
        this.name = name;
        this.sound = "something.mp3" //to load for later
        this.instrument = new Tone.Synth().toDestination();
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
            "k": "C5",
            "o": "C#5",
            "l": "D5",
            "p": "D#5",
            ";": "E5",
        }
        this.isPlaying = false;
        this.currentNote = "";
        this.attack = 0;
        this.release = 0.1;
    }

    /**
     * Starts note from input
     * @param noteKey key string e.g., "a"
     */
    Play(noteKey : string) {
       //code to emit sound
        this.currentNote = this.keyDict[noteKey];
        this.instrument.triggerAttack(this.currentNote, Tone.now());
        this.isPlaying = true;
    }

    /**
     * Triggers when keyup is detected
     */
    Release() {
        this.instrument.triggerRelease(`+${this.release}`);
        this.currentNote = "";
        this.isPlaying = false;
    }

    AdjustVolume(db: number) {
        this.instrument.volume.value = db;
    }

    // Mute(status: boolean) {
    //     this.instrument.volume.
    // }
}