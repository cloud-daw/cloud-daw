import { Component, Renderer2, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { style, animate, AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';

enum controlStatus {
  play = 0,
  pause = 1,
  reset = 2,
}

//! N.B. : small bug with behavior : drag slider -> hit rewind without having played/pause first, doesn't rewind
//! But it does if they've been hit at any point so not crucial yet

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewInit, OnChanges {
  @Input() bars: number = 16;
  @Input() bpm: number = 120;
  @Input() controlEvent: number = 2;
  @Output() positionChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sPos: EventEmitter<number> = new EventEmitter<number>();
  totalTime = ((this.bars * 4) / this.bpm) * 60000
  timeOffset = 0;
  _slider: Element | any;
  factory: AnimationFactory | undefined;
  currStatus = this.controlEvent;
  isDragging = false;
  startDragTransform: string = "";
  startingPosition: number = 0;
  maxVW: number = 100;
  private player: AnimationPlayer | undefined;
  constructor(private _animBuilder: AnimationBuilder, private _renderer: Renderer2) { }
  ngAfterViewInit() {
    this._slider = this._renderer.selectRootElement('#slider');
    this.startDragTransform = this.getCurrTransform();
    this.startingPosition = this.getCurrVWPos();
    this.maxVW = 100 - this.startingPosition;
    this.sPos.emit(this.maxVW);
    this.player = this.buildSliderAnim();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleSlider(this.controlEvent)
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
    this.setTransformOnPosition(this.startingPosition)
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
    console.log('resize');
    this.resetSlider()
    this.startingPosition = this.getCurrVWPos();
    console.log(this.startingPosition);
  }

  @HostListener('window:mouseup', ['$event'])
  stopDrag(event: MouseEvent) {
    if (this.isDragging) {
      console.log('drag stop')
      const vwPos = (event.clientX / window.innerWidth) * 100;
      const diff = vwPos - this.startingPosition;
      if (diff > 0 && diff <= this.maxVW) {
        this.setTransformOnPosition(vwPos);
        this.positionChange.emit(vwPos - this.startingPosition);
      }
      else if (diff <= 0) {
        this.setTransformOnPosition(this.startingPosition);
        this.positionChange.emit(0);
      }
      else {
        this.setTransformOnPosition(this.maxVW);
        this.positionChange.emit(this.maxVW);
      };
      this.setCurrTransform()
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
    console.log('drag start');
    this.player?.destroy();
    setTimeout(() => {
      this.player = undefined;
    }, 20);
    if (!this.isDragging) {
      this.isDragging = true;
      this.startDragTransform = this.getCurrTransform()
      this.setCurrTransform();
      console.log(this.startDragTransform)
      console.log(event);
    } 
  }

  updateRemainingTime() {
    let currPos = this.getCurrVWPos()
    this.timeOffset = (currPos * (this.totalTime / 100))
    console.log('updated time:' + this.timeOffset)
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
}
