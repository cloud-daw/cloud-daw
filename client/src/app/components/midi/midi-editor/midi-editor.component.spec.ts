import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiEditorComponent } from './midi-editor.component';

describe('MidiEditorComponent', () => {
  let component: MidiEditorComponent;
  let fixture: ComponentFixture<MidiEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidiEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
