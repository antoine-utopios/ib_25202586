import { Component, inject, HostListener } from '@angular/core';
import { HangmanService } from '../core/hangman.service';

@Component({
  selector: 'app-hangman',
  imports: [],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export class Hangman {
  readonly hangmanService = inject(HangmanService);

  readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
      this.pressCharacter(event.key);
    }
  }

  pressCharacter(value: string): void {
    if (
      this.hangmanService.testWin() ||
      this.hangmanService.testLose()
    ) {
      return;
    }
    this.hangmanService.testChar(value);
  }

  replayGame(): void {
    this.hangmanService.replayGame();
  }

  isAttempted(letter: string): boolean {
    return this.hangmanService.attempts().includes(letter);
  }

  isCorrect(letter: string): boolean {
    return this.hangmanService.wordToFound().includes(letter);
  }
}
