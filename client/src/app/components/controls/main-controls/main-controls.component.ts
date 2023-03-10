import { Component, Output, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Metronome } from '../../../models/instruments/metronome';
import * as Tone from 'tone';

@Component({
  selector: 'app-main-controls',
  templateUrl: './main-controls.component.html',
  styleUrls: ['./main-controls.component.css']
})
export class MainControlsComponent implements OnChanges {
  @Output() play: EventEmitter<boolean> = new EventEmitter();
  @Output() record: EventEmitter<boolean> = new EventEmitter();
  @Output() pause: EventEmitter<boolean> = new EventEmitter();
  @Output() rewind: EventEmitter<boolean> = new EventEmitter();
  @Output() undo: EventEmitter<number> = new EventEmitter();
  @Output() volume: EventEmitter<number> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();
  
  @Input() isRecording: boolean = false;

  @Input() metronome: Metronome = new Metronome();
  @Input() bar: number = 1;
  @Input() beat: number = 1;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  clickPlay() {
    this.play.emit(true);
  }

  clickRecord() {
    this.record.emit(true);
  }

  clickPause() {
    this.pause.emit(true);
  }

  clickRewind() {
    this.rewind.emit(true);
  }

  clickUndo() {
    this.undo.emit(-1);
  }

  onVolumeChange(event: number) {
    this.volume.emit(event);
  }

  clickLogout() {
    this.logout.emit();
  }

  /**
   * Changes master node volume level.
   * @param db The new value for master volume
   */
  private adjustMasterVolume(db: number) {
    Tone.Destination.volume.value = db;
}
}
