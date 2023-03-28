import * as Tone from 'tone';
import { SynthOptions } from 'tone';
import { MakeKeyDict } from '../../lib/dicts/keydict';

//monophonic (poly requires refactor) instrument class

export class MidiInstrument {
    public name: string;
    public soundpack?: AudioBuffer; //i think this is the right type
    public sound: string;
    public instrument: Tone.PolySynth | Tone.Sampler;
    public voices: any[];
    public isPlaying: boolean;
    public currentOctave: number = 4;
    private keyDict: Record<string, string>;
    private attack: number; //unused for now
    public release: number;
    public synth: any;
    constructor(name: string, synth?: any, release: number = 0.1) {
        this.name = name != '' ? name : 'Default Synth';
        this.sound = "" //to load for later
        this.synth = synth ?? {};
        if (name != 'Drums') {
            this.instrument = new Tone.PolySynth(this.synth).toDestination();
        }
        else {
            this.instrument = this.synth.toDestination();
        }
        this.keyDict = MakeKeyDict(this.currentOctave);
        this.isPlaying = false;
        this.attack = 0;
        this.release = release;
        this.voices = [this.instrument];
    }

    /**
     * Starts note from input
     * @param noteKey key string e.g., "a"
     */
    Play(noteKey : string) : string {
       //code to emit sound
       if (this.keyDict[noteKey]) {
        let key = this.keyDict[noteKey];
        let now = Tone.now();
        this.instrument.triggerAttack(key, now);
        this.isPlaying = true;
        return key;
       }
       return 'invalid';
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

    public setVoices(overlaps: number) {
        this.resetVoices();
        if (this.name != 'Drums') {
            this.setPolyVoices(overlaps);
        }
        else {
            this.setSamplerVoices(overlaps);
        }
        this.NormalizeVolume();
    }

    private setPolyVoices(overlaps: number) {
        for (let i = 1; i < overlaps; i++) {
            this.voices.push(this.MakeSynthCopy());
        }
    }

    private setSamplerVoices(overlaps: number) {
        for (let i = 1; i < overlaps; i++) {
            this.voices.push(this.instrument);
        }
    }

    private resetVoices() {
        this.voices = [this.instrument];
    }

    public NormalizeVolume() {
        const volume = this.instrument.volume.value;
        for (let i = 0; i < this.voices.length; i++) {
            this.voices[i].volume.value = volume;
        }
    }

    public changeOctave(newOctave: number) {
        this.currentOctave = newOctave;
        this.keyDict = MakeKeyDict(newOctave);
    }

    public increaseOctave() {
        if (this.currentOctave < 7) {
            this.currentOctave = this.currentOctave + 1;
            this.keyDict = MakeKeyDict(this.currentOctave);
        }
    }

    public decreaseOctave() {
        if (this.currentOctave > 0) {
            this.currentOctave = this.currentOctave - 1;
            this.keyDict = MakeKeyDict(this.currentOctave);
        }
    }

    public MakeSynthCopy() : Tone.PolySynth {
        return new Tone.PolySynth(this.synth).toDestination();
    }

    public GetVoicesForBounce() {
        
    }

    // Mute(status: boolean) {
    //     this.instrument.volume.
    // }
}