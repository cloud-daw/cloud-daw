import * as Tone from 'tone';
import { MidiInstrument } from '../instruments/midi-instrument';
import { Recording } from '../recording/recording';
import { Note } from '../recording/note';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';

import { AudioTrack } from '../instruments/audio-track';

// Define a clip interface to hold information about each MIDI clip
export interface Clip {
    id: number;
    name: string;
    start: number;
    end: number;
    notes: _Note[];
}
  
// Define a note interface to hold information about each MIDI note
export interface _Note {
    pitch: number;
    velocity: number;
    startTime: number;
    releaseTime: number;
    duration: number;
}

export class MidiTrack {
    title: string;
    id: number;
    volume: number;
    instrument: MidiInstrument;
    selected: boolean;
    effects: string[] = [];
    isAudio: boolean;
    midi: Recording = new Recording(new MidiInstrument(''));
    audio: AudioTrack | undefined;
    constructor(title: string, id: number, instrument: MidiInstrument, selected: boolean, isAudio: boolean = false, volume: number = 0, effects: string[] = []) {
        this.title = title;
        this.id = id;
        this.instrument = instrument;
        this.selected = selected;
        this.effects = effects;
        this.volume = volume;
        this.isAudio = isAudio;
        if (this.isAudio) {
            this.audio = new AudioTrack(title);
            this.instrument.Mute(true);
        }
        this.ChangeVolume(this.volume);
    }

    /**
     * Adjusts volume for single track
     * @param db New dB level for track
     */
    public ChangeVolume(db: number) {
        this.volume = db;
        this.instrument.AdjustVolume(db);
        this.instrument.NormalizeVolume();
    }

    public updateRecording(newNotes: Note[]) {
        this.midi.data = newNotes;
        this.midi.UpdateOverlaps();
    }

    public setRecording(notes: Note[]) {
        this.midi = new Recording(this.instrument, notes);
    }

    public setAudio(file: File, callback: () => void ) {
        if (this.isAudio && this.audio) this.audio.AddAudio(file, callback);
    }

    public GetThingForPlayback() : {isAudio: boolean, recording: Recording | undefined, audio: AudioTrack | undefined} {
        if (this.isAudio && this.audio) return { isAudio: true, recording: undefined, audio: this.audio };
        else return { isAudio: false, recording: this.midi, audio: undefined };
    }

    // public MuteTrack(status: boolean) {
    //     this.instrument.Mute(status);
    // }

    // public SoloTrack(status: boolean) {
    //     this.instrument.Solo(status);
    // }

}