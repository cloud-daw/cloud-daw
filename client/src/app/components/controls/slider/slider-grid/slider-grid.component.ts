import { Component, Input, OnInit, AfterViewInit, Renderer2, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-slider-grid',
  templateUrl: './slider-grid.component.html',
  styleUrls: ['./slider-grid.component.css']
})
export class SliderGridComponent implements OnChanges {
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() vw: number = 0;
  griddex: number[] = [];
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    this.griddex = [];
    const slices = this.bars * this.signature + 1;
    for (let i = 0; i < slices; i++) {
      this.griddex.push(i);
    }
  }
}
