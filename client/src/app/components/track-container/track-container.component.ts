import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MidiTrackComponent } from '../midi-track/midi-track.component';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { Recording } from 'src/app/models/recording/recording';

@Component({
  selector: 'app-track-container',
  templateUrl: './track-container.component.html',
  styleUrls: ['./track-container.component.css']
})

export class TrackContainerComponent {
  @Input() tracks: Set<MidiTrack> = new Set<MidiTrack>();
  //@Input() currentTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  //@Input() currentRecording: Recording = new Recording(new MidiInstrument(''));
  
  private _currentTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Input()
    set currentTrack(track: MidiTrack) {
      this.currentTrackChange.emit(track);
      this._currentTrack = track;
    }
    get currentTrack() {
      return this._currentTrack;
    }
  @Output() currentTrackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();

  private _currentRecording: Recording = new Recording(new MidiInstrument(''));
  @Input()
    set currentRecording(recording: Recording) {
      this.currentRecordingChange.emit(recording);
      this._currentRecording = recording;
    }
    get currentRecording() {
      return this._currentRecording;
    }
  @Output() currentRecordingChange: EventEmitter<Recording> = new EventEmitter<Recording>();

  private _recordings: Map<number, Recording> = new Map<number, Recording>();
  @Input()
    set recordings(map: Map<number, Recording>) {
      this.recordingsChange.emit(map);
      this._recordings = map;
    }
    get recordings() {
      return this._recordings;
    }
  @Output() recordingsChange: EventEmitter<Map<number, Recording>> = new EventEmitter<Map<number, Recording>>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentTrack']) console.log('currentTrack @ container level: ', this.currentTrack.id);
  }
}
