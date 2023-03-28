import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { Note } from 'src/app/models/recording/note';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { BlockMode } from '../../home/home.component';

@Component({
  selector: 'app-midi-editor',
  templateUrl: './midi-editor.component.html',
  styleUrls: ['./midi-editor.component.css']
})
export class MidiEditorComponent {

  @Input() vw : number = 100;
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() track: MidiTrack = new MidiTrack('default', 0, new MidiInstrument(''), false);
  @Input() isRecording: boolean = false;
  @Input() midiContainerRef: Element | any;

  @Output() trackUpdated = new EventEmitter<MidiTrack>();

  @Input() 
    set midi(data: Note[]) {
      this._midi = data;
    }
    get midi() {
      return this._midi;
    }
    private _midi: Note[] = [];
    @Output() midiChange: EventEmitter<Note[]> = new EventEmitter<Note[]>();

    @Output() closeEditor: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  public blockMode: BlockMode = BlockMode.Editor;
  public showEditor: boolean = true;

  onTrackUpdated(track: MidiTrack) {
    this.track = track;
    this.trackUpdated.emit(track);
    // console.log('from editor', this.track.midi.data);
    //console.log('from editor', this.track.midi.data);
  }

  onCloseEditor() {
    this.closeEditor.emit(false);
  }
}