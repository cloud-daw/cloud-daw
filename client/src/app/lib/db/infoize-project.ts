import { MidiInstrument } from "src/app/models/instruments/midi-instrument";
import { Project } from "src/app/models/project";
import { Note } from "src/app/models/recording/note";
import { MidiTrack } from "src/app/models/tracks/midi-track";
import { AudioTrack } from "src/app/models/instruments/audio-track";
import { NoteInfo, EffectInfo, TrackInfo, ProjectInfo, InstrumentInfo, AudioInfo } from '../../models/db/project-info'

/* Info Reference

export interface NoteInfo {
    value: string;
    attack: string;
    release: string;
    duration: number;
}

export interface InstrumentInfo {
    name: string;
    type: string; //type of synth to init
}

export interface EffectInfo {
    effect: string;
    options: string[];
}

export interface TrackInfo {
    title: string;
    id: number;
    instrument: InstrumentInfo;
    notes: NoteInfo[];
    volume: number;
    isMute: boolean;
    isSolo: boolean;
    effects: EffectInfo[];
}


export interface ProjectInfo {
    id: string;
    name: string;
    user: string;
    master_volume: number;
    tracks: TrackInfo[];
    tempo: number;
    signature: number;
}

*/
/* */

export function InfoizeProject(project: Project): ProjectInfo {
    console.log('infoizing', project);
    let tracks: TrackInfo[] = makeAllTrackInfo(project.tracks);
    return { id: project.id, name: project.name, email: project.email, master_volume: project.masterVolume, tracks: tracks, tempo: project.tempo, signature: project.signature };
}

function makeAllTrackInfo(tracks: MidiTrack[]): TrackInfo[] {
    let info: TrackInfo[] = [];
    for (let i = 0; i < tracks.length; i++) {
        info.push(makeTrackInfo(tracks[i]));
    }
    return info;
}

function makeTrackInfo(track: MidiTrack): TrackInfo {
    let instrumentI: InstrumentInfo = makeInfoFromInstrument(track.instrument);
    let notesI: NoteInfo[] = makeInfoFromRecording(track.midi.data)
    let effectsI: EffectInfo[] = makeAllEffectInfo(track.effects);
    return { title: track.title, id: track.id, instrument: instrumentI, notes: notesI, overlaps: track.midi.maxOverlaps, volume: track.volume, isMute: false, isSolo: false, effects: effectsI, isAudio: track.isAudio, audio: makeAudioInfo(track.audio)};
}

function makeAudioInfo(audio: AudioTrack | undefined): AudioInfo | number {
    if (audio instanceof AudioTrack) {
        console.log("make info", audio.mp3);
        return {name: audio.name, starts_at: audio.mp3.starts_at.toString(), buffer: audio.mp3.buffer}
    }
    else return 0;
}


//. effects will need to be constructed once we get there

function makeAllEffectInfo(info: string[]): EffectInfo[] {
    return [];
}

// function makeEffectInfo(effect: string): EffectInfo {
//     return;
// }

function makeInfoFromInstrument(instrument: MidiInstrument): InstrumentInfo {
    return {name: instrument.name, type: instrument.sound};
}

function makeInfoFromRecording(notes: Note[]): NoteInfo[] {
    let notesI: NoteInfo[] = [];
    for (let i = 0; i < notes.length; i++) {
        notesI.push(makeInfoFromNote(notes[i]));
    }
    return notesI;
}

function makeInfoFromNote(note: Note): NoteInfo {
    return { value: note.value, attack: note.attack.toString(), release: note.release.toString(), duration: parseFloat(note.duration.toString()) };
}