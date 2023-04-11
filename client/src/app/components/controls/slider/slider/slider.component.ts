import { Component, Renderer2, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { style, animate, AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';
import { PositionDict } from 'src/app/lib/dicts/posdict';

enum controlStatus {
  play = 0,
  pause = 1,
  reset = 2,
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewChecked, OnChanges {
  @Input() bars: number = 16;
  @Input() bpm: number = 120;
  @Input() controlEvent: number = 2;
  @Input() isRecording: boolean = false;
  //@Input() signature : number = 4;
  signature : number = 4
  @Output() positionChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sPos: EventEmitter<number> = new EventEmitter<number>();
  totalTime = (((this.bars * this.signature) / this.bpm) * 60000);
  timeOffset = 0;
  _slider: Element | any;
  factory: AnimationFactory | undefined;
  currStatus = this.controlEvent;
  isDragging = false;
  startDragTransform: string = "";
  public startingPosition: number = 0;
  maxVW: number = 100;
  posDict: PositionDict | any;
  private player: AnimationPlayer | undefined;
  public recordingStartPos = {
    pos: 0,
    left: 0
  };
  public recordingEndPos = {
    pos: 0,
    left: 0
  };
  public sliderWidth = 0;
  viewChecked: boolean = false;
  constructor(private _animBuilder: AnimationBuilder, private _renderer: Renderer2) { }

  ngAfterViewChecked() {
      if (!this.viewChecked) {
        setTimeout(() => {
          this._slider = this._renderer.selectRootElement('#slider');
          this.startDragTransform = this.getCurrTransform();
          this.startingPosition = this.getCurrVWPos();
          this.maxVW = 100 - this.startingPosition;
          console.log("???inintiation?//?", this.startingPosition);
          this.sPos.emit(this.maxVW);
          this.posDict = new PositionDict(this.maxVW, this.startingPosition, this.bars, this.signature);
          this.setTransformOnPosition(this.startingPosition);
          this.viewChecked = true;
        }, 20);
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleSlider(this.controlEvent)
    console.log("GETTING CURRENT ()+++++++++++ VW", this.maxVW);
    if (changes['isRecording']) {
      if (this.isRecording) {
        this.recordingStartPos.pos = this.getCurrVWPos();
        this.recordingStartPos.left = this._slider.getBoundingClientRect().left
      }
      else {
        this.recordingEndPos.pos = this.getCurrVWPos();
        this.recordingEndPos.left = this._slider.getBoundingClientRect().left + this._slider.getBoundingClientRect().width;
        this.sliderWidth = this._slider.getBoundingClientRect().width;
      }
    }
  }
  
  buildSliderAnim() {
    let timing = this.getAnimTiming()
    this.factory = this._animBuilder.build(
      [animate(timing, style({ transform: `translate(${this.maxVW}vw, 0%)`}))]
    )
    return this.factory.create(this._slider);
  }

  handleSlider(change: number) {
    if (change == controlStatus.play && this.currStatus != change) { //start from beginning
      this.startSlider()
    }
    else if (change == controlStatus.pause && this.currStatus != change) { //stop slider
      this.pauseSlider()
    }
    else if (change == controlStatus.reset && this.currStatus != change) {
      this.resetSlider()
    }
    else {
      //do nothing
    }
  }

  startSlider() {
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
    this.currStatus = controlStatus.play;
    this.player = this.buildSliderAnim()
    this.player.play();
  }

  pauseSlider() {
    this.currStatus = controlStatus.pause;
    this.player?.pause();
    this.setCurrTransform();
  }

  resetSlider() {
    this.currStatus = controlStatus.reset;
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
    this._renderer.setProperty(this._slider, 'style', '');
    const clone = this._slider.cloneNode(true);
    this._slider.parentNode.replaceChild(clone, this._slider);
    this._slider = clone;
    this.setTransformOnPosition(this.startingPosition) //offset by 0.02 to make it look a little cleaner
    this.reinitListener(); //reinstantiate the mouse down listener
  }

  /**
   * Listens to new slider for mousedown event
   */
  private reinitListener() {
    this._renderer.listen(this._slider, 'mousedown', (event) => {
        this.startDrag(event);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resetSlider()
    this.startingPosition = this.getCurrVWPos();
  }

  @HostListener('window:mouseup', ['$event'])
  stopDrag(event: MouseEvent) {
    if (this.isDragging) {
      let pos = 0;
      const vwPos = (event.clientX / window.innerWidth) * 100;
      const diff = vwPos - this.startingPosition;
      if (diff > 0 && diff <= this.maxVW) {
        pos = this.posDict?.GetNearestBarsBeatsOnVWPos(vwPos)
      }
      else if (diff <= 0) {
        pos = this.posDict?.GetNearestBarsBeatsOnVWPos(this.startingPosition)
      }
      else {
        pos = this.posDict?.GetNearestBarsBeatsOnVWPos(this.maxVW + this.startingPosition)
      };
      this.positionChange.emit(pos);
      const snappedPos = this.posDict?.posDictOnBB[pos];
      this.setTransformOnPosition(snappedPos)
    }
    this.isDragging = false;
  }

  @HostListener('window:mousemove', ['$event'])
  handleDrag(event: MouseEvent) {
    if (this.isDragging) {
      const vwPos = (event.clientX / window.innerWidth) * 100;
      const diff = vwPos - this.startingPosition;
      if (diff > 0 && diff < this.maxVW) this.setTransformOnPosition(vwPos);
      else if (diff <= 0) this.setTransformOnPosition(this.startingPosition);
      else this.setTransformOnPosition(this.maxVW);
    }
  }

  startDrag(event: MouseEvent) {
    this.player?.destroy();
    setTimeout(() => {
      this.player = undefined;
    }, 20);
    if (!this.isDragging) {
      this.isDragging = true;
      this.startDragTransform = this.getCurrTransform()
      this.setCurrTransform();
    } 
  }

  updateRemainingTime() {
    const currPos = this.getCurrVWPos()
    const interval = (this.bars * this.signature);
    const distance = currPos - this.startingPosition;
    const distanceRatio = distance / this.maxVW;
    const intervalOffset = distanceRatio * interval;
    this.totalTime = (((this.bars * this.signature) / this.bpm) * 60000);
    this.timeOffset = intervalOffset * (60000 / this.bpm)
  }
  getAnimTiming() {
    this.updateRemainingTime();
    return this.totalTime - this.timeOffset;
  }
  getCurrVWPos() {
    return this._slider.getBoundingClientRect().left / window.innerWidth * 100;
  }
  getCurrTransform() {
    return getComputedStyle(this._slider).transform;
  }
  setCurrTransform() {
    this._slider.style.transform = this.getCurrTransform();
  }
  setTransformOnPosition(vwPosition: number) {
    this._slider.style.transform = `translate(${vwPosition - this.startingPosition}vw, 0%)`
  }
  setTransformOnNearestPosition(vwPosition: number) {

  }
}
