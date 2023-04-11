import { NoteInfo, EffectInfo, TrackInfo, ProjectInfo, InstrumentInfo, AudioInfo } from '../../models/db/project-info'

export function MakeInfoFromDbRes(res: any): ProjectInfo {
    console.log('db res', res);
    let tracks: TrackInfo[] = makeAllTrackInfo(res.tracks);
    return { id: res.id, name: res.name, email: res.email, master_volume: res.masterVolume, tracks: tracks, tempo: res.tempo, signature: res.signature };
}

function makeAllTrackInfo(tracks: any[]): TrackInfo[] {
    let info: TrackInfo[] = [];
    for (let i = 0; i < tracks.length; i++) {
        info.push(makeTrackInfo(tracks[i]));
    }
    return info;
}

function makeTrackInfo(track: any): TrackInfo {
    let instrumentI: InstrumentInfo = makeInfoFromInstrument(track.instrument);
    const recording = track.notes ? track.notes : []
    let notesI: NoteInfo[] = makeInfoFromRecording(recording)
    let effectsI: EffectInfo[] = makeAllEffectInfo(track.effects);
    let isAudio = track.isAudio || false;
    return {title: track.title, id: track.id, instrument: instrumentI, notes: notesI, overlaps: track.overlaps, volume: track.volume, isMute: false, isSolo: false, effects: effectsI, isAudio: isAudio, audio: makeAudioInfo(track.audio)};
}


//. effects will need to be constructed once we get there

function makeAllEffectInfo(info: string[]): EffectInfo[] {
    return [];
}

function makeAudioInfo(audio: any): AudioInfo | number {
    if (audio !== undefined && audio != 0 && audio.buffer) {
        console.log('from db res audio', audio)
        return {name: audio.name, starts_at: audio.starts_at.toString(), buffer: audio.buffer}
    }
    else return 0;
}

// function makeEffectInfo(effect: string): EffectInfo {
//     return;
// }

function makeInfoFromInstrument(instrument: any): InstrumentInfo {
    return {name: instrument.name, type: instrument.sound};
}

function makeInfoFromRecording(notes: any[]): NoteInfo[] {
    let notesI: NoteInfo[] = [];
    for (let i = 0; i < notes.length; i++) {
        notesI.push(makeInfoFromNote(notes[i]));
    }
    return notesI;
}

function makeInfoFromNote(note: any): NoteInfo {
    return { value: note.value, attack: note.attack.toString(), release: note.release.toString(), duration: parseFloat(note.duration.toString()) };
}