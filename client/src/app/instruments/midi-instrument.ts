class MidiInstrument {
    public name: string;
    public soundpack?: AudioBuffer; //i think this is the right type
    constructor(name: string) {
        this.name = name;
    }
    Play(note : number) {
       //code to emit sound 
    }
}