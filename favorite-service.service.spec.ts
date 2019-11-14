import { TestBed } from '@angular/core/testing';

import { FavoriteServiceService } from './favorite-service.service';

describe('FavoriteServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoriteServiceService = TestBed.get(FavoriteServiceService);
    expect(service).toBeTruthy();
  });
});
