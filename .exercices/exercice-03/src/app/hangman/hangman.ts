import { Component, inject } from '@angular/core';
import { HangmanService } from '../core/hangman';

@Component({
  selector: 'app-hangman',
  imports: [],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export class Hangman {
  readonly hangmanService = inject(HangmanService);

  pressCharacter(value: string) {
    // TODO: Créer une méthode servant à l'utilisateur pour entrer un nouveau caractère alphabéthique et le tester
  }

  replayGame() {
    // TODO : Créer une méthode servant à l'utilisateur pour lancer une nouvelle partie
  }
}