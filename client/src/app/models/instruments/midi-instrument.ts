import { FormGroup } from '@angular/forms';
import * as Tone from 'tone';
import { MakeKeyDict } from '../../lib/keydict';

//monophonic (poly requires refactor) instrument class

export class MidiInstrument {
    public name: string;
    public soundpack?: AudioBuffer; //i think this is the right type
    public sound: string;
    public instrument: Tone.PolySynth;
    public isPlaying: boolean;
    public currentOctave: number = 4;
    private keyDict: Record<string, string>;
    private attack: number; //unused for now
    private release: number;
    constructor(name: string) {
        this.name = name;
        this.sound = "something.mp3" //to load for later
        this.instrument = new Tone.PolySynth(Tone.AMSynth).toDestination();
        this.keyDict = MakeKeyDict(4);
        this.isPlaying = false;
        this.attack = 0;
        this.release = 0.1;
    }

    /**
     * Starts note from input
     * @param noteKey key string e.g., "a"
     */
    Play(noteKey : string) : string {
       //code to emit sound
        let key = this.keyDict[noteKey];
        //this.currentNotes.push(key);
        this.instrument.triggerAttack(key, Tone.now());
        this.isPlaying = true;
        return key;
    }

    /**
     * Triggers when keyup is detected
     */
    Release(releasedKey : string) {
        let key = this.keyDict[releasedKey];
        this.instrument.triggerRelease(key, `+${this.release}`);
        //let idx = this.currentNotes.indexOf(key);
        //this.currentNotes.splice(idx, 1);
        return key;
    }

    AdjustVolume(db: number) {
        this.instrument.volume.value = db;
    }

    NotePlayback(value: string, duration: string) {
        this.instrument.triggerAttackRelease(value, duration);
    }

    public changeOctave(newOctave: number) {
        this.currentOctave = newOctave;
        this.keyDict = MakeKeyDict(newOctave);
    }

    // Mute(status: boolean) {
    //     this.instrument.volume.
    // }
}