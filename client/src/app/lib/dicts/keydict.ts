export function MakeKeyDict(octave: number) {
    return {
            "a": `C${octave}`,
            "w": `C#${octave}`,
            "s": `D${octave}`,
            "e": `D#${octave}`,
            "d": `E${octave}`,
            "f": `F${octave}`,
            "t": `F#${octave}`,
            "g": `G${octave}`,
            "y": `G#${octave}`,
            "h": `A${octave}`,
            "u": `A#${octave}`,
            "j": `B${octave}`,
            "k": `C${octave + 1}`,
            "o": `C#${octave + 1}`,
            "l": `D${octave + 1}`,
            "p": `D#${octave + 1}`,
            ";": `E${octave + 1}`,
        }
}