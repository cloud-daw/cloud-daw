import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-volume',
  templateUrl: './main-volume.component.html',
  styleUrls: ['./main-volume.component.css']
})
export class MainVolumeComponent {
  @Output() volumeChange: EventEmitter<number> = new EventEmitter();
  volumeLevel: number = 51;
  formatLabel(value: number): string {
    let returnVal: number = Math.round((value - 51.0) * 10.0) / 10.0;
    return returnVal > -51 ? `${returnVal}dB` : "idB";
  }

  changeVolume(vol: string) {
    let volN: number = Math.round(Number(vol) * 100.0) / 100.0;
    volN -= 51;
    this.volumeChange.emit(volN);
  }
  
}
