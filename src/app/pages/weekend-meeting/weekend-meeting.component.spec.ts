import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekendMeetingComponent } from './weekend-meeting.component';

describe('WeekendMeetingComponent', () => {
  let component: WeekendMeetingComponent;
  let fixture: ComponentFixture<WeekendMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeekendMeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeekendMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
