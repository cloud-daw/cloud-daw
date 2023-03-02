import { MidiTrack } from './tracks/midi-track'
import {Metronome} from './instruments/metronome'

export class Project {
    public id: string;
    public name: string;
    public tempo: number;
    public signature: number | number[];
    public tracks: MidiTrack[];
    public metronome: Metronome;
    constructor(id: string, name: string = "New Project", tempo: number = 120, signature: number | number[] = 4, tracks: MidiTrack[] = []) {
        this.id = id;
        this.name = name;
        this.tempo = tempo;
        this.signature = signature;
        this.tracks = tracks;
        this.metronome = new Metronome(this.tempo, this.signature);
    }
}