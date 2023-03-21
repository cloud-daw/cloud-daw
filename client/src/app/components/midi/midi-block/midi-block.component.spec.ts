import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiBlockComponent } from './midi-block.component';

describe('MidiBlockComponent', () => {
  let component: MidiBlockComponent;
  let fixture: ComponentFixture<MidiBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidiBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
