import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';

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
  //@Input() position: number = 0;
  //@Input() bars: number = 32;
  @Input() bpm: number = 120;
  @Input() controlEvent : number = 2;
  bars: number = 32;
  totalTime = ((this.bars * 4) / this.bpm) * 60000
  timeOffset = 0;
  _slider: Element | any;
  factory: AnimationFactory | undefined;
  currStatus = this.controlEvent;
  private player: AnimationPlayer | undefined;
  constructor(private _animBuilder: AnimationBuilder, private _renderer: Renderer2) { }
  ngAfterViewInit() {
    this._slider = this._renderer.selectRootElement('#slider');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.handleSlider(this.controlEvent)
  }
  
  buildSliderAnim() {
    let timing = this.getAnimTiming()
    this.factory = this._animBuilder.build(
      [animate(timing, style({ transform: `translate(100vw, 0%)`}))]
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
      this._slider.style.transform = 'translate(100vw, 0%)'
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
}
