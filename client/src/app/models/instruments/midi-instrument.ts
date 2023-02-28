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
        this.sound = "Synthesizer" //to load for later
        this.instrument = new Tone.PolySynth().toDestination();
        this.keyDict = MakeKeyDict(this.currentOctave);
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
        let now = Tone.now()
        this.instrument.triggerAttack(key, now);
        this.isPlaying = true;
        return key;
    }

    /**
     * Triggers when keyup is detected
     */
    Release(releasedKey : string) {
        let key = this.keyDict[releasedKey];
        this.instrument.triggerRelease(key, `+${this.release}`);
        return key;
    }

    AdjustVolume(db: number) {
        this.instrument.volume.value = db;
    }

    NotePlayback(value: string, duration: Tone.Unit.Time) {
        this.instrument.triggerAttackRelease(value, duration);
    }

    public increaseOctave() {
        this.currentOctave = this.currentOctave + 1;
        this.keyDict = MakeKeyDict(this.currentOctave);
    }

    public decreaseOctave() {
        this.currentOctave = this.currentOctave - 1;
        this.keyDict = MakeKeyDict(this.currentOctave);
    }

    // Mute(status: boolean) {
    //     this.instrument.volume.
    // }
}