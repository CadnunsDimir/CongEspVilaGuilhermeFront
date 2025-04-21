import { TestBed } from '@angular/core/testing';

import { FullMapService } from './full-map.service';

describe('FullMapService', () => {
  let service: FullMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
