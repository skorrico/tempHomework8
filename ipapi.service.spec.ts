import { TestBed } from '@angular/core/testing';

import { IpapiService } from './ipapi.service';

describe('IpapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IpapiService = TestBed.get(IpapiService);
    expect(service).toBeTruthy();
  });
});
