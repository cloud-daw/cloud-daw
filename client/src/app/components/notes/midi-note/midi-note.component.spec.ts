import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiNoteComponent } from './midi-note.component';

describe('MidiNoteComponent', () => {
  let component: MidiNoteComponent;
  let fixture: ComponentFixture<MidiNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidiNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
