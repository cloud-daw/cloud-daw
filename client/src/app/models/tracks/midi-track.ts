import * as Tone from 'tone';
import { MidiInstrument } from '../instruments/midi-instrument';
import { Recording } from '../recording/recording';
import { Note } from '../recording/note';

export class MidiTrack {
    title: string;
    id: number;
    volume: number = -12;
    instrument: MidiInstrument;
    selected: boolean;
    effects: string[] = [];
    midi: Recording = new Recording(new MidiInstrument(''));
    constructor(title: string, id: number, instrument: MidiInstrument, selected: boolean, effects: string[] = []) {
        this.title = title;
        this.id = id;
        this.instrument = instrument;
        this.selected = selected;
        this.effects = effects;
    }

    /**
     * Adjusts volume for single track
     * @param db New dB level for track
     */
    public ChangeVolume(db: number) {
        this.instrument.AdjustVolume(db);
    }

    public updateRecording(newNotes: Note[]) {
        this.midi.data = newNotes;
    }

    public setRecording(notes: Note[]) {
        this.midi = new Recording(this.instrument, notes);
    }

    // public MuteTrack(status: boolean) {
    //     this.instrument.Mute(status);
    // }

    // public SoloTrack(status: boolean) {
    //     this.instrument.Solo(status);
    // }

}