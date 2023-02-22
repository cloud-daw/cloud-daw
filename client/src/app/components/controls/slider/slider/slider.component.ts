import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationBuilder } from '@angular/animations';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
  /**
   * animations: [
    trigger('stopStart', [
      state('stop', style({
        transform: 'translate(0)'
      })),
      state('move', style({
        transform: 'translate(100vw, 0%)'
      })),
      transition("stop => move", [animate('1s')]),
      transition("move => stop", [animate('1s')])
    ])]
   */
export class SliderComponent implements AfterViewInit {
  _slider: any;
  constructor(private _animBuilder: AnimationBuilder, private _renderer: Renderer2) { }
  ngAfterViewInit() {
    this._slider = this._renderer.selectRootElement('#slider');
    console.log('slider')
    console.log(this._slider);
  }
  state = 'stop'
  pos: number = 48;
  timing = '4s'
  sliderCss = `absolute h-screen w-2 bg-red-400`;

  buildSliderAnim() {
    const factory = this._animBuilder.build(
      //can customize timing from here with first animate param
      [animate(5000, style({ transform: 'translate(100vw, 0%)'}))]
    )
    const player = factory.create(this._slider);
    player.play()
    player.onDone(() => {
      player.destroy();
    });
  }

  getCurrPos() {
    //say default track length 32 bars
    length = 32;
    
  }

  nextPos() {
    this.state = this.state == 'stop' ? 'move' : 'stop';
  }
}
