import { TestBed } from '@angular/core/testing';

import { CleaningScheduleService } from './cleaning-schedule.service';

describe('CleaningScheduleService', () => {
  let service: CleaningScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CleaningScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
