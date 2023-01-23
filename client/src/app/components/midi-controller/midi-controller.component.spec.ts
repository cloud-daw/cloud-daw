import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiControllerComponent } from './midi-controller.component';

describe('MidiControllerComponent', () => {
  let component: MidiControllerComponent;
  let fixture: ComponentFixture<MidiControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidiControllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
