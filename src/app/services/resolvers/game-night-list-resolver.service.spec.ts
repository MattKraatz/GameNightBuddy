import { TestBed, inject } from '@angular/core/testing';

import { GameNightListResolver } from './game-night-list-resolver.service';

describe('GameNightListResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameNightListResolver]
    });
  });

  it('should ...', inject([GameNightListResolver], (service: GameNightListResolver) => {
    expect(service).toBeTruthy();
  }));
});
