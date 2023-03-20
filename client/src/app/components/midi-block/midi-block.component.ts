import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { SliderComponent } from '../controls/slider/slider/slider.component';
import { MidiTrackComponent } from '../midi-track/midi-track.component';
import * as Tone from 'tone';

@Component({
  selector: 'app-midi-block',
  templateUrl: './midi-block.component.html',
  styleUrls: ['./midi-block.component.css']
})
export class MidiBlockComponent {
  @ViewChild(MidiTrackComponent, { read: ElementRef }) trackComponentRef?: ElementRef;
  @ViewChild('sliderRef') sliderRef?: ElementRef;
  @Input() synth: any;

  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument('', Tone.AMSynth), false);
  @Input() vw : number = 100;
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() 
    set track(value: MidiTrack) {
      this._track = value;
    }
    get track(): MidiTrack {
      return this._track;
    }
  private _track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument('', Tone.AMSynth), false);

  @Input() isRecording: boolean = false;

  public isSelected: boolean = this.track == this.selectedTrack ? true : false;
  // @Output() trackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  public isVisible: string = this.track.midi.data.length > 0 ? 'visible' : 'hidden';

  public blockWidth: string = this.track.midi.data.length + 'em';
  // public startPos: any = 0;
  // public endPos: any = 0;
  public leftOffset: number = 0;
  public leftOffsetToString: string = '';
  // public rightOffset: number = 0;
  // public sliderWidth: number = 0;

  startEnd: number[] = this.extractMinMax(); //as [start, end], start = startEnd[0], end = startEnd[1] as measures

  extractMinMax() : number[] {
    const recording = this.track.midi.data;
    let max = 0;
    let min = 1000;
    if (recording.length > 0) {
      min = parseInt(recording[0].attack.toString().split(':')[0]);
      max = parseInt(recording[recording.length-1].release.toString().split(':')[0]);
    }
    max++;
    console.log('min, max', min, max, this.track.midi.data);
    return [min, max];
  }

  convertMeasureToPosition(m: number) {
    console.log(this.vw);
    const interval = this.vw / this.bars;
    console.log('converting m to p', interval)
    return ((m - 1) * interval);
  }

  updateVisual() {
    this.isVisible = 'visible';
    const minmax = this.extractMinMax();
    this.leftOffset = this.convertMeasureToPosition(minmax[0]);
    this.leftOffsetToString = `${this.leftOffset}vw`;
    let endLeft = this.convertMeasureToPosition(minmax[1]);
    this.blockWidth = `${endLeft - this.leftOffset}vw`;
    console.log('left offset: ', this.leftOffsetToString, 'endLeft: ', endLeft, 'width:', this.blockWidth);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isRecording']) {
      if (!this.isRecording) {
        this.updateVisual();
        console.log('updating visual');
      }
    }
    if (changes['selectedTrack']) {
      if (this.track == this.selectedTrack) this.isSelected = true;
      else this.isSelected = false;
      //console.log('selected track: ', this.selectedTrack, this.isSelected);
    }
  }

}


    // if (this.isRecording) {
    //   this.startPos = this.sliderRef?.nativeElement.recordingStartPos.pos;
    //   this.leftOffset = this.sliderRef?.nativeElement.recordingStartPos.left;
    //   this.blockWidth = this.sliderRef?.nativeElement.sliderWidth;
    //   this.isVisible = 'visible';
    // }
    // if (!this.isRecording) {
    //   this.endPos = this.sliderRef?.nativeElement.recordingEndPos.pos;
    //   this.rightOffset = this.sliderRef?.nativeElement.recordingEndPos.left //+ width of slider;
    //   this.blockWidth = this.sliderRef?.nativeElement.sliderWidth;
    //   console.log('block left:', this.leftOffset, 'block width:', this.blockWidth);
    // }
    // this.blockWidth = this.track.midi.data.length + 'em';
    // if (this.isRecording) {
    //   this.startPos = 
    // }
    // if (!this.isRecording) {

    // }