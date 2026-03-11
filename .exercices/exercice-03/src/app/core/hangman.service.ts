import { computed, inject, Injectable, signal } from '@angular/core';
import { WordGenerator } from './word-generator';

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  readonly wordGenerator = inject(WordGenerator);

  readonly wordToFound = signal(this.wordGenerator.generateWord());

  readonly remainingLifes = signal(7);
  readonly attempts = signal<string[]>([]);

  readonly mask = computed(() => {
    const word = this.wordToFound();
    const tried = this.attempts();
    return word
      .split('')
      .map(letter => (tried.includes(letter) ? letter : '_'))
      .join(' ');
  });

  testChar(value: string): void {
    const letter = value.toUpperCase();

    // Ignore if already attempted or not a letter
    if (!letter.match(/^[A-Z]$/) || this.attempts().includes(letter)) {
      return;
    }

    // Add to attempts
    this.attempts.update(prev => [...prev, letter]);

    // Decrease life if letter is not in word
    if (!this.wordToFound().includes(letter)) {
      this.remainingLifes.update(lives => lives - 1);
    }
  }

  testWin(): boolean {
    // Won if no '_' remains in mask and at least 1 life left
    return !this.mask().includes('_') && this.remainingLifes() > 0;
  }

  testLose(): boolean {
    return this.remainingLifes() <= 0;
  }

  replayGame(): void {
    this.wordToFound.set(this.wordGenerator.generateWord());
    this.remainingLifes.set(7);
    this.attempts.set([]);
  }
}
