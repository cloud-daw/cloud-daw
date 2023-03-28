import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiNotesContainerComponent } from './midi-notes-container.component';

describe('MidiNotesContainerComponent', () => {
  let component: MidiNotesContainerComponent;
  let fixture: ComponentFixture<MidiNotesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidiNotesContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiNotesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
