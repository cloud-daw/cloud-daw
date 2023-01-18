import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainVolumeComponent } from './main-volume.component';

describe('MainVolumeComponent', () => {
  let component: MainVolumeComponent;
  let fixture: ComponentFixture<MainVolumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainVolumeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
