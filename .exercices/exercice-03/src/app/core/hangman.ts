import { computed, inject, Injectable, signal } from '@angular/core';
import { WordGenerator } from './word-generator';

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  readonly wordGenerator = inject(WordGenerator);

  readonly wordToFound = signal(this.wordGenerator.generateWord())

  readonly mask = computed(() => {
    // TODO : Créer une variable d'état calculée servant à afficher le masque du jeu en fonction du mot à deviner et des lettres déjà essayées par l'utilisateur

    // Par exemple, si le mot à trouver est 'APPLE' et que l'utilisateur a déjà essayé la lettre 'P', on aura: '_ P P _ _'
  })

  readonly remainingLifes = signal(7);
  readonly attempts = signal<string[]>([]);

  testChar(value: string) {
    // TODO : Créer une méthode servant à tester la présence d'une lettre ou non dans le mot à deviner

    // Cette méthode doit mettre à jour le masque, compléter au besoin le tableau des essais ainsi que modifier le nombre de vies restantes le cas échéant. 
  }

  testWin() {
    // TODO : Créer une méthode servant à tester la victoire ou non de l'utilisateur

    // L'utilisateur a gagné s'il découvre complètement le masque et qu'il lui reste au moins une vie
  }

  replayGame() {
    // TODO : Créer une méthode servant à réinitialiser le jeu
  }
}
