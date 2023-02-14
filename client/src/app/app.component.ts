import { Component } from '@angular/core';
import { ApiHttpService } from './services/http/httpservice.service';
import { Observable } from 'rxjs';
import { Metronome } from './models/instruments/metronome';
import { MidiInstrument } from './models/instruments/midi-instrument'; //for now, do here -> in future, put in track
import { HostListener } from '@angular/core'; //for now, put in track later (to be trapped w/ focus from here)
import { MidiControllerComponent } from './components/midi-controller/midi-controller.component';
import { Recording } from './models/recording/recording';
import { Note } from './models/recording/note';
import { SchedulePlayback } from './services/recording/playback-service.service';
import * as Tone from 'tone'; 



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CloudDaw';


}
