import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreachingScheduleComponent } from './preaching-schedule.component';

describe('PreachingScheduleComponent', () => {
  let component: PreachingScheduleComponent;
  let fixture: ComponentFixture<PreachingScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreachingScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreachingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
