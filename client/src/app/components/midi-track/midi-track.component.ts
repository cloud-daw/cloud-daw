
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
  
  // private _currentTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  // @Input()
  //   set currentTrack(track: MidiTrack) {
  //     this.currentTrackChange.emit(track);
  //     this._currentTrack = track;
  //   }
  //   get currentTrack() {
  //     return this._currentTrack;
  //   }
  // @Output() currentTrackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  @Input() currentTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Output() currentTrackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();

  set setCurrentTrack(value: MidiTrack) {
    this.currentTrack = value;
    this.currentTrackChange.emit(value);
  }

  public midi: Recording = this.track.midi;

  
  //functions
  public formatLabel(value: number): string {
    return `${value}db`;
  }
  
  public deleteTrack() {
    this.tracks.delete(this.track);
  }
  
  public updateCurrentTrack() {
    this.currentTrack = this.track;
    this.track.selected = true;
  }

  // private updateRecording(id: number) {
  //   let setRecording = this.recordings.has(id)
  //     ? this.recordings.get(id)
  //     : new Recording(this.currentTrack.instrument);
  
  //   this.currentRecording = setRecording || new Recording(this.currentTrack.instrument);
    
  // }

  ngOnChanges(changes: SimpleChanges) {
    //changes['currentTrack'].currentValue = this.currentTrack;
    if (changes['currentTrack']) {
      if (this.track != this.currentTrack) {
        this.track.selected = false;
      }
      //this.updateRecording(this.currentTrack.id);
    }
    //console.log(changes);
    //console.log('selected: ' + changes['currentTrack'].currentValue.title, 'track: ' + changes['track'].currentValue.title);
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
