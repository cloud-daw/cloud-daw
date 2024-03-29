import { MidiTrack } from './tracks/midi-track'
import { Metronome} from './instruments/metronome'
import { Recording } from './recording/recording';
import { EventEmitter } from '@angular/core';
import { MidiInstrument } from './instruments/midi-instrument';

export class Project {
    public id: string;
    public name: string;
    public email: string;
    public tempo: number;
    public signature: number;
    public tracks: MidiTrack[];
    public metronome: Metronome;
    public masterVolume: number;
    public updateEmitter: EventEmitter<void> = new EventEmitter<void>();
    constructor(id: string, name: string = "New Project", email: string = "nulluser", tempo: number = 120, signature: number = 4, tracks: MidiTrack[] = [], masterVolume: number = 0) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.tempo = tempo;
        this.signature = signature;
        this.tracks = tracks;
        this.metronome = new Metronome(this.tempo, this.signature);
        this.masterVolume = masterVolume;
    }

    updateTrackRecordingAtId(id: number, newRecording: Recording) {
        for (let i = 0; i < this.tracks.length; i++) {
            if (id == this.tracks[i].id) {
                this.tracks[i].updateRecording(newRecording.data);
                this.updateEmitter.emit()
            }
        }
    }

    addTrack(track: MidiTrack) {
        this.tracks.push(track)
        this.updateEmitter.emit()
    }

    deleteTrack(id: number) {
        for (let i = 0; i < this.tracks.length; i++) {
            if (id == this.tracks[i].id) {
                this.tracks.splice(i, 1)
                this.updateEmitter.emit()
            }
        }
    }

    changeTrackInstrument(id: number, instrument: MidiInstrument) {
        for (let i = 0; i < this.tracks.length; i++) {
            if (id == this.tracks[i].id) {
                this.tracks[i].instrument = instrument;
                this.updateEmitter.emit()
            }
        }
    }

    save() {
        this.updateEmitter.emit()
    }
}