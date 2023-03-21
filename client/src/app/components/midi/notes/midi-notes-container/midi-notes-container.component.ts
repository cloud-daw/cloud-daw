import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';

@Component({
  selector: 'app-midi-notes-container',
  templateUrl: './midi-notes-container.component.html',
  styleUrls: ['./midi-notes-container.component.css']
})

export class MidiNotesContainerComponent {
  
  @Input() vw : number = 100;
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() isRecording: boolean = false;
  @Input() editMode: boolean = false;

  public visibility = 'hidden';
  public leftCSS = '';
  public widthCSS = '';

  public isSelected = false;

  public maxWidth = 0;

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

  // ngOnChanges(changes: SimpleChanges) {
  //   this.computeDimensions();
  //   if (changes['selectedTrack']) {
  //     if (this.track == this.selectedTrack) this.isSelected = true;
  //     else this.isSelected = false;
  //     ////console.log('selected track: ', this.selectedTrack, this.isSelected);
  //   }
  // }
}
