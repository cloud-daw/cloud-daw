import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiTrackComponent } from './midi-track.component';

describe('MidiTrackComponent', () => {
  let component: MidiTrackComponent;
  let fixture: ComponentFixture<MidiTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidiTrackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
