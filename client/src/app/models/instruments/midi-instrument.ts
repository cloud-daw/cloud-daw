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
    public currentOctave: number = 4;
    private keyDict: Record<string, string>;
    private attack: number;
    private release: number;
    constructor(name: string) {
        this.name = name;
        this.sound = "something.mp3" //to load for later
        this.instrument = new Tone.Synth().toDestination();
        this.keyDict = this.MakeKeyDict();
        this.isPlaying = false;
        this.currentNote = "";
        this.attack = 0;
        this.release = 0.1;
    }

    /**
     * Starts note from input
     * @param noteKey key string e.g., "a"
     */
    Play(noteKey : string) : string {
       //code to emit sound
        this.currentNote = this.keyDict[noteKey];
        this.instrument.triggerAttack(this.currentNote, Tone.now());
        this.isPlaying = true;
        return this.currentNote;
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

    NotePlayback(value: string, duration: string) {
        this.instrument.triggerAttackRelease(value, duration);
    }

    public changeOctave(newOctave: number) {
        this.currentOctave = newOctave;
        this.keyDict = this.MakeKeyDict();
    }

    private MakeKeyDict() {
        return {
            "a": `C${this.currentOctave}`,
            "w": `C#${this.currentOctave}`,
            "s": `D${this.currentOctave}`,
            "e": `D#${this.currentOctave}`,
            "d": `E${this.currentOctave}`,
            "f": `F${this.currentOctave}`,
            "t": `F#${this.currentOctave}`,
            "g": `G${this.currentOctave}`,
            "y": `G#${this.currentOctave}`,
            "h": `A${this.currentOctave}`,
            "u": `A#${this.currentOctave}`,
            "j": `B${this.currentOctave}`,
            "k": `C${this.currentOctave + 1}`,
            "o": `C#${this.currentOctave + 1}`,
            "l": `D${this.currentOctave + 1}`,
            "p": `D#${this.currentOctave + 1}`,
            ";": `E${this.currentOctave + 1}`,
        }
    }

    // Mute(status: boolean) {
    //     this.instrument.volume.
    // }
}