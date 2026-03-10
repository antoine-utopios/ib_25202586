import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BowlingService } from './bowling.service';

// ─────────────────────────────────────────────────────────────────────────────
// Helper : effectue une séquence de lancers en une seule instruction
// ─────────────────────────────────────────────────────────────────────────────
function rollMany(service: BowlingService, ...pins: number[]): void {
  pins.forEach((p) => service.roll(p));
}

// Joue une partie complète avec uniquement des quilles "normales" (pas strike/spare)
function rollAll(service: BowlingService, pins: number): void {
  // 10 frames × 2 lancers, chacun renversant `pins` quilles
  for (let i = 0; i < 10; i++) {
    service.roll(pins);
    service.roll(0);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
describe('BowlingService', () => {
  let service: BowlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BowlingService);
  });

  // ── État initial ────────────────────────────────────────────────────────
  describe('État initial', () => {
    it('doit initialiser 10 frames vides', () => {
      expect(service.frames().length).toBe(10);
    });

    it('doit démarrer à la frame 0, lancer 0', () => {
      expect(service.currentFrameIndex()).toBe(0);
      expect(service.currentRollIndex()).toBe(0);
    });

    it('doit avoir 10 quilles debout au départ', () => {
      expect(service.pinsStanding()).toBe(10);
    });

    it('doit avoir le statut "playing" au départ', () => {
      expect(service.gameStatus()).toBe('playing');
    });

    it('doit avoir un score total de 0 au départ', () => {
      expect(service.totalScore()).toBe(0);
    });

    it('doit pouvoir lancer (canRoll = true) au départ', () => {
      expect(service.canRoll()).toBe(true);
    });

    it('doit marquer la dernière frame comme isTenthFrame', () => {
      const frames = service.frames();
      frames.forEach((f, i) => {
        expect(f.isTenthFrame).toBe(i === 9);
      });
    });
  });

  // ── Validation des lancers ──────────────────────────────────────────────
  describe('Validation des lancers', () => {
    it('doit lancer une erreur si pins < 0', () => {
      expect(() => service.roll(-1)).toThrow();
    });

    it('doit lancer une erreur si pins > pinsStanding (10)', () => {
      expect(() => service.roll(11)).toThrow();
    });

    it('doit lancer une erreur si pins > quilles restantes après premier lancer', () => {
      service.roll(3); // 7 quilles restantes
      expect(() => service.roll(8)).toThrow();
    });

    it('ne doit pas lancer si gameStatus est "finished"', () => {
      // Partie terminée via partie parfaite
      for (let i = 0; i < 12; i++) service.roll(10);
      const scoreAfterEnd = service.totalScore();
      service.roll(5); // doit être ignoré
      expect(service.totalScore()).toBe(scoreAfterEnd);
    });

    it('doit accepter 0 quille', () => {
      expect(() => service.roll(0)).not.toThrow();
    });
  });

  // ── Avancement des frames ───────────────────────────────────────────────
  describe('Avancement des frames', () => {
    it('doit rester à la frame 0 après le premier lancer (non-strike)', () => {
      service.roll(5);
      expect(service.currentFrameIndex()).toBe(0);
      expect(service.currentRollIndex()).toBe(1);
    });

    it('doit passer à la frame 1 après un spare', () => {
      service.roll(6);
      service.roll(4);
      expect(service.currentFrameIndex()).toBe(1);
    });

    it('doit passer à la frame 1 immédiatement après un strike', () => {
      service.roll(10);
      expect(service.currentFrameIndex()).toBe(1);
      expect(service.currentRollIndex()).toBe(0);
    });

    it('doit réinitialiser les quilles à 10 après un strike', () => {
      service.roll(10);
      expect(service.pinsStanding()).toBe(10);
    });

    it('doit réduire les quilles disponibles après un premier lancer normal', () => {
      service.roll(7);
      expect(service.pinsStanding()).toBe(3);
    });

    it('doit réinitialiser les quilles à 10 après avoir complété une frame normale', () => {
      service.roll(4);
      service.roll(3);
      expect(service.pinsStanding()).toBe(10);
    });

    it('doit atteindre la frame 9 après 9 strikes consécutifs', () => {
      for (let i = 0; i < 9; i++) service.roll(10);
      expect(service.currentFrameIndex()).toBe(9);
    });
  });

  // ── Calcul des scores ───────────────────────────────────────────────────
  describe('Calcul des scores', () => {
    it('doit calculer un score normal (sans bonus)', () => {
      rollMany(service, 3, 4); // frame 1 = 7
      rollMany(service, 2, 5); // frame 2 = 7
      const frames = service.frames();
      expect(frames[0].frameScore).toBe(7);
      expect(frames[1].frameScore).toBe(7);
      expect(frames[1].cumulativeScore).toBe(14);
    });

    it('doit calculer un spare : 10 + prochain lancer', () => {
      rollMany(service, 6, 4); // spare en frame 1
      rollMany(service, 5, 2); // frame 2
      const frames = service.frames();
      expect(frames[0].isSpare).toBe(true);
      expect(frames[0].frameScore).toBe(15); // 10 + 5
      expect(frames[0].cumulativeScore).toBe(15);
      expect(frames[1].cumulativeScore).toBe(22); // 15 + 7
    });

    it('doit avoir frameScore null pour un spare tant que le bonus est inconnu', () => {
      rollMany(service, 6, 4); // spare, mais pas encore de prochain lancer
      expect(service.frames()[0].frameScore).toBeNull();
    });

    it('doit calculer un strike : 10 + 2 prochains lancers', () => {
      rollMany(service, 10);        // strike frame 1
      rollMany(service, 3, 6);      // frame 2
      const frames = service.frames();
      expect(frames[0].isStrike).toBe(true);
      expect(frames[0].frameScore).toBe(19); // 10 + 3 + 6
    });

    it('doit avoir frameScore null pour un strike tant que les bonus sont inconnus', () => {
      service.roll(10);
      expect(service.frames()[0].frameScore).toBeNull();
    });

    it('doit calculer deux strikes consécutifs correctement', () => {
      rollMany(service, 10, 10, 5, 3);
      const frames = service.frames();
      // Frame 1 : 10 + 10 + 5 = 25
      expect(frames[0].frameScore).toBe(25);
      // Frame 2 : 10 + 5 + 3 = 18
      expect(frames[1].frameScore).toBe(18);
    });

    it('doit calculer un spare suivi d\'un strike', () => {
      rollMany(service, 7, 3); // spare
      rollMany(service, 10);   // strike bonus
      rollMany(service, 4, 2);
      const frames = service.frames();
      expect(frames[0].frameScore).toBe(20); // spare + 10
    });
  });

  // ── Partie parfaite ─────────────────────────────────────────────────────
  describe('Partie parfaite (12 strikes)', () => {
    it('doit donner un score de 300', () => {
      for (let i = 0; i < 12; i++) service.roll(10);
      expect(service.totalScore()).toBe(300);
    });

    it('doit terminer la partie après 12 strikes', () => {
      for (let i = 0; i < 12; i++) service.roll(10);
      expect(service.gameStatus()).toBe('finished');
    });

    it('doit avoir toutes les frames avec frameScore = 30', () => {
      for (let i = 0; i < 12; i++) service.roll(10);
      const frames = service.frames();
      for (let i = 0; i < 9; i++) {
        expect(frames[i].frameScore).toBe(30);
      }
    });
  });

  // ── 10ème frame ─────────────────────────────────────────────────────────
  describe('10ème frame', () => {
    function goToTenth(svc: BowlingService): void {
      for (let i = 0; i < 9; i++) {
        svc.roll(0);
        svc.roll(0);
      }
    }

    it('doit autoriser 3 lancers si strike au premier lancer', () => {
      goToTenth(service);
      service.roll(10); // strike
      service.roll(5);
      service.roll(3);
      expect(service.gameStatus()).toBe('finished');
      expect(service.frames()[9].rolls.length).toBe(3);
    });

    it('doit autoriser 3 lancers si spare', () => {
      goToTenth(service);
      service.roll(7);
      service.roll(3); // spare
      service.roll(5);
      expect(service.gameStatus()).toBe('finished');
      expect(service.frames()[9].rolls.length).toBe(3);
    });

    it('doit se terminer après 2 lancers si pas de strike ni spare', () => {
      goToTenth(service);
      service.roll(4);
      service.roll(3);
      expect(service.gameStatus()).toBe('finished');
      expect(service.frames()[9].rolls.length).toBe(2);
    });

    it('doit réinitialiser les quilles à 10 après le strike du 10ème', () => {
      goToTenth(service);
      service.roll(10);
      expect(service.pinsStanding()).toBe(10);
    });

    it('doit réinitialiser les quilles à 10 après un spare au 10ème', () => {
      goToTenth(service);
      service.roll(6);
      service.roll(4);
      expect(service.pinsStanding()).toBe(10);
    });

    it('doit calculer correctement : strike + strike + 5 = 25', () => {
      goToTenth(service);
      service.roll(10);
      service.roll(10);
      service.roll(5);
      expect(service.frames()[9].frameScore).toBe(25);
    });

    it('doit calculer correctement : spare + 7 = 17', () => {
      goToTenth(service);
      service.roll(3);
      service.roll(7);
      service.roll(7);
      expect(service.frames()[9].frameScore).toBe(17);
    });

    it('doit calculer correctement 3 strikes = 30', () => {
      goToTenth(service);
      service.roll(10);
      service.roll(10);
      service.roll(10);
      expect(service.frames()[9].frameScore).toBe(30);
    });

    it('ne doit pas compter de bonus strike sur le 10ème (score direct)', () => {
      // Partie entière : 9 strikes + 10ème frame à 5/3
      for (let i = 0; i < 9; i++) service.roll(10);
      service.roll(5);
      service.roll(3);
      // Frame 9 (index 8) : strike bonus = frames[9] rolls[0] + [1]
      expect(service.frames()[8].frameScore).toBe(10 + 5 + 3); // 18
      // Frame 10 : 5 + 3 = 8
      expect(service.frames()[9].frameScore).toBe(8);
    });
  });

  // ── Scores cumulatifs ───────────────────────────────────────────────────
  describe('Scores cumulatifs', () => {
    it('doit calculer le score cumulatif progressivement', () => {
      rollMany(service, 3, 4, 2, 5);
      const frames = service.frames();
      expect(frames[0].cumulativeScore).toBe(7);
      expect(frames[1].cumulativeScore).toBe(14);
    });

    it('doit retourner le dernier score cumulatif via totalScore()', () => {
      rollAll(service, 5); // 10 × (5+0) = 50
      expect(service.totalScore()).toBe(50);
    });

    it('doit retourner 0 si aucune frame complète', () => {
      service.roll(3);
      expect(service.totalScore()).toBe(0);
    });
  });

  // ── Reset ───────────────────────────────────────────────────────────────
  describe('reset()', () => {
    it('doit remettre toutes les frames à zéro', () => {
      rollMany(service, 5, 3, 10, 2, 7);
      service.reset();
      service.frames().forEach((f) => {
        expect(f.rolls.length).toBe(0);
        expect(f.isComplete).toBe(false);
        expect(f.frameScore).toBeNull();
      });
    });

    it('doit remettre les compteurs à zéro', () => {
      rollMany(service, 10, 10);
      service.reset();
      expect(service.currentFrameIndex()).toBe(0);
      expect(service.currentRollIndex()).toBe(0);
    });

    it('doit remettre le statut à "playing"', () => {
      for (let i = 0; i < 12; i++) service.roll(10);
      service.reset();
      expect(service.gameStatus()).toBe('playing');
    });

    it('doit remettre les quilles à 10', () => {
      service.roll(7);
      service.reset();
      expect(service.pinsStanding()).toBe(10);
    });

    it('doit remettre le score à 0', () => {
      rollMany(service, 5, 5, 3, 4);
      service.reset();
      expect(service.totalScore()).toBe(0);
    });
  });

  // ── rollRandom() ─────────────────────────────────────────────────────────
  describe('rollRandom()', () => {
    it('doit effectuer un lancer sans erreur', () => {
      expect(() => service.rollRandom()).not.toThrow();
    });

    it('doit respecter les quilles disponibles', () => {
      service.roll(7); // 3 quilles restantes
      vi.spyOn(Math, 'random').mockReturnValue(0.99); // → floor(0.99 * 4) = 3
      expect(() => service.rollRandom()).not.toThrow();
      vi.restoreAllMocks();
    });

    it('ne doit pas dépasser les quilles debout', () => {
      service.roll(7); // 3 restantes
      for (let i = 0; i < 20; i++) {
        // Peu importe le résultat, le lancer doit être valide
        service.reset();
        service.roll(7);
        expect(() => service.rollRandom()).not.toThrow();
      }
    });
  });

  // ── Cas limites ─────────────────────────────────────────────────────────
  describe('Cas limites', () => {
    it('doit gérer une partie entière sans aucune quille renversée (score = 0)', () => {
      for (let i = 0; i < 20; i++) service.roll(0);
      expect(service.totalScore()).toBe(0);
      expect(service.gameStatus()).toBe('finished');
    });

    it('doit gérer tous les spares (5/5) + bonus de 5 = 150', () => {
      // 10 spares de 5+5 + bonus de 5 sur la 10ème
      for (let i = 0; i < 10; i++) {
        service.roll(5);
        service.roll(5);
      }
      service.roll(5); // bonus 10ème
      expect(service.totalScore()).toBe(150);
    });

    it('doit bien identifier les strikes dans les frames', () => {
      service.roll(10);
      expect(service.frames()[0].isStrike).toBe(true);
      expect(service.frames()[0].isSpare).toBe(false);
    });

    it('doit bien identifier les spares dans les frames', () => {
      service.roll(7);
      service.roll(3);
      expect(service.frames()[0].isSpare).toBe(true);
      expect(service.frames()[0].isStrike).toBe(false);
    });

    it('un 10 au 2ème lancer NE doit PAS être un strike', () => {
      service.roll(0);
      service.roll(10); // spare, pas strike
      expect(service.frames()[0].isStrike).toBe(false);
      expect(service.frames()[0].isSpare).toBe(true);
    });
  });
});
