export class Note {
    public value: string;
    public attack: string;
    public release: string;
    constructor(value: string, attack: string, release: string) {
        this.value = value;
        this.attack = attack;
        this.release = release;
    }
}