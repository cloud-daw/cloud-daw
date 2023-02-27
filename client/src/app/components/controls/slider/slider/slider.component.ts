import { Component, Renderer2, AfterViewInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { style, animate, AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';

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
export class SliderComponent implements AfterViewInit, OnChanges {
  //@Input() bars: number = 32;
  @Input() bpm: number = 120;
  @Input() controlEvent : number = 2;
  bars: number = 32;
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
    console.log('spos');
    console.log(this.startingPosition);
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
    console.log('should start')
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
    this.currStatus = controlStatus.play;
    this.player = this.buildSliderAnim()
    this.player.play();
    this.player.onDone(() => {
      this._slider.style.transform = `translate(${this.maxVW}vw, 0%)`
      this.player?.destroy();
      this.player = undefined;
    });
  }

  pauseSlider() {
    console.log('should pause')
    this.currStatus = controlStatus.pause;
    this.player?.pause();
    this.player = undefined;
    this.setCurrTransform();
  }

  resetSlider() {
    console.log('should reset');
    this.currStatus = controlStatus.reset;
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
    this._renderer.setProperty(this._slider, 'style', '');
    const clone = this._slider.cloneNode(true);
    this._slider.parentNode.replaceChild(clone, this._slider);
    this._slider = clone;
    this.player = this.buildSliderAnim();
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
    console.log('register stop drag')
    if (this.isDragging) {
      console.log('drag stop')
      const vwPos = (event.clientX / window.innerWidth) * 100;
      this.setTransformOnPosition(vwPos);
    }
    this.isDragging = false;
  }

  @HostListener('window:mousemove', ['$event'])
  handleDrag(event: MouseEvent) {
    console.log('register mouse move');
    if (this.isDragging) {
      console.log('dragging');
      console.log(event);
      const vwPos = (event.clientX / window.innerWidth) * 100;
      this.setTransformOnPosition(vwPos);
    }
  }

  startDrag(event: MouseEvent) {
    console.log('drag start');
    this.isDragging = true;
    this.startDragTransform = this.getCurrTransform()
    console.log(this.startDragTransform)
    console.log(event);
  }

  updateRemainingTime() {
    let currPos = this.getCurrVWPos()
    this.timeOffset = (currPos * (this.totalTime / 100))
    //console.log('updated time:' + this.timeOffset)
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
