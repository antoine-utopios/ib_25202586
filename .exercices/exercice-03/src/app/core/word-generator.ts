import { Injectable } from '@angular/core';

export const AVAILABLE_WORDS = [
  'Amazon', 'Google', 'Apple', 'Microsoft', 'Pomme', 'Banane',
  'Chantilly', 'Fraise', 'Epinard', 'Cornichon', 'Televiseur', 'Console', 'Manette'
];

@Injectable({
  providedIn: 'root',
})
export class WordGenerator {
  generateWord(): string {
    const index = Math.floor(Math.random() * AVAILABLE_WORDS.length);
    return AVAILABLE_WORDS[index].toUpperCase();
  }
}
