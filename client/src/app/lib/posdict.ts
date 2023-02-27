export function getPositionDictOnBarsBeats(vw: number, bars: number, signature: number) { 
    let posDict :{[key: string]: number} = {};
    let key : string;
    for (let i = 0; i < bars; i++) {
        for (let j = 0; j < signature; j++) {
            key = (i + j).toString();
            posDict[key] = (vw / (i + j));
        }
    }
    return posDict;
}

export function getPositionDictOnVWPos(vw: number, bars: number, signature: number) {
    let posDict :{[key: number]: string} = {};
    let key : number;
    for (let i = 0; i < bars; i++) {
        for (let j = 0; j < signature; j++) {
            key = (vw / (i + j));
            posDict[key] = (i + j).toString();
        }
    }
    return posDict;
}