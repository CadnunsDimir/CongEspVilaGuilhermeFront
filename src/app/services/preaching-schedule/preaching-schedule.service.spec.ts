import { TestBed } from '@angular/core/testing';

import { PreachingScheduleService } from './preaching-schedule.service';

describe('PreachingScheduleService', () => {
  let service: PreachingScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreachingScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
