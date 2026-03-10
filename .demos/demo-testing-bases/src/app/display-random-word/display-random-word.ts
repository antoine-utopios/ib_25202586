import { Component, inject, signal } from '@angular/core';
import { WordGenerator } from '../core/word-generator';

@Component({
  selector: 'app-display-random-word',
  imports: [],
  templateUrl: './display-random-word.html',
  styleUrl: './display-random-word.scss',
})
export class DisplayRandomWord {
  readonly wordGeneratorService = inject(WordGenerator);

  readonly firstName = signal(this.wordGeneratorService.generateFirstName());
}
