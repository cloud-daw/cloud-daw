import * as Tone from 'tone';

export class AudioTrack {
    public name: string;
    //public mp3s: { starts_at: Tone.Unit.Time, load: AudioBuffer }[] = []
    //public players: Tone.Player[] = [];
    public mp3!: { starts_at: Tone.Unit.Time, buffer: AudioBuffer };
    public player: Tone.Player;
    public reader: FileReader;
    constructor(name: string) {
        this.name = name;
        this.reader = new FileReader();
        this.player = new Tone.Player().toDestination();
    }

    AddAudio(file: File) {
        console.log('filechange called, event', file)
        const url = URL.createObjectURL(file)
        console.log('obj url', url);
        this.reader.readAsArrayBuffer(file);

        this.reader.onload = async () => {
            const context = Tone.context;
            const buffer = await context.decodeAudioData(this.reader.result as ArrayBuffer);
            console.log("buffer loaded", buffer)
            this.mp3 = { starts_at: '1:0:0', buffer: buffer }
            this.player.buffer = new Tone.Buffer(buffer);
        }
    };

    SetStartTime(time: Tone.Unit.Time) {
        this.mp3.starts_at = time;
    }
}