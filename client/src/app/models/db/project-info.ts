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

export interface AudioInfo {
    name: string;
    starts_at: string;
    buffer: Float32Array[];
}

export interface TrackInfo {
    title: string;
    id: number;
    instrument: InstrumentInfo;
    notes: NoteInfo[];
    overlaps: number;
    volume: number;
    isMute: boolean;
    isSolo: boolean;
    effects: EffectInfo[];
    isAudio: boolean;
    audio: AudioInfo | number; // 0 for undefined
}


export interface ProjectInfo {
    id: string;
    name: string;
    email: string;
    master_volume: number;
    tracks: TrackInfo[];
    tempo: number;
    signature: number;
}