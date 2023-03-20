import { NoteInfo, EffectInfo, TrackInfo, ProjectInfo, InstrumentInfo } from '../../models/db/project-info'
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import { MidiTrack } from '../../models/tracks/midi-track'
import { Project } from '../../models/project'
import { Note } from '../../models/recording/note'

export function HydrateProjectFromDB(project: ProjectInfo) : Project {
    let tracks = makeAllTracks(project.tracks)
    return new Project(project.id, project.name, project.email, project.tempo, project.signature, tracks, project.master_volume);
}

function makeAllTracks(info: TrackInfo[]) : MidiTrack[] {
    let tracks: MidiTrack[] = [];
    for (let i = 0; i < info.length; i++) {
        tracks.push(makeTrack(info[i]))
    }
    tracks[0].selected = true;
    return tracks;
}

function makeTrack(info: TrackInfo): MidiTrack {
    let track = new MidiTrack(info.title, info.id, makeInstrumentFromInfo(info.instrument), false, makeAllEffects(info.effects));
    track.setRecording(makeRecordingFromInfo(info.notes));
    return track;
}


//. effects will need to be constructed once we get there

function makeAllEffects(info: EffectInfo[]): string[] {
    let effects: string[] = [];
    for (let i = 0; i < info.length; i++) {
        effects.push(makeEffect(info[i]));
    }
    return effects;
}

function makeEffect(info: EffectInfo): string {
    return info.effect;
}

function makeInstrumentFromInfo(info: InstrumentInfo): MidiInstrument {
    return new MidiInstrument(info.name)
}

function makeRecordingFromInfo(info: NoteInfo[]): Note[] {
    let notes : Note[] = []
    for (let i = 0; i < info.length; i++) {
        notes.push(new Note(info[i].value, info[i].attack, info[i].release, info[i].duration));
    }
    return notes;
}