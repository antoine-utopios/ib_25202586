import { Injectable } from '@angular/core';

export const AVAILABLE_WORDS = ['Amazon', 'Google', 'Apple', 'Microsoft', 'Pomme', 'Banane', 'Chantilly', 'Fraise', 'Epinard', 'Cornichon', 'Televiseur', 'Console', 'Manette'];

@Injectable({
  providedIn: 'root',
})
export class WordGenerator {
  generateWord() {
    // TODO : Créer une méthode servant à retourner, parmi la liste des mots disponibles, l'un d'entre eux en majuscule
  }
}
