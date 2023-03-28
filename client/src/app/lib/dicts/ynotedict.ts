export function createYNoteDict() {
    const notePositions = {};
    const octaves = [0, 1, 2, 3, 4, 5, 6, 7];

    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    octaves.forEach(octave => {
        let noteIndex = 0;
        noteOrder.forEach(note => {
            const noteName = `${note}${octave}`;
            notePositions[noteName] = (1 - ((noteIndex * 100) / (noteOrder.length - 1))) + '%';
            noteIndex++;
        });
    });
    
    return notePositions;
}