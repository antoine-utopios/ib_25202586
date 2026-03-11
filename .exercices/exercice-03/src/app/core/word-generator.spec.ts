import { TestBed } from '@angular/core/testing';
import { WordGenerator, AVAILABLE_WORDS } from './word-generator';

describe('WordGenerator', () => {
  let service: WordGenerator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordGenerator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a word from the available words list', () => {
    const word = service.generateWord();
    const upperCaseWords = AVAILABLE_WORDS.map(w => w.toUpperCase());
    expect(upperCaseWords).toContain(word);
  });

  it('should return the word in uppercase', () => {
    const word = service.generateWord();
    expect(word).toBe(word.toUpperCase());
  });

  it('should return a non-empty string', () => {
    const word = service.generateWord();
    expect(word.length).toBeGreaterThan(0);
  });

  it('should generate different words over multiple calls (randomness check)', () => {
    const words = new Set(Array.from({ length: 20 }, () => service.generateWord()));
    expect(words.size).toBeGreaterThan(1);
  });
});
