import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { MidiNoteComponent } from '../midi-note/midi-note.component';
import * as Tone from 'tone';
import { BlockMode } from 'src/app/components/home/home.component';
import { CdkDragDrop, CdkDragEnd, CdkDragRelease, moveItemInArray } from '@angular/cdk/drag-drop';
import { Note } from 'src/app/models/recording/note';
import { timer } from 'rxjs/internal/observable/timer';


@Component({
  selector: 'app-midi-notes-container',
  templateUrl: './midi-notes-container.component.html',
  styleUrls: ['./midi-notes-container.component.css']
})

export class MidiNotesContainerComponent implements OnChanges {
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Input() vw : number = 100;
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() isRecording: boolean = false;
  @Input() editMode: boolean = false;
  @Input() midiContainerRef: Element | any;
  @Input() reRender: number = 0;

  @Output() triggerReRender: EventEmitter<number> = new EventEmitter();
  @Output() trackUpdated = new EventEmitter<MidiTrack>();

  //@ViewChild(MidiNoteComponent, { static: false }) noteComponent?: MidiNoteComponent;

  public visibility = 'hidden';
  public leftCSS = '';
  public widthCSS = '';

  public isSelected = false;

  public maxWidth = 0;

  public noteColor = this.editMode ? '#00ff62' : 'white';
  public selectedNote: MidiNoteComponent = new MidiNoteComponent();

  // selectCurrentNote(event: any) {
  //   this.selectedNote = event;
  // }

  onTrackUpdated(track: MidiTrack) {
    this.track = track;
    this.track.midi.UpdateOverlaps();
    this.trackUpdated.emit(track);
    // console.log('from editor', this.track.midi.data);
  }

  onTriggerReRender(num: number) {
    this.track.midi.UpdateOverlaps();
    this.computeDimensions();
    this.triggerReRender.emit(num);
  }

  onSelectedNoteChange(note: MidiNoteComponent) {
    this.selectedNote = note;
  }

  extractMinMax() : number[] {
    const recording = this.track.midi.data;
    let max = 0;
    let min = 1000;
    if (recording.length > 0) {
      for (let i = 0; i < recording.length; i++) {
        min = Math.min(parseInt(recording[i].attack.toString().split(':')[0]), min);
        max = Math.max(parseInt(recording[i].release.toString().split(':')[0]), max);
      };
      // min = parseInt(recording[0].attack.toString().split(':')[0]);
      // max = parseInt(recording[recording.length-1].release.toString().split(':')[0]);
    }
    max++;
    //console.log('min, max', min, max, this.track.midi.data);
    return [min, max];
  }

  convertMeasureToPosition(m: number) {
    //console.log(this.vw);
    const interval = this.vw / this.bars;
    //console.log('converting m to p', interval)
    return ((m - 1) * interval);
  }

  computeDimensions() {
    const minmax = this.extractMinMax();
    const left = this.convertMeasureToPosition(minmax[0]);
    const endLeft = this.convertMeasureToPosition(minmax[1]);
    const width = endLeft;
    this.maxWidth = Math.max(this.maxWidth, width);
    // if (width >= this.maxWidth) 
    this.updateVisual(left, width);
  }

  updateVisual(left: number, width: number) {
    this.visibility = 'visible';
    this.leftCSS = `${left}vw`;
    this.widthCSS = `${width}vw`;
    //console.log('let offset: ', this.leftOffsetToString, 'endLeft: ', endLeft, 'width:', this.blockWidth);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.computeDimensions();
    if (changes['selectedTrack']) {
      if (this.track == this.selectedTrack) this.isSelected = true;
      else this.isSelected = false;
      ////console.log('selected track: ', this.selectedTrack, this.isSelected);
    }
    if (changes['editMode']) {
      this.noteColor = this.editMode ? '#00ff62' : 'white';
    }
  }
}
