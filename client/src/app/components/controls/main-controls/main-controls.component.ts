import { Component, Output, Input, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Metronome } from '../../../models/instruments/metronome';
import * as Tone from 'tone';

@Component({
  selector: 'app-main-controls',
  templateUrl: './main-controls.component.html',
  styleUrls: ['./main-controls.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MainControlsComponent {
  @Output() play: EventEmitter<boolean> = new EventEmitter();
  @Output() record: EventEmitter<boolean> = new EventEmitter();
  @Output() pause: EventEmitter<boolean> = new EventEmitter();
  @Output() rewind: EventEmitter<boolean> = new EventEmitter();
  @Output() undo: EventEmitter<number> = new EventEmitter();
  @Output() volume: EventEmitter<number> = new EventEmitter();
  @Output() tutorial: EventEmitter<any> = new EventEmitter();
  @Output() tutorialNext: EventEmitter<any> = new EventEmitter();
  @Output() projects: EventEmitter<any> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();
  @Output() bounce: EventEmitter<any> = new EventEmitter();
  @Output() octaveUp: EventEmitter<number> = new EventEmitter<number>();
  @Output() octaveDown: EventEmitter<number> = new EventEmitter<number>();
  @Output() tempoChanged: EventEmitter<number> = new EventEmitter<number>();
  
  @Input() isRecording: boolean = false;

  @Input() metronome: Metronome = new Metronome();
  @Input() bar: number = 1;
  @Input() beat: number = 1;
  @Input() octave: number = 4;

  public dbLevel: number = 0;

  editTempo: boolean = false;
  tempoBtnMessage: string = "Edit"
  changeTempoValue: number = this.metronome.tempo;
  constructor() {}

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
    this.adjustMasterVolume(event);
    this.volume.emit(event);
  }

  clickLogout() {
    this.logout.emit();
  }
  clickTutorial() {
    this.tutorial.emit();
  }
  clickProjects(){
    this.projects.emit();
  }
  clickTutorialNext() {
    this.tutorialNext.emit();
  }

  clickBounce() {
    this.bounce.emit();
  }

  onOctaveUp() {
    this.octaveUp.emit();
  }

  onOctaveDown() {
    this.octaveDown.emit();
  }

  handleEditTempo() {
    this.editTempo = !this.editTempo;
    if (this.editTempo) {
      this.tempoBtnMessage = "Set"
    }
    else {
      this.tempoBtnMessage = "Edit"
      this.tempoChanged.emit(Math.round(this.changeTempoValue));
    }
  }

  onEditTempo(newTempoEvent: any) {
    if (this.validateTempoInput(newTempoEvent.target.value)) {
      console.log('validated tempo', newTempoEvent.target.value)
      this.changeTempoValue = parseInt(newTempoEvent.target.value)
      this.changeTempoValue = Math.round(this.changeTempoValue);
    } else {
      console.log('invalid tempo given')
    }
  }

  validateTempoInput(str: string) : boolean {
    for (let i = 0; i < str.length; i++) {
      if (parseInt(str.charAt(i)) >= 0) {
        //do nothing
      }
       else {
        return false;
       }
    }
    return true;
  }

  /**
   * Changes master node volume level.
   * @param db The new value for master volume
   */
  private adjustMasterVolume(db: number) {
    Tone.Destination.volume.value = db;
    this.dbLevel = db;
  }
}
