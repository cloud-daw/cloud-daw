import * as Tone from 'tone';

export class Metronome {
    public tempo: number;
    public signature: number | number[];
    private clickerSound: Tone.PluckSynth;
    public currentMeasure: string;
    public currentBeat: string;
    public currentSixteenth: string;
    public isPlaying: boolean;
    private isReset: boolean;
    private transport;
    constructor(tempo: number = Tone.Transport.bpm.value, signature: number | number[] = Tone.Transport.timeSignature) {
        this.transport = Tone.Transport;
        this.tempo = tempo;
        this.signature = signature;
        this.clickerSound = new Tone.PluckSynth().toDestination();
        this.currentMeasure = '1';
        this.currentBeat = '1';
        this.currentSixteenth = '1';
        this.transport.bpm.value = this.tempo;
        this.transport.timeSignature = this.signature
        this.isPlaying = false;
        this.isReset = true;
    }

    /**
     * starts metronome
     */
    public Start() {
        if (this.isReset) this.ScheduleMetronome();
        this.isPlaying = true;
        this.transport.start();
    }

    /**
     * Schedules clicks & UI updates along Transport
     */
    private ScheduleMetronome() {
        //UI
        this.transport.scheduleRepeat((time) => {
            this.UpdateTime();
        }, "16n");

        //Clicker
        this.transport.scheduleRepeat((time) => {
            this.clickerSound.triggerAttackRelease("C6", 0.1, time);
        }, "4n");
        
        this.isReset = false; //now scheduled, no need to redo until another reset
    }

    public Pause() {
        this.isPlaying = false;
        this.transport.pause();
        
    }

    public Reset() {
        this.transport.stop();
        this.isPlaying = false;
        this.transport.position = '0:0:0';
        this.currentMeasure = '1';
        this.currentBeat = '1';
        this.currentSixteenth = '1';
        this.isReset = true;
    }

    public SetTempo(tempo: number) {
        this.transport.bpm.value = tempo;
        this.tempo = tempo;
    }

    /**
     * Public method to call when changing slider
     */
    public OnPositionChange(measure: string, beat: string, sixteenth: string) {
        this.MovePosition([measure, beat, sixteenth]);
        this.UpdateTime();
    }

    /**
     * Gets Transport position
     * @returns current Transport pos [bars, beats, sixteenths]
     */
    private GetCurrentTime() {
        return this.transport.position.toString().split(':'); //returns [measure, beat, sixteenth]
    }
    
    /**
     * Updates the time values to display on UI
     */
    private UpdateTime() {
        let curr = this.GetCurrentTime();
        this.currentMeasure = curr[0];
        this.currentBeat = this.ShiftInd(curr[1]);
        this.currentSixteenth = this.RoundSixteenth(curr[2]);
    }

    /**
     * Helper moving time slider
     * @param position New position as [bar, beat, sixteenth] to move Transport to
     */
    private MovePosition(position: string[]) {
        if (this.isPlaying) this.Pause()
        this.transport.position = position.join(':');
        if (this.isPlaying) this.Start()
    }

    /**
     * Shifts Transport position for string representation on UI
     * @param beat the current beat from Transport
     * @returns shifted range 0:n -> 1:(n+1)
     */
    private ShiftInd(beat: string) {
        switch (beat) {
            case '0':
                return '1';
            case '1':
                return '2';
            case '2':
                return '3';
            case '3':
                return '4';
            default:
                return (parseInt(beat) + 1).toString(); //default process, switch stmt expidite for 4/4 
        }
    }
    
    /**
     * cuts off 16th decimals 
     * @param sixteenth index 2 of Transport position bars:beats:sixteenths as array
     * @returns Shifted value of sixteenth's beat
     */
    private RoundSixteenth(sixteenth: string) {
        return this.ShiftInd(sixteenth.charAt(0));
    }
}