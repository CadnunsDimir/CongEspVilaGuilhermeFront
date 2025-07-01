import { TestBed } from '@angular/core/testing';

import { MeetingAssignmentsService } from './meeting-assignments.service';

describe('MeetingAssignmentsService', () => {
  let service: MeetingAssignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingAssignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
