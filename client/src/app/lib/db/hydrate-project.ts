import { NoteInfo, EffectInfo, TrackInfo, ProjectInfo, InstrumentInfo, AudioInfo } from '../../models/db/project-info'
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import { MidiTrack } from '../../models/tracks/midi-track'
import { AudioTrack } from '../../models/instruments/audio-track'
import { Project } from '../../models/project'
import { Note } from '../../models/recording/note'
import { GetSynthByKeyword } from '../dicts/synthdict'

export function HydrateProjectFromInfo(project: ProjectInfo) : Project {
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
    let track = new MidiTrack(info.title, info.id, makeInstrumentFromInfo(info.instrument), false, info.isAudio, info.volume, makeAllEffects(info.effects));
    track.setRecording(makeRecordingFromInfo(info.notes));
    track.midi.maxOverlaps = info.overlaps;
    track.audio = makeAudio(info.audio);
    return track;
}


function makeAudio(info: AudioInfo | number) : AudioTrack | undefined{
    if (typeof info != 'number') {
        console.log("making audio", info);
        const track = new AudioTrack(info.name);
        track.setMP3Info(info.buffer, info.starts_at);
        return track;
    }
    else return undefined;
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
    return GetSynthByKeyword(info.name)
}

function makeRecordingFromInfo(info: NoteInfo[]): Note[] {
    let notes : Note[] = []
    for (let i = 0; i < info.length; i++) {
        notes.push(new Note(info[i].value, info[i].attack, info[i].release, info[i].duration));
    }
    return notes;
}