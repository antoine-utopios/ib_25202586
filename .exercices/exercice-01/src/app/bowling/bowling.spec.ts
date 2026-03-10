import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BowlingComponent } from './bowling';
import { BowlingService } from './bowling.service';
import { Frame, Roll } from './bowling.service';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers pour construire des objets Frame de test
// ─────────────────────────────────────────────────────────────────────────────
function makeRoll(pins: number, isStrike = false, isSpare = false): Roll {
  return { pins, isStrike, isSpare };
}

function makeFrame(
  rolls: Roll[],
  opts: Partial<Omit<Frame, 'rolls'>> = {}
): Frame {
  return {
    rolls,
    frameScore: opts.frameScore ?? null,
    cumulativeScore: opts.cumulativeScore ?? null,
    isStrike: opts.isStrike ?? false,
    isSpare: opts.isSpare ?? false,
    isComplete: opts.isComplete ?? false,
    isTenthFrame: opts.isTenthFrame ?? false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
describe('BowlingComponent', () => {
  let component: BowlingComponent;
  let bowlingService: BowlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BowlingComponent],
    });

    const fixture = TestBed.createComponent(BowlingComponent);
    component = fixture.componentInstance;
    bowlingService = TestBed.inject(BowlingService);
    bowlingService.reset();
  });

  // ── Instanciation ─────────────────────────────────────────────────────
  describe('Instanciation', () => {
    it('doit être créé', () => {
      expect(component).toBeTruthy();
    });

    it('doit injecter BowlingService', () => {
      expect(component.bowling).toBeDefined();
      expect(component.bowling).toBeInstanceOf(BowlingService);
    });
  });

  // ── rollButtons ──────────────────────────────────────────────────────
  describe('rollButtons (computed)', () => {
    it('doit retourner [0..10] quand toutes les quilles sont debout', () => {
      expect(component.rollButtons()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('doit retourner [0..3] quand 3 quilles sont debout', () => {
      bowlingService.roll(7); // 3 quilles restantes
      expect(component.rollButtons()).toEqual([0, 1, 2, 3]);
    });

    it('doit retourner [0] quand 0 quilles sont debout', () => {
      bowlingService.roll(10); // strike, nouvelles quilles
      // On simule 0 quilles manuellement
      bowlingService.pinsStanding.set(0);
      expect(component.rollButtons()).toEqual([0]);
    });

    it('se met à jour dynamiquement après chaque lancer', () => {
      expect(component.rollButtons().length).toBe(11); // 0..10
      bowlingService.roll(4);
      expect(component.rollButtons().length).toBe(7); // 0..6
    });
  });

  // ── getRollDisplay — frames normales (1-9) ────────────────────────────
  describe('getRollDisplay — frames normales (1–9)', () => {
    it('doit afficher "X" pour un strike', () => {
      const frame = makeFrame([makeRoll(10, true)], { isStrike: true });
      expect(component.getRollDisplay(frame, 0)).toBe('X');
    });

    it('doit afficher le nombre de quilles pour un lancer normal', () => {
      const frame = makeFrame([makeRoll(7)]);
      expect(component.getRollDisplay(frame, 0)).toBe('7');
    });

    it('doit afficher "0" pour le premier lancer à 0 quilles', () => {
      const frame = makeFrame([makeRoll(0)]);
      expect(component.getRollDisplay(frame, 0)).toBe('0');
    });

    it('doit afficher "/" pour un spare au 2ème lancer', () => {
      const frame = makeFrame(
        [makeRoll(6), makeRoll(4, false, true)],
        { isSpare: true }
      );
      expect(component.getRollDisplay(frame, 1)).toBe('/');
    });

    it('doit afficher "-" pour 0 au 2ème lancer (pas spare)', () => {
      const frame = makeFrame([makeRoll(5), makeRoll(0)]);
      expect(component.getRollDisplay(frame, 1)).toBe('-');
    });

    it('doit afficher le nombre pour le 2ème lancer normal', () => {
      const frame = makeFrame([makeRoll(3), makeRoll(5)]);
      expect(component.getRollDisplay(frame, 1)).toBe('5');
    });

    it('doit retourner "" pour un lancer non encore joué', () => {
      const frame = makeFrame([makeRoll(3)]);
      expect(component.getRollDisplay(frame, 1)).toBe('');
    });

    it('doit retourner "" pour un index de lancer hors limites', () => {
      const frame = makeFrame([]);
      expect(component.getRollDisplay(frame, 0)).toBe('');
      expect(component.getRollDisplay(frame, 1)).toBe('');
    });
  });

  // ── getRollDisplay — 10ème frame ──────────────────────────────────────
  describe('getRollDisplay — 10ème frame', () => {
    // Lancer 0
    it('doit afficher "X" pour un strike au 1er lancer', () => {
      const frame = makeFrame(
        [makeRoll(10, true)],
        { isTenthFrame: true, isStrike: true }
      );
      expect(component.getRollDisplay(frame, 0)).toBe('X');
    });

    it('doit afficher le nombre au 1er lancer si non-strike', () => {
      const frame = makeFrame([makeRoll(7)], { isTenthFrame: true });
      expect(component.getRollDisplay(frame, 0)).toBe('7');
    });

    // Lancer 1
    it('doit afficher "X" au 2ème lancer si double-strike', () => {
      const frame = makeFrame(
        [makeRoll(10, true), makeRoll(10, true)],
        { isTenthFrame: true, isStrike: true }
      );
      expect(component.getRollDisplay(frame, 1)).toBe('X');
    });

    it('doit afficher le nombre au 2ème lancer si 1er était strike', () => {
      const frame = makeFrame(
        [makeRoll(10, true), makeRoll(5)],
        { isTenthFrame: true }
      );
      expect(component.getRollDisplay(frame, 1)).toBe('5');
    });

    it('doit afficher "/" au 2ème lancer si spare (sans strike)', () => {
      const frame = makeFrame(
        [makeRoll(7), makeRoll(3)],
        { isTenthFrame: true, isSpare: true }
      );
      expect(component.getRollDisplay(frame, 1)).toBe('/');
    });

    it('doit afficher le nombre au 2ème lancer si normal', () => {
      const frame = makeFrame(
        [makeRoll(5), makeRoll(3)],
        { isTenthFrame: true }
      );
      expect(component.getRollDisplay(frame, 1)).toBe('3');
    });

    // Lancer 2 (bonus)
    it('doit afficher "X" pour le 3ème lancer strike', () => {
      const frame = makeFrame(
        [makeRoll(10, true), makeRoll(10, true), makeRoll(10, true)],
        { isTenthFrame: true, isStrike: true }
      );
      expect(component.getRollDisplay(frame, 2)).toBe('X');
    });

    it('doit afficher "/" pour le 3ème lancer qui complète un spare après double-strike', () => {
      // r2 = 5, r3 = 5 → spare sur r2+r3
      const frame = makeFrame(
        [makeRoll(10, true), makeRoll(5), makeRoll(5)],
        { isTenthFrame: true }
      );
      expect(component.getRollDisplay(frame, 2)).toBe('/');
    });

    it('doit afficher le nombre pour le 3ème lancer normal', () => {
      const frame = makeFrame(
        [makeRoll(10, true), makeRoll(5), makeRoll(3)],
        { isTenthFrame: true }
      );
      expect(component.getRollDisplay(frame, 2)).toBe('3');
    });

    it('doit afficher le nombre pour le 3ème lancer après spare', () => {
      // spare au tour 2 (isSpare=true) → 3ème lancer = bonus direct
      const frame = makeFrame(
        [makeRoll(7), makeRoll(3, false, true), makeRoll(6)],
        { isTenthFrame: true, isSpare: true }
      );
      expect(component.getRollDisplay(frame, 2)).toBe('6');
    });

    it('doit retourner "" pour un lancer non joué en 10ème frame', () => {
      const frame = makeFrame([], { isTenthFrame: true });
      expect(component.getRollDisplay(frame, 0)).toBe('');
    });
  });

  // ── Délégation au service ─────────────────────────────────────────────
  describe('Délégation au BowlingService', () => {
    it('roll() doit appeler bowling.roll() avec le bon nombre de quilles', () => {
      const spy = vi.spyOn(bowlingService, 'roll');
      component.roll(7);
      expect(spy).toHaveBeenCalledWith(7);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('reset() doit appeler bowling.reset()', () => {
      const spy = vi.spyOn(bowlingService, 'reset');
      component.reset();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('rollRandom() doit appeler bowling.rollRandom()', () => {
      const spy = vi.spyOn(bowlingService, 'rollRandom');
      component.rollRandom();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  // ── trackByIndex ───────────────────────────────────────────────────────
  describe('trackByIndex()', () => {
    it('doit retourner l\'index fourni', () => {
      expect(component.trackByIndex(0)).toBe(0);
      expect(component.trackByIndex(5)).toBe(5);
      expect(component.trackByIndex(9)).toBe(9);
    });
  });

  // ── Intégration composant + service ───────────────────────────────────
  describe('Intégration composant ↔ service', () => {
    it('rollButtons doit refléter les quilles restantes après roll()', () => {
      component.roll(3);
      // 7 quilles restantes → boutons 0..7
      expect(component.rollButtons()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it('reset() doit remettre rollButtons à [0..10]', () => {
      component.roll(5);
      component.reset();
      expect(component.rollButtons()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('un strike doit remettre rollButtons à [0..10] (nouvelles quilles)', () => {
      component.roll(10);
      expect(component.rollButtons()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('getRollDisplay doit correspondre aux données réelles du service après un lancer', () => {
      bowlingService.roll(10); // strike frame 1
      const frame = bowlingService.frames()[0];
      expect(component.getRollDisplay(frame, 0)).toBe('X');
    });

    it('getRollDisplay doit afficher "/" pour un vrai spare issu du service', () => {
      bowlingService.roll(6);
      bowlingService.roll(4); // spare
      const frame = bowlingService.frames()[0];
      expect(component.getRollDisplay(frame, 1)).toBe('/');
    });
  });
});
