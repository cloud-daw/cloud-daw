import * as Tone from 'tone';

export class Metronome {
    public tempo: number;
    public signature: number;
    private clickerSound: Tone.PluckSynth;
    public currentMeasure: string;
    public currentBeat: string;
    public currentSixteenth: string;
    public isPlaying: boolean;
    constructor(tempo: number, signature: number) {
        this.tempo = tempo;
        this.clickerSound = new Tone.PluckSynth().toDestination();
        this.currentMeasure = '1';
        this.currentBeat = '1';
        this.currentSixteenth = '1'
        this.signature = signature;
        Tone.Transport.bpm.value = tempo;
        this.isPlaying = false;
    }

    /**
     * 
     * @param measure opt param to specify starting point
     * @param beat same
     * @param sixteenth same
     * TODO: look further into tone transport for starting from non 0;
     */
    public Start(measure?: string, beat?: string, sixteenth?: string) {
        Tone.Transport.scheduleRepeat((time) => {
            this.UpdateTime();
        }, "16n");

        Tone.Transport.scheduleRepeat((time) => {
            this.clickerSound.triggerAttackRelease("C6", 0.1, time);
        }, "4n");
        this.isPlaying = true;
        Tone.Transport.start();
    }

    public Stop() {
        this.isPlaying = false;
        Tone.Transport.pause();
        
    }

    public Reset() {
        Tone.Transport.stop();
        this.isPlaying = false;
        Tone.Transport.position = '0:0:0';
        this.currentMeasure = '1';
        this.currentBeat = '1';
        this.currentSixteenth = '1';
    }

    public SetTempo(tempo: number) {
        Tone.Transport.bpm.value = tempo;
        this.tempo = tempo;
    }

    
    public OnPositionChange(measure: string, beat: string, sixteenth: string) {
        this.MovePosition([measure, beat, sixteenth]);
        this.UpdateTime();
    }

    private GetCurrentTime() {
        return Tone.Transport.position.toString().split(':'); //returns [measure, beat, sixteenth]
    }
    
    private UpdateTime() {
        let curr = this.GetCurrentTime();
        console.log('curr time');
        console.log(curr);
        this.currentMeasure = curr[0];
        this.currentBeat = this.shiftInd(curr[1]);
        this.currentSixteenth = this.roundSixteenth(curr[2]);
    }

    private MovePosition(position: string[]) {
        if (this.isPlaying) this.Stop()
        Tone.Transport.position = position.join(':');
    }

    private shiftInd(beat: string) {
        switch (beat) {
            case '0':
                beat = '1';
                break;
            case '1':
                beat = '2';
                break;
            case '2':
                beat = '3';
                break;
            case '3':
                beat = '4';
                break;
        }
        return beat;
    }
    
    private roundSixteenth(sixteenth: string) {
        return this.shiftInd(sixteenth.charAt(0));
    }
}