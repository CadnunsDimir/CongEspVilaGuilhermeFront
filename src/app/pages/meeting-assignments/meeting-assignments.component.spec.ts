import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAssignmentsComponent } from './meeting-assignments.component';

describe('MeetingAssignmentsComponent', () => {
  let component: MeetingAssignmentsComponent;
  let fixture: ComponentFixture<MeetingAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingAssignmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
