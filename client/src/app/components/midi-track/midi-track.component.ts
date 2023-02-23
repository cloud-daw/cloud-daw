
import { Component, EventEmitter, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { Midi } from 'tone';
import { Recording } from 'src/app/models/recording/recording';

@Component({
  selector: 'app-midi-track',
  templateUrl: './midi-track.component.html',
  styleUrls: ['./midi-track.component.css']
})

export class MidiTrackComponent {
  //child/parent vars
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() tracks: Set<MidiTrack> = new Set<MidiTrack>();
  @Output() tracksChange: EventEmitter<Set<MidiTrack>> = new EventEmitter<Set<MidiTrack>>();
  
  private _selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Input()
    set selectedTrack(track: MidiTrack) {
      // this.selectedTrackChange.emit(track);
      this._selectedTrack = track;
    }
    get selectedTrack() {
      return this._selectedTrack;
    }
  @Output() selectedTrackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  
  //functions
  public formatLabel(value: number): string {
    return `${value}db`;
  }
  
  public deleteTrack() {
    this.tracks.delete(this.track);
  }
  
  public updateSelectedTrack(track: MidiTrack) {
    this.selectedTrack = track; // set the local `selectedTrack` property
    this.selectedTrackChange.emit(track); // emit the `trackSelected` event with this component as the argument
    this.track.selected = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTrack']) {
      if (this.track != this.selectedTrack) {
        this.track.selected = false;
      }
    }
  }
}

/**
 * Sample Code for Midi Playback
 * let tape = {
  ppq: 24,
  bpm: 110,
  tracks: [
    {
      noteOn: {},
      noteOff: {},
    }
  ],
};
let step = 0;
function tick() {
  tape.tracks.forEach(function (track, trackNumber) {
    if (typeof track.noteOn[step] !== "undefined") {
      for (let note in track.noteOn[step]) {
        getOutputDevice(trackNumber).playNote(note, track.outputChannel, {
          velocity: track.noteOn[step][note],
        });
      }
    }
    if (typeof track.noteOff[step] !== "undefined") {
      track.noteOff[step].forEach(function (note) {
        getOutputDevice(trackNumber).stopNote(note, track.outputChannel);
      });
    }
  });
  step++;
}
 */
