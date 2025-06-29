import { TestBed } from '@angular/core/testing';

import { TerritoryAssignmentService } from './territory-assignment.service';

describe('TerritoryAssignmentService', () => {
  let service: TerritoryAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerritoryAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
