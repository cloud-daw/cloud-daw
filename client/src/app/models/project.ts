import { MidiTrack } from './tracks/midi-track'
import {Metronome} from './instruments/metronome'
import { Recording } from './recording/recording';

export class Project {
    public id: string;
    public name: string;
    public user: string;
    public tempo: number;
    public signature: number;
    public tracks: MidiTrack[];
    public metronome: Metronome;
    public masterVolume: number;
    constructor(id: string, name: string = "New Project", user: string = "this user", tempo: number = 120, signature: number = 4, tracks: MidiTrack[] = [], masterVolume: number = 0) {
        this.id = id;
        this.name = name;
        this.user = user;
        this.tempo = tempo;
        this.signature = signature;
        this.tracks = tracks;
        this.metronome = new Metronome(this.tempo, this.signature);
        this.masterVolume = masterVolume;
    }

    updateTrackRecordingAtId(id: number, newRecording: Recording) {
        for (let i = 0; i < this.tracks.length; i++) {
            if (id = this.tracks[i].id) {
                this.tracks[i].updateRecording(newRecording.data);
            }
        }
    }
}