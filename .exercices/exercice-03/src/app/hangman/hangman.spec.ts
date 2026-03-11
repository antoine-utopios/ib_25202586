import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hangman } from './hangman';
import { HangmanService } from '../core/hangman.service';
import { signal, computed } from '@angular/core';

const makeServiceMock = (word = 'APPLE') => ({
  wordToFound: signal(word),
  remainingLifes: signal(7),
  attempts: signal<string[]>([]),
  mask: computed(() => {
    const tried = [] as string[];
    return word.split('').map(l => (tried.includes(l) ? l : '_')).join(' ');
  }),
  testChar: vi.fn(),
  testWin: vi.fn().mockReturnValue(false),
  testLose: vi.fn().mockReturnValue(false),
  replayGame: vi.fn(),
});

describe('Hangman (Component)', () => {
  let component: Hangman;
  let fixture: ComponentFixture<Hangman>;
  let serviceMock: ReturnType<typeof makeServiceMock>;

  beforeEach(async () => {
    serviceMock = makeServiceMock();

    await TestBed.configureTestingModule({
      imports: [Hangman],
      providers: [{ provide: HangmanService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Hangman);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pressCharacter', () => {
    it('should call testChar with the given letter', () => {
      component.pressCharacter('A');
      expect(serviceMock.testChar).toHaveBeenCalledWith('A');
    });

    it('should not call testChar when game is won', () => {
      serviceMock.testWin.mockReturnValue(true);
      component.pressCharacter('A');
      expect(serviceMock.testChar).not.toHaveBeenCalled();
    });

    it('should not call testChar when game is lost', () => {
      serviceMock.testLose.mockReturnValue(true);
      component.pressCharacter('A');
      expect(serviceMock.testChar).not.toHaveBeenCalled();
    });
  });

  describe('replayGame', () => {
    it('should call replayGame on the service', () => {
      component.replayGame();
      expect(serviceMock.replayGame).toHaveBeenCalled();
    });
  });

  describe('isAttempted', () => {
    it('should return true if letter is in attempts', () => {
      serviceMock.attempts.set(['A', 'B']);
      expect(component.isAttempted('A')).toBe(true);
    });

    it('should return false if letter is not in attempts', () => {
      serviceMock.attempts.set(['A']);
      expect(component.isAttempted('Z')).toBe(false);
    });
  });

  describe('isCorrect', () => {
    it('should return true if letter is in word', () => {
      expect(component.isCorrect('A')).toBe(true);
    });

    it('should return false if letter is not in word', () => {
      expect(component.isCorrect('Z')).toBe(false);
    });
  });

  describe('keyboard input', () => {
    it('should call pressCharacter on alphabetic keydown', () => {
      const spy = vi.spyOn(component, 'pressCharacter');
      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);
      expect(spy).toHaveBeenCalledWith('a');
    });

    it('should not call pressCharacter on non-alphabetic keydown', () => {
      const spy = vi.spyOn(component, 'pressCharacter');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
