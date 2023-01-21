import * as Tone from 'tone';

export class Metronome {
    public tempo: number;
    public signature: number;
    private clicker: any;
    private clickerSound: any;
    public currentBeat: number;
    public currentMeasure: number;
    constructor(tempo: number, signature: number) {
        this.tempo = tempo;
        this.clickerSound = new Tone.Synth().toDestination();
        this.currentBeat = 0;
        this.signature = signature;
        this.currentMeasure = 1;
    }

    public SetTempo(newTempo: number) {
        this.tempo = newTempo;
    }

    public Start() {
        const interval = this.GetInterval();
        this.clicker = setInterval(() => {
            this.clickerSound.triggerAttackRelease("C6", 0.1);
            this.currentBeat++;
            if (this.currentBeat > this.signature) { //placement tracking
                this.currentBeat = 1;
                this.currentMeasure++;
            }
        }, interval)
    }

    public Stop() {
        clearInterval(this.clicker);
    }

    public Reset() {
        this.Stop();
        this.currentBeat = 0;
        this.currentMeasure = 1;
    }

    private GetInterval() {
        return (60 / this.tempo) * 1000;
    }
}