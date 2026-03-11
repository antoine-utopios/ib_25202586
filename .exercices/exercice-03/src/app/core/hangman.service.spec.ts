import { TestBed } from '@angular/core/testing';
import { HangmanService } from './hangman.service';
import { WordGenerator } from './word-generator';

describe('HangmanService', () => {
  let service: HangmanService;
  let wordGeneratorSpy: { generateWord: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    wordGeneratorSpy = { generateWord: vi.fn().mockReturnValue('APPLE') };

    TestBed.configureTestingModule({
      providers: [
        HangmanService,
        { provide: WordGenerator, useValue: wordGeneratorSpy },
      ],
    });

    service = TestBed.inject(HangmanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- mask ---
  describe('mask', () => {
    it('should display full mask at start', () => {
      expect(service.mask()).toBe('_ _ _ _ _');
    });

    it('should reveal correct letters when guessed', () => {
      service.testChar('P');
      expect(service.mask()).toBe('_ P P _ _');
    });

    it('should reveal all letters when all are guessed', () => {
      ['A', 'P', 'L', 'E'].forEach(l => service.testChar(l));
      expect(service.mask()).toBe('A P P L E');
    });
  });

  // --- testChar ---
  describe('testChar', () => {
    it('should add a correct letter to attempts', () => {
      service.testChar('A');
      expect(service.attempts()).toContain('A');
    });

    it('should add a wrong letter to attempts', () => {
      service.testChar('Z');
      expect(service.attempts()).toContain('Z');
    });

    it('should decrease remainingLifes on wrong guess', () => {
      service.testChar('Z');
      expect(service.remainingLifes()).toBe(6);
    });

    it('should not decrease remainingLifes on correct guess', () => {
      service.testChar('A');
      expect(service.remainingLifes()).toBe(7);
    });

    it('should not add duplicate attempts', () => {
      service.testChar('A');
      service.testChar('A');
      expect(service.attempts().filter(l => l === 'A').length).toBe(1);
    });

    it('should convert lowercase input to uppercase', () => {
      service.testChar('a');
      expect(service.attempts()).toContain('A');
    });

    it('should ignore non-alphabetic characters', () => {
      service.testChar('1');
      service.testChar('!');
      expect(service.attempts().length).toBe(0);
    });
  });

  // --- testWin ---
  describe('testWin', () => {
    it('should return false at start', () => {
      expect(service.testWin()).toBe(false);
    });

    it('should return true when all letters are guessed', () => {
      ['A', 'P', 'L', 'E'].forEach(l => service.testChar(l));
      expect(service.testWin()).toBe(true);
    });

    it('should return false when lives run out even if word is complete', () => {
      // Exhaust all lives
      ['Z', 'X', 'Y', 'Q', 'W', 'B', 'C'].forEach(l => service.testChar(l));
      expect(service.remainingLifes()).toBe(0);
      expect(service.testWin()).toBe(false);
    });
  });

  // --- testLose ---
  describe('testLose', () => {
    it('should return false at start', () => {
      expect(service.testLose()).toBe(false);
    });

    it('should return true when no lives remain', () => {
      ['Z', 'X', 'Y', 'Q', 'W', 'B', 'C'].forEach(l => service.testChar(l));
      expect(service.testLose()).toBe(true);
    });
  });

  // --- replayGame ---
  describe('replayGame', () => {
    it('should reset lives to 7', () => {
      service.testChar('Z');
      service.replayGame();
      expect(service.remainingLifes()).toBe(7);
    });

    it('should reset attempts to empty', () => {
      service.testChar('A');
      service.replayGame();
      expect(service.attempts()).toEqual([]);
    });

    it('should generate a new word', () => {
      wordGeneratorSpy.generateWord.mockReturnValue('BANANE');
      service.replayGame();
      expect(service.wordToFound()).toBe('BANANE');
    });
  });
});
