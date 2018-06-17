import { TestBed, inject } from '@angular/core/testing';

import { StarwarsCharacterService } from './starwars-character.service';

describe('StarwarsCharacterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarwarsCharacterService]
    });
  });

  it('should be created', inject([StarwarsCharacterService], (service: StarwarsCharacterService) => {
    expect(service).toBeTruthy();
  }));
});
