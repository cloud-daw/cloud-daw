import * as Tone from 'tone';
import { MidiInstrument } from '../instruments/midi-instrument';

export class MidiTrack {
    volume: number = -12;
    instrument: MidiInstrument;
    effects: string[] = [];
    constructor(instrument: MidiInstrument, effects?: string[]) {
        this.instrument = instrument;
        if (effects) this.effects = effects;
    }

    /**
     * Adjusts volume for single track
     * @param db New dB level for track
     */
    public ChangeVolume(db: number) {
        this.instrument.AdjustVolume(db);
    }

    // public MuteTrack(status: boolean) {
    //     this.instrument.Mute(status);
    // }

    // public SoloTrack(status: boolean) {
    //     this.instrument.Solo(status);
    // }

}