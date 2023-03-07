import { Project } from '../../models/project'
import { v4 as uuidv4 } from 'uuid';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';

export function MakeNewProject(email: string, title: string = 'New Project') {
    let id = uuidv4()
    return new Project(id, title, email, 120, 4, [new MidiTrack('Track 0', 0, new MidiInstrument('Synth'), true)])
}