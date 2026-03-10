import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BowlingService, Frame } from './bowling.service';

@Component({
  selector: 'app-bowling',
  imports: [CommonModule],
  templateUrl: './bowling.html',
  styleUrls: ['./bowling.scss'],
})
export class BowlingComponent {
  readonly bowling = inject(BowlingService);

  /** Génère les boutons de lancer disponibles. */
  rollButtons = computed<number[]>(() => {
    const max = this.bowling.pinsStanding();
    return Array.from({ length: max + 1 }, (_, i) => i);
  });

  /** Affichage d'une case de lancer dans le tableau. */
  getRollDisplay(frame: Frame, rollIndex: number): string {
    const roll = frame.rolls[rollIndex];
    if (!roll) return '';

    if (frame.isTenthFrame) {
      // 10ème frame : affichage spécial
      if (rollIndex === 0) return roll.pins === 10 ? 'X' : String(roll.pins);
      if (rollIndex === 1) {
        const prev = frame.rolls[0];
        if (prev.pins === 10 && roll.pins === 10) return 'X';
        if (prev.pins === 10) return String(roll.pins);
        if (prev.pins + roll.pins === 10) return '/';
        return String(roll.pins);
      }
      if (rollIndex === 2) {
        const r1 = frame.rolls[0];
        const r2 = frame.rolls[1];
        if (roll.pins === 10) return 'X';
        if (r1.pins !== 10 && r2.isSpare) return String(roll.pins);
        if (r2.pins + roll.pins === 10) return '/';
        return String(roll.pins);
      }
    }

    // Frames 1–9
    if (rollIndex === 0) {
      return roll.pins === 10 ? 'X' : String(roll.pins);
    }
    if (rollIndex === 1) {
      if (roll.isSpare) return '/';
      return roll.pins === 0 ? '-' : String(roll.pins);
    }
    return '';
  }

  roll(pins: number): void {
    this.bowling.roll(pins);
  }

  reset(): void {
    this.bowling.reset();
  }

  rollRandom(): void {
    this.bowling.rollRandom();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
