import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessangerServiceComponent } from './messanger-service.component';

describe('MessangerServiceComponent', () => {
  let component: MessangerServiceComponent;
  let fixture: ComponentFixture<MessangerServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessangerServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessangerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
