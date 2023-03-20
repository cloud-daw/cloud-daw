export class PositionDict {
    vw: number;
    vwOffset: number;
    bars: number;
    signature: number;
    interval: number;
    posDictOnBB: { [key: number]: number };
    posDictOnVWPos: { [key: number]: number };
    constructor(vw: number, vwOffset: number, bars: number, signature: number) {
        this.vw = vw;
        this.bars = bars;
        this.vwOffset = vwOffset;
        this.signature = signature;
        this.interval = this.bars * this.signature;
        this.posDictOnBB = this.GetPositionDictOnBarsBeats();
        this.posDictOnVWPos = this.GetPositionDictOnVWPos();
    }
    GetPositionDictOnBarsBeats() { 
        let posDict :{[key: number]: number} = {};
        let key : number;
        for (let i = 1; i <= this.bars; i++) {
            for (let j = 1; j <= this.signature; j++) {
                key = ((i * 10) + j);
                posDict[key] = (((i - 1) * this.signature) + (j - 1)) * (this.vw / this.interval) + this.vwOffset;
            }
        }
        return posDict;
    }
    GetPositionDictOnVWPos() {
        let posDict: { [key: number]: number } = {};
        let key: number;
        for (let i = 1; i <= this.bars; i++) {
            for (let j = 1; j <= this.signature; j++) {
                key = (((i - 1) * this.signature) + (j - 1)) * (this.vw / this.interval) + this.vwOffset;
                posDict[key] = ((i * 10) + j);
            }
        }
        return posDict;
    }
    GetNearestBarsBeatsOnVWPos(vwPos: number) : number {
        let closestDistance = 1000;
        let closestBarsBeats = 0;
        let currDistance;
        let keyNum;
        for (let key in this.posDictOnVWPos) {
            keyNum = parseInt(key);
            currDistance = Math.abs(vwPos - keyNum);
            if (currDistance < closestDistance) {
                closestDistance = currDistance;
                closestBarsBeats = this.posDictOnVWPos[key];
            }
        }
        return closestBarsBeats;
    }
}