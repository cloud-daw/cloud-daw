
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { Recording } from 'src/app/models/recording/recording';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { FormsModule } from '@angular/forms';
import * as Tone from 'tone';
import { GetSynthByKeyword } from 'src/app/lib/dicts/synthdict';

@Component({
  selector: 'app-midi-track',
  templateUrl: './midi-track.component.html',
  styleUrls: ['./midi-track.component.css']
})

export class MidiTrackComponent implements AfterViewInit, OnChanges {
  //child/parent vars
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Output() trackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  @Input() instruments: string[] = [];
  //FOR DRAG DROP, INSTEAD OF CHANGING TRACKS TO ARRAY, MAKE AN ARRAY FROM THE TRACKS SET AND REORDER THAT WAY
  @Input() synth: any;
  @Input() tracks: Set<MidiTrack> = new Set<MidiTrack>();
  @Input() isRecording: boolean = false;
  @Input()
    set selectedTrack(track: MidiTrack) {
      this.selectedTrackChange.emit(track);
      this._selectedTrack = track;
    }
    get selectedTrack() {
      return this._selectedTrack;
    }
  @Output() selectedTrackChange: EventEmitter<MidiTrack> = new EventEmitter<MidiTrack>();
  private _selectedTrack: MidiTrack = new MidiTrack('', 0, new MidiInstrument(''), false);
  @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();

  @Output() changeInstrument: EventEmitter<any> = new EventEmitter<any>();
  @Output() editEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() changeTrackInstrumentEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() newTrackEmitter:  EventEmitter<string> = new EventEmitter<string>();

  public editing: boolean = false;
  // public isSolo: boolean = false;
  public placeholder: string = this.track.title;
  //functions
  public formatLabel(value: number): string {
    return `${value}db`;
  }

  // volumeLevel: number = this.track.volume + 56;

  ngAfterViewInit() {
    this.placeholder = this.track.title;
  }

  newTrackHandler(inst: string) {
    this.newTrackEmitter.emit(inst);
  }

  changeTrackInstrumentHandler(inst: string) {
    const instrument = GetSynthByKeyword(inst);
    this.track.instrument = instrument;
    this.changeTrackInstrumentEmitter.emit(inst);
  }

  onEdit(bool: boolean) {
    this.editing = bool;
    this.editEmitter.emit(this.editing);
  }

  onVolumeChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    let volume = parseInt(inputElement.value, 10);
    let volN: number = Math.round(Number(volume) * 100.0) / 100.0;
    volN -= 56;
    this.track.ChangeVolume(volN);
    // if(volN <= 56) {
    //   this.isMute = true;
    //   this.track.ChangeVolume(-100);
    // }
    this.track.isMute = false;
    this.track.volumeLevel = this.track.volume + 56;
    console.log('updating volume', volN, this.track.instrument.instrument.volume.value)
  }

  public onMute() {
    this.track.MuteTrack();
  }

  public solo() {
    if (this.selectedTrack == this.track) {
      // this.isSolo = true;
      if (this.selectedTrack.isMute) {
        this.selectedTrack.MuteTrack();
      }
      let tracks = this.tracks;
      let exception = this.selectedTrack;
      let resultSet = new Set([...tracks].filter(element => element !== exception));
      for(let element of resultSet) {
        if(element.isMute != true) {
          element.MuteTrack();
        }
      }
    }
  }
  
  
  public deleteTrack() {
    if (this.tracks.size > 1 && !this.isRecording) {
      this.track.midi = new Recording(this.track.instrument);
      this.onDelete.emit(this.track.id);
      this.tracks.delete(this.track);
      if (this.selectedTrack == this.track) {
        const it = this.tracks.values();
        //get first entry:
        const first = it.next();
        const firstTrack = first.value;
        firstTrack.selected = true;
        this.selectedTrack = firstTrack;
        this.selectedTrackChange.emit(firstTrack);
      }
    }
  }
  
  public updateSelectedTrack(track: MidiTrack) {
    if (!this.isRecording) {
      this.selectedTrack = track; // set the local `selectedTrack` property
      this.selectedTrackChange.emit(track); // emit the `trackSelected` event with this component as the argument
      this.track.selected = true;
    }
  }

  changeTrackTitle(e: Event, title: string) {
    // this.track.title = title;
    // this.trackTitle = title;
    this.track.title = title;
    this.placeholder = title;
    this.trackChange.emit(this.track);
  }

  changeTrackInstrument() {
    this.changeInstrument.emit();
  }

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTrack']) {
      if (this.track != this.selectedTrack) {
        this.track.selected = false;
      } else {
        this.track.selected = true;
      }
    }
    if (changes['track']) {
      this.track.midi.UpdateOverlaps();
    }
  }

}

/**
 * Sample Code for Midi Playback
 * let tape = {
  ppq: 24,
  bpm: 110,
  tracks: [
    {
      noteOn: {},
      noteOff: {},
    }
  ],
};
let step = 0;
function tick() {
  tape.tracks.forEach(function (track, trackNumber) {
    if (typeof track.noteOn[step] !== "undefined") {
      for (let note in track.noteOn[step]) {
        getOutputDevice(trackNumber).playNote(note, track.outputChannel, {
          velocity: track.noteOn[step][note],
        });
      }
    }
    if (typeof track.noteOff[step] !== "undefined") {
      track.noteOff[step].forEach(function (note) {
        getOutputDevice(trackNumber).stopNote(note, track.outputChannel);
      });
    }
  });
  step++;
}
 */
