import { TrackInfo, ProjectInfo, InstrumentInfo } from '../../models/db/project-info'
import { MidiInstrument } from '../../models/instruments/midi-instrument'
import { MidiTrack } from '../../models/tracks/midi-track'
import { Recording } from '../../models/recording/recording'
import { Note } from '../../models/recording/note'
import * as Tone from 'tone';

export function HydrateProjectFromDB(project: ProjectInfo) {
    
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
    return new MidiTrack(info.title, info.id, makeInstrumentFromInfo(info.instrument), false);
}

function makeInstrumentFromInfo(info: InstrumentInfo): MidiInstrument {
    return new MidiInstrument(info.name)
}