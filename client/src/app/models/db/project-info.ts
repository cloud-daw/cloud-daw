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
    email: string;
    master_volume: number;
    tracks: TrackInfo[];
    tempo: number;
    signature: number;
}