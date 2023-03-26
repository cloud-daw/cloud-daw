import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { MidiNoteComponent } from '../midi-note/midi-note.component';
import * as Tone from 'tone';
import { BlockMode } from 'src/app/components/home/home.component';
import { CdkDragDrop, CdkDragEnd, moveItemInArray } from '@angular/cdk/drag-drop';
import { Note } from 'src/app/models/recording/note';

@Component({
  selector: 'app-midi-notes-container',
  templateUrl: './midi-notes-container.component.html',
  styleUrls: ['./midi-notes-container.component.css']
})

export class MidiNotesContainerComponent {
  
  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Input() vw : number = 100;
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() isRecording: boolean = false;
  @Input() editMode: boolean = false;

  @Output() trackUpdated = new EventEmitter<MidiTrack>();

  public visibility = 'hidden';
  public leftCSS = '';
  public widthCSS = '';

  public isSelected = false;

  public maxWidth = 0;

  public noteColor = this.editMode ? '#00ff62' : 'white';

  onDrop(event: CdkDragEnd<Note>) {
    const droppedData = event.source.data;
    droppedData.attack = "1:2:0.847" as Tone.Unit.Time;
    droppedData.release = "1:2:1.822" as Tone.Unit.Time;
    droppedData.duration = 0.22187499999999974 as Tone.Unit.Time;
    this.track.midi.UpdateOverlaps();
    const droppedIndex = this.track.midi.data.indexOf(droppedData);
    console.log(droppedData);
    //const draggedIndex = this.track.midi.data.indexOf(draggedData);
    //this.track.midi.data[draggedIndex].attack = "1:2:0.847";
    
    console.log(this.track.midi.data, droppedData);
    this.trackUpdated.emit(this.track);
    // Do something with the dropped MIDI note data
  }

  extractMinMax() : number[] {
    const recording = this.track.midi.data;
    let max = 0;
    let min = 1000;
    if (recording.length > 0) {
      min = parseInt(recording[0].attack.toString().split(':')[0]);
      max = parseInt(recording[recording.length-1].release.toString().split(':')[0]);
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
    if (width >= this.maxWidth) this.updateVisual(left, width);
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
