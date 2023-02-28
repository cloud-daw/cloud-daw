import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { SliderComponent } from '../controls/slider/slider/slider.component';
import { MidiTrackComponent } from '../midi-track/midi-track.component';

@Component({
  selector: 'app-midi-block',
  templateUrl: './midi-block.component.html',
  styleUrls: ['../../../styles.css', './midi-block.component.css']
})
export class MidiBlockComponent {
  @ViewChild(MidiTrackComponent, { read: ElementRef }) trackComponentRef?: ElementRef;
  @ViewChild('sliderRef') sliderRef?: ElementRef;

  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
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
  private _track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);

  @Input() isRecording: boolean = false;

  // @Output() trackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  public isVisible: string = this.track.midi.data.length > 0 ? 'visible' : 'hidden';
  public blockWidth: string = this.track.midi.data.length + 'em';

  public isSelected: boolean = this.track == this.selectedTrack ? true : false;
  // public startPos: any = 0;
  // public endPos: any = 0;
  public leftOffset: number = 0;
  public leftOffsetToString: string = '';
  // public rightOffset: number = 0;
  // public sliderWidth: number = 0;



  startEnd: number[] = this.extractMinMax(); //as [start, end], start = startEnd[0], end = startEnd[1] as measures

  extractMinMax() : number[] {
    const recording = this.track.midi.data;
    if (recording.length > 0) {
      let minAttack = parseInt(recording[0].attack.toString().split(':')[0]);
      let maxRelease = parseInt(recording[recording.length-1].release.toString().split(':')[0]);
      console.log('mm', minAttack, maxRelease);
      maxRelease++;
      return [minAttack, maxRelease];
    }
    return [100, 0];
    // let max = 0;
    // let min = 100; 
    // let currAttack, currRelease;

    // for (let i = 0; i < recording.length; i++) {
    //   currAttack = parseInt(recording[i].attack.toString().split(':')[0]);
    //   currRelease = parseInt(recording[i].release.toString().split(':')[0]);
    //   if (currAttack < min) {
    //     min = currAttack;
    //   }
    //   if (currRelease > max) {
    //     max = currRelease;
    //   }
    // }
    // max++;
    // console.log('min, max', min, max, this.track.midi.data);
    // return [min, max];
  }

  convertMeasureToPosition(m: number) {
    const interval = this.vw / this.bars;
    return ((m - 1) * interval);
  }

  updateVisual() {
    this.isVisible = 'visible';
    const minmax = this.extractMinMax();
    this.leftOffset = this.convertMeasureToPosition(minmax[0]) + 1;
    this.leftOffsetToString = `${this.leftOffset}vw`;
    let endLeft = this.convertMeasureToPosition(minmax[1])/1.4;
    this.blockWidth = `${endLeft - this.leftOffset}vw`; 
    console.log('left offset: ', this.leftOffsetToString, 'endLeft: ', endLeft, 'width:', this.blockWidth);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isRecording']) {
      if (!this.isRecording) {
        console.log('updating visual');
        this.updateVisual();
      }
    }

    if (changes['selectedTrack']) {
      //console.log('???A??AF??FA?FA');
      if (this.track == this.selectedTrack) {
        this.isSelected = true;
        //console.log(this.track.title, '(*********@* it is selected **@*******', this.isSelected);

      } else {
        this.isSelected = false;
        //console.log(this.track.title, '(*********@* it is unselected **@*******', this.isSelected);
      }
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