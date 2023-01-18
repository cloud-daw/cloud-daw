import { Component } from '@angular/core';

@Component({
  selector: 'app-main-volume',
  templateUrl: './main-volume.component.html',
  styleUrls: ['./main-volume.component.css']
})
export class MainVolumeComponent {
  volumeLevel: number = 51;
  formatLabel(value: number): string {
    let returnVal: number = Math.round((value - 51) * 10.0) / 10.0;
    console.log(this.volumeLevel);
    return returnVal > -51 ? `${returnVal}dB` : "idB";
  }
}
