import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { SliderComponent } from '../controls/slider/slider/slider.component';
import { MidiTrackComponent } from '../midi-track/midi-track.component';

@Component({
  selector: 'app-midi-block',
  templateUrl: './midi-block.component.html',
  styleUrls: ['./midi-block.component.css']
})
export class MidiBlockComponent {
  @ViewChild(MidiTrackComponent, { read: ElementRef }) trackComponentRef?: ElementRef;
  @ViewChild('sliderRef') sliderRef?: ElementRef;

  @Input() selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
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
  public blockWidth: string = this.track.midi.data.length + 'px';

  public startPos: any = 0;
  public endPos: any = 0;

  public leftOffset: number = 0;
  public rightOffset: number = 0;

  public sliderWidth: number = 0;

  updateVisual() {
    if (this.isRecording) {
      this.startPos = this.sliderRef?.nativeElement.recordingStartPos.pos;
      this.leftOffset = this.sliderRef?.nativeElement.recordingStartPos.left;
      this.blockWidth = this.sliderRef?.nativeElement.sliderWidth;
      this.isVisible = 'visible';
    }
    if (!this.isRecording) {
      this.endPos = this.sliderRef?.nativeElement.recordingEndPos.pos;
      this.rightOffset = this.sliderRef?.nativeElement.recordingEndPos.left //+ width of slider;
      this.blockWidth = this.sliderRef?.nativeElement.sliderWidth;
      console.log('block left:', this.leftOffset, 'block width:', this.blockWidth);
    }
    this.blockWidth = this.track.midi.data.length + 'em';
    //console.log('Recording stopped... Displaying midi for track', this.track.id, this.track.midi);
  }
  /**
    const rectangle = document.createElement('div');
    rectangle.classList.add('midi-block');
    rectangle.style.left = `${sliderLeft}px`;
    rectangle.style.width = `${sliderWidth}px`;
    parentElement.appendChild(rectangle); */

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isRecording']) {
        this.updateVisual();
    }
  }

}
