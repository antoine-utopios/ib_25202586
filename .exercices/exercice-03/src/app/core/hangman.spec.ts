import { TestBed } from '@angular/core/testing';

import { Hangman } from './hangman';

describe('Hangman', () => {
  let service: Hangman;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hangman);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
