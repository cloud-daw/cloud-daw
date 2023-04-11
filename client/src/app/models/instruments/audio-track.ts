import * as Tone from 'tone';

export class AudioTrack {
    public name: string;
    public mp3s: { starts_at: Tone.Unit.Time, load: AudioBuffer }[] = []
    public players: Tone.Player[] = [];
    public reader: FileReader;
    constructor(name: string) {
        this.name = name;
        this.reader = new FileReader();
    }

    AddAudio(file: File) {
        this.reader.onload = 
    }

    onFileChange(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            let buffer = new Tone.Buffer().fromArray(reader.result as ArrayBuffer);
        });

        reader.readAsArrayBuffer(file);
  }
}