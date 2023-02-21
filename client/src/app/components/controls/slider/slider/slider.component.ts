import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  animations: [
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
})
export class SliderComponent {
  state = 'stop'
  pos: number = 48;
  timing = '4s'
  sliderCss = `absolute h-screen w-2 bg-red-400`;
  getCurrPos() {
    //say default track length 32 bars
    length = 32;
    
  }

  nextPos() {
    this.state = this.state == 'stop' ? 'move' : 'stop';
  }

  get startStopTrigger() {
    return this.state;
  }
}
