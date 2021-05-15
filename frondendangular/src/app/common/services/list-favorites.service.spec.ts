import { TestBed } from '@angular/core/testing';

import { ListFavoritesService } from './list-favorites.service';

describe('ListFavoritesService', () => {
  let service: ListFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListFavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
