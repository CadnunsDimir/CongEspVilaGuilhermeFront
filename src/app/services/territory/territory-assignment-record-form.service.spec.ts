import { TestBed } from '@angular/core/testing';

import { TerritoryAssignmentRecordFormService } from './territory-assignment-record-form.service';

describe('TerritoryAssignmentRecordFormService', () => {
  let service: TerritoryAssignmentRecordFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerritoryAssignmentRecordFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
