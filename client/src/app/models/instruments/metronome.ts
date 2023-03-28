import * as Tone from 'tone';

export class Metronome {
    public tempo: number;
    public signature: number | number[];
    private clickerSound: Tone.PluckSynth;
    public currentMeasure: number;
    public currentBeat: number;
    public currentSixteenth: string;
    public isPlaying: boolean;
    private isReset: boolean;
    private transport;
    private counter : number = 0;
    constructor(tempo: number = Tone.Transport.bpm.value, signature: number | number[] = Tone.Transport.timeSignature) {
        this.transport = Tone.Transport;
        this.tempo = tempo;
        this.signature = signature;
        this.clickerSound = new Tone.PluckSynth().toDestination();
        this.currentMeasure = 1;
        this.currentBeat = 1;
        this.currentSixteenth = '1';
        this.transport.bpm.value = this.tempo;
        this.transport.timeSignature = this.signature;
        this.transport.position = '1:0:0';
        this.isPlaying = false;
        this.isReset = true;
    }

    /**
     * starts metronome
     */
    public Start() {
        this.ScheduleMetronome();
        this.isPlaying = true;
        this.isReset = false;
        this.transport.start();
    }

    public ClearTransport() {
        const currPos = this.transport.position;
        this.transport.cancel();
        this.transport.position = currPos;
    }
    /**
     * Schedules clicks & UI updates along Transport
     */
    private ScheduleMetronome() {
        //Clicker
        this.transport.scheduleRepeat((time) => {
            ++this.counter;
            this.UpdateTime();
            this.clickerSound.triggerAttackRelease("C6", 0.1, time);
        }, "4n", this.transport.position);
        this.isReset = false; //now scheduled, no need to redo until another reset
    }

    public Pause() {
        this.isPlaying = false;
        this.transport.pause();
        this.UpdateTime();
    }

    public Reset() {
        this.transport.stop();
        this.transport.cancel();
        this.counter = 0;
        this.isPlaying = false;
        this.transport.position = '1:0:0';
        this.UpdateTime();
        this.isReset = true;
    }

    public SetTempo(tempo: number) {
        this.transport.bpm.value = tempo;
        this.tempo = tempo;
    }

    /**
     * Public method to call when changing slider
     */
    public OnPositionChange(measure: number, beat: number) {
        this.MovePosition(measure, beat);
        this.UpdateTime();
        return (this.currentMeasure, this.currentBeat);
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
        this.currentMeasure = Math.floor(this.counter / 4) + 1;
        this.currentBeat = (this.counter % 4) + 1;
    }

    /**
     * Helper moving time slider
     * @param position New position as [bar, beat, sixteenth] to move Transport to
     */
    private MovePosition(bar: number, beat: number) {
        this.transport.pause();
        // const ticksPerBeat = Tone.Transport.PPQ / 4; // PPQ is pulses per quarter note
        // const ticksPerMeasure = ticksPerBeat * 4;
        // const tickPosition = ticksPerMeasure * (bar - 1) + (ticksPerBeat * (beat - 1));
        // Set the transport position to the desired tick position
        //this.transport.position = tickPosition;
        this.transport.position = `${bar}:${beat}:0`
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