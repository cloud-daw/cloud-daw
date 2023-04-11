import * as Tone from 'tone';

export class AudioTrack {
    public name: string;
    //public mp3s: { starts_at: Tone.Unit.Time, load: AudioBuffer }[] = []
    //public players: Tone.Player[] = [];
    public mp3: { starts_at: Tone.Unit.Time, buffer: Float32Array[] } = {starts_at: '1:0:0', buffer: []};
    public player: Tone.Player;
    public reader: FileReader;
    constructor(name: string) {
        this.name = name;
        this.reader = new FileReader();
        this.player = new Tone.Player().toDestination();
    }

    AddAudio(file: File, callback: () => void) {
        console.log('filechange called, event', file)
        const url = URL.createObjectURL(file)
        console.log('obj url', url);
        this.reader.readAsArrayBuffer(file);

        this.reader.onload = async () => {
            const context = Tone.context;
            const buffer = await context.decodeAudioData(this.reader.result as ArrayBuffer);
            console.log("buffer loaded", buffer)
            const toneBuffer = new Tone.Buffer(buffer)
            const bufArrayCheck = toneBuffer.toArray()
            let bufArray: Float32Array[] = [];
            if (bufArrayCheck instanceof Float32Array) {
                bufArray = [bufArrayCheck]
            }
            else {
                bufArray = bufArrayCheck;
            }
            this.mp3 = { starts_at: '1:0:0', buffer: bufArray }
            //this.player.buffer = new Tone.Buffer(buffer);
            this.ReadAudio();
            callback();
        }
    };

    ReadAudio() {
        const buf = Tone.ToneAudioBuffer.fromArray(this.mp3.buffer);
        this.player.buffer = buf;
        //console.log('to arr', buf.toArray());
    }

    setMP3Info(buffer: Float32Array[], starts_at: Tone.Unit.Time) {
        this.mp3 = { starts_at: starts_at, buffer: buffer };
        this.ReadAudio();
    }

    SetStartTime(time: Tone.Unit.Time) {
        this.mp3.starts_at = time;
    }
}