import { TestBed, inject } from '@angular/core/testing';

import { GameNightService } from './game-night.service';

describe('GameNightService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameNightService]
    });
  });

  it('should ...', inject([GameNightService], (service: GameNightService) => {
    expect(service).toBeTruthy();
  }));
});
