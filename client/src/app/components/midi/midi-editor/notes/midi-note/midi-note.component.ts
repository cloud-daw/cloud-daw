import { CdkDragEnd, CdkDragRelease } from '@angular/cdk/drag-drop';
import { Component, AfterViewInit, OnChanges, ElementRef, Renderer2, EventEmitter, Input, Output, SimpleChanges, OnInit, ViewChild, HostListener} from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';
import { MidiInstrument } from 'src/app/models/instruments/midi-instrument';
import { Note } from 'src/app/models/recording/note';
import { MidiTrack } from 'src/app/models/tracks/midi-track';
import * as Tone from 'tone';
import { CdkDragPreview } from '@angular/cdk/drag-drop';
import { createYNoteDict, notesArray, NotesDict, yPosNotesDict } from 'src/app/lib/dicts/ynotedict';

@Component({
  selector: 'app-midi-note',
  templateUrl: './midi-note.component.html',
  styleUrls: ['./midi-note.component.css'],
})
export class MidiNoteComponent implements OnChanges {
  constructor() {}

  @ViewChild('midiContainerRef') midiContainerRef2!: ElementRef;

  @Input() track: MidiTrack = new MidiTrack(
    'default',
    0,
    new MidiInstrument(''),
    false
  );
  @Input() data: Note = new Note('', 0);
  @Input() vw: number = 0;
  @Input() bars: number = 16;
  @Input() isRecording: boolean = false;
  @Input() noteColor: string = '';
  @Input() reRender: number = 0;
  @Input() midiContainerRef: Element | any;
  @Input() selectedNote: MidiNoteComponent = this;

  
  @Output() trackUpdated = new EventEmitter<MidiTrack>();
  @Output() triggerReRender = new EventEmitter<number>();
  @Output() selectedNoteChange = new EventEmitter<MidiNoteComponent>();

  public width: number = 0;
  public top: number = 0;
  public widthCSS: string = `0vw`;
  public leftCSS: string = `0vw`;
  public topCSS: string = `0vw`;

  private midiContainer: Element | any;
  public dragPosition: any = {x: 0, y: 0};
  
  public notesDict: NotesDict = yPosNotesDict;
  public isSelected: boolean = this.selectedNote == this;
  private notesArray = notesArray;

  //Start (TEMP GPT SOLUTION)
  //notesDict: { [key: string]: number} = createYNoteDict();

  notePositions: NotesDict = {
    C: 0,
    'C#': 1,
    D: 2,
    'D#': 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    'G#': 8,
    A: 9,
    'A#': 10,
    B: 11
  };


  containerHeight = 6; // in em
  containerTop = 0; // in pixels
  noteHeight = this.containerHeight / 28; // each octave has 4 white keys and 3 black keys (total 7), so 6em/28 = 0.214em

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isSelected) {
      this.keyDownActions(event.code);
    }
    // if (event.code === 'ArrowUp' && this.isSelected) {
    //   this.pitchUp();
    // }
    // if (event.code === 'ArrowDown' && this.isSelected) {
    //   this.pitchDown();
    // }
    // if (event.code === 'ArrowLeft' && this.isSelected) {
    //   this.shiftLeft();
    // }
    // if (event.code === 'ArrowRight' && this.isSelected) {
    //   this.shiftRight();
    // }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    event.preventDefault();
  }

  ngAfterViewInit() {
    //console.log('ALDGKJALDKJGLADKJDGA', this.midiContainerRef);
  }

  populateNotePos() {
    for (let octave = 0; octave <= 7; octave++) {
      for (const note in this.notePositions) {
        const noteName = note + octave.toString();
        const position = (7 - octave) * 4 + this.notePositions[note]; // calculate the position from the top of the container
        const top = (position * this.noteHeight).toFixed(3); // calculate the top value in em with 3 decimal places
        this.notesDict[noteName] = this.containerTop + parseFloat(top); // add the note and its position to the dictionary
      }
    }
  }
  //End (TEMP GPT SOLUTION)



  selectCurrentNote() {
    this.isSelected = true;
    this.selectedNoteChange.emit(this);
    this.track.instrument.instrument.triggerAttackRelease(this.data.value, 0.1);
  }
  /**
   * 
   * @param position 
   * @returns viewport position converted from Tone.Unit.Time
   */
  convertBBSToPosition(position: Tone.Unit.Time) {
    if (!position) return 0;
    let strPosArr: string[] = position.toString().split(':');
    const bar = parseInt(strPosArr[0]);
    const beat = parseInt(strPosArr[1]);
    const sixteenth = parseFloat(strPosArr[2]);
    const bbsInterval = this.vw / (this.bars * 16);
    const normedBar = 16 * (bar - 1);
    const normedBeat = 4 * beat;
    const bbsSum = normedBar + normedBeat + sixteenth;
    //console.log('final BBS return value should be', bbsSum * bbsInterval);

    return bbsSum * bbsInterval; //as VW
  }

  /**
   * 
   * @param position 
   * @returns Tone.Unit.Time convert from viewport position
   */
  convertPositionToBBS(position: number): Tone.Unit.Time {
    const bbsInterval = this.vw / (this.bars * 16);
    const bbsSum = position / bbsInterval;
    const sixteenth = bbsSum % 4;
    const beat = Math.floor((bbsSum / 4) % 4);
    const bar = Math.floor(bbsSum / 16) + 1;
  
    return `${bar}:${beat}:${sixteenth.toFixed(3)}` as Tone.Unit.Time;
  }

  /**
   * 
   * @param event Triggers on mouse up after a note has been dragged
   * Handles logic for modifying note data based on new position
   */ 
  onDragReleased(event: CdkDragRelease) {
    const viewportWidth = window.innerWidth;
    const noteElement = event.source.element.nativeElement;
    const container = this.midiContainerRef;
    const containerWidth = container.offsetWidth;

    //get current position of dragged note
    const rect = noteElement.getBoundingClientRect();
    const rawLeftPos = rect.left - container.offsetLeft;
    const rawRightPos = rawLeftPos + rect.width;

    //calculate leftPosition and rightPositon in terms of vw
    let leftPosition = (rawLeftPos / viewportWidth) * 100;
    const rightPosition = (rawRightPos / viewportWidth) * 100;
    if (leftPosition < 0) leftPosition = 0;
    const attack = this.convertPositionToBBS(leftPosition);
    const release = this.convertPositionToBBS(rightPosition);

    //adjust attack and release based on new position
    const droppedData = event.source.data;
    droppedData.attack = attack;
    droppedData.release = release;
    console.log('DROPPED');
    //console.log('leftPos:', leftPosition, 'rightPos:', rightPosition, 'attack', attack, 'release', release);
  
    this.dragPosition = {x: 0, y: 0};

    //update data and reRender
    this.track.midi.UpdateOverlaps();
    this.trackUpdated.emit(this.track);
    this.triggerReRender.emit(this.reRender + 1);

  }
  
  calculateWidth(start: number, end: number) {
    return end - start;
  }

  keyDownActions(key: string) {
    const currentNoteIndex = this.notesArray.indexOf(this.data.value);
    const noteTimeToArray =  {
      attack: this.data.attack.toString().split(':'), 
      release: this.data.release.toString().split(':')
    };
    const bar = {
      attack: parseInt(noteTimeToArray.attack[0]), 
      release: parseInt(noteTimeToArray.release[0])
    };
    const beat = {
      attack: parseInt(noteTimeToArray.attack[1]), 
      release: parseInt(noteTimeToArray.release[1])
    };
    const sixteenth = {
      attack: parseInt(noteTimeToArray.attack[2]), 
      release: parseInt(noteTimeToArray.release[2])
    };
    switch (key) {
      case 'ArrowUp':
        if (currentNoteIndex < (this.notesArray.length - 1)) {
          const newNote = this.notesArray[currentNoteIndex - 1];
          this.data.value = this.notesArray[currentNoteIndex + 1];
          this.track.midi.UpdateOverlaps();
          this.triggerReRender.emit(this.reRender + 1);
          this.track.instrument.instrument.triggerAttackRelease(newNote, 0.1);
        }
        break;
      case 'ArrowDown':
        if (currentNoteIndex > (0)) {
          const newNote = this.notesArray[currentNoteIndex - 1];
          this.data.value = newNote;
          this.track.midi.UpdateOverlaps();
          this.triggerReRender.emit(this.reRender + 1);
          this.track.instrument.instrument.triggerAttackRelease(newNote, 0.1);
        }
        break;  
      case 'ArrowLeft':
        
        // if (this.data.attack)
        break;
      case 'ArrowRight':
        break;
      default:
        break;
    }
  }

  updateDisplay() {
    const start: number = this.convertBBSToPosition(this.data.attack);
    const end: number = this.convertBBSToPosition(this.data.release);
    const width = this.calculateWidth(start, end);
    // const getNoteValue = Math.abs(100-this.notesDict[this.data.value]);
    // const modifier = 1;
    // const topOffset = getNoteValue * modifier;

    const topOffset = (100 - this.notesDict[this.data.value]);
    //console.log(topOffset);
    //console.log('start:', start, 'end:', end);
    this.setDimensions(width, start, topOffset);
   // console.log('attack;', this.data.attack, 'release:', this.data.release, 'left;', this.leftCSS, 'width:', this.widthCSS, 'top', this.topCSS);
  }

  setDimensions(width: number, left: number, top: number) {
    this.width = width;
    this.top = top;

    this.widthCSS = `${width}vw`;
    this.leftCSS = `${left}vw`;
    this.topCSS = `${Math.abs(top)}%`;
    
    //console.log('left', this.leftCSS, 'top', this.topCSS);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateDisplay();
    if (changes['isRecording']) {
      if (this.selectedNote) {
        if (this.selectedNote != this) this.isSelected = false;
        else this.isSelected = true;
      }
      if (this.data && !this.isRecording) {
        this.updateDisplay();
      }
    }
    // if (changes['data']) {
    //   this.updateDisplay();
    // }
  }
}
