import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { Note } from 'src/app/models/recording/note';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import { BlockMode } from '../../home/home.component';
import { QuantizeRecording } from 'src/app/services/recording/quantize-service.service';

@Component({
  selector: 'app-midi-editor',
  templateUrl: './midi-editor.component.html',
  styleUrls: ['./midi-editor.component.css'],
})
export class MidiEditorComponent {
  @Input() vw: number = 100;
  @Input() bars: number = 16;
  @Input() signature: number = 4;
  @Input() track: MidiTrack = new MidiTrack(
    'default',
    0,
    new MidiInstrument(''),
    false
  );
  @Input() isRecording: boolean = false;
  @Input() midiContainerRef: Element | any;
  @Input() reRender: number = 0;

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

  @Output() triggerReRender: EventEmitter<number> = new EventEmitter();

  public blockMode: BlockMode = BlockMode.Editor;
  public showEditor: boolean = true;

  onTrackUpdated(track: MidiTrack) {
    this.track = track;
    this.trackUpdated.emit(track);
    // console.log('from editor', this.track.midi.data);
    //console.log('from editor', this.track.midi.data);
  }

  onQuantizeRecording(division: number) {
    QuantizeRecording(this.track.midi, division);
    this.trackUpdated.emit(this.track);
    this.triggerReRender.emit(this.reRender+1);
  }

  onCloseEditor() {
    this.closeEditor.emit(false);
  }

  onReRender(num: number) {
    this.triggerReRender.emit(num);
    console.log('rerendering');
  }
}
