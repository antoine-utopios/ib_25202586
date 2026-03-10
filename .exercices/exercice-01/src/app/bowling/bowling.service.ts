import { Injectable, signal, computed } from '@angular/core';

export interface Roll {
  pins: number;
  isStrike: boolean;
  isSpare: boolean;
}

export interface Frame {
  rolls: Roll[];
  frameScore: number | null; // null si bonus pas encore connus
  cumulativeScore: number | null;
  isStrike: boolean;
  isSpare: boolean;
  isComplete: boolean;
  isTenthFrame: boolean;
}

export type GameStatus = 'playing' | 'finished';

@Injectable({
  providedIn: 'root',
})
export class BowlingService {
  private readonly TOTAL_FRAMES = 10;

  // ── Signals ──────────────────────────────────────────────────────────────
  frames = signal<Frame[]>(this.initFrames());
  currentFrameIndex = signal<number>(0);
  currentRollIndex = signal<number>(0);
  gameStatus = signal<GameStatus>('playing');
  pinsStanding = signal<number>(10);

  // ── Computed ─────────────────────────────────────────────────────────────
  totalScore = computed(() => {
    const frames = this.frames();
    for (let i = frames.length - 1; i >= 0; i--) {
      if (frames[i].cumulativeScore !== null) return frames[i].cumulativeScore!;
    }
    return 0;
  });

  currentFrame = computed(() => this.frames()[this.currentFrameIndex()]);
  canRoll = computed(() => this.gameStatus() === 'playing');

  // ── Init ─────────────────────────────────────────────────────────────────
  private initFrames(): Frame[] {
    return Array.from({ length: this.TOTAL_FRAMES }, (_, i) => ({
      rolls: [],
      frameScore: null,
      cumulativeScore: null,
      isStrike: false,
      isSpare: false,
      isComplete: false,
      isTenthFrame: i === 9,
    }));
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Lance la boule avec `pins` quilles renversées.
   */
  roll(pins: number): void {
    if (!this.canRoll()) return;

    const max = this.pinsStanding();
    if (pins < 0 || pins > max) {
      throw new Error(`Nombre de quilles invalide : ${pins}. Maximum autorisé : ${max}`);
    }

    const frameIdx = this.currentFrameIndex();
    const rollIdx = this.currentRollIndex();
    const isTenth = frameIdx === 9;

    // Enregistrer le lancer
    this.frames.update((frames) => {
      const updated = frames.map((f) => ({ ...f, rolls: [...f.rolls] }));
      const frame = updated[frameIdx];

      const isStrike = isTenth ? pins === 10 : pins === 10 && rollIdx === 0;
      const isSpare =
        !isTenth &&
        rollIdx === 1 &&
        !frame.rolls[0]?.isStrike &&
        (frame.rolls[0]?.pins ?? 0) + pins === 10;

      frame.rolls.push({ pins, isStrike, isSpare });

      // Marquer la complétion
      if (!isTenth) {
        if (isStrike || frame.rolls.length === 2) {
          frame.isStrike = isStrike;
          frame.isSpare = isSpare;
          frame.isComplete = true;
        }
      } else {
        frame.isComplete = this.isTenthComplete(frame.rolls);
        frame.isStrike = frame.rolls[0]?.pins === 10;
        frame.isSpare =
          !frame.isStrike &&
          frame.rolls.length >= 2 &&
          frame.rolls[0].pins + frame.rolls[1].pins === 10;
      }

      return updated;
    });

    this.recalculateScores();
    this.advanceState(pins, rollIdx, isTenth);
  }

  /** Lancer aléatoire (utile pour la démo). */
  rollRandom(): void {
    const pins = Math.floor(Math.random() * (this.pinsStanding() + 1));
    this.roll(pins);
  }

  /** Remet le jeu à zéro. */
  reset(): void {
    this.frames.set(this.initFrames());
    this.currentFrameIndex.set(0);
    this.currentRollIndex.set(0);
    this.gameStatus.set('playing');
    this.pinsStanding.set(10);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private isTenthComplete(rolls: Roll[]): boolean {
    if (rolls.length < 2) return false;
    const [r1, r2] = rolls;
    const hasBonus = r1.pins === 10 || r1.pins + r2.pins === 10;
    return hasBonus ? rolls.length === 3 : rolls.length === 2;
  }

  private advanceState(pins: number, rollIdx: number, isTenth: boolean): void {
    const frames = this.frames();
    const frameIdx = this.currentFrameIndex();
    const frame = frames[frameIdx];

    if (isTenth) {
      if (frame.isComplete) {
        this.gameStatus.set('finished');
        return;
      }
      // Réinitialiser les quilles après un strike ou un spare au 10ème
      const rolls = frame.rolls;
      if (
        (rolls.length === 1 && rolls[0].pins === 10) ||
        (rolls.length === 2 && (rolls[0].pins === 10 || rolls[0].pins + rolls[1].pins === 10))
      ) {
        this.pinsStanding.set(10);
      }
      this.currentRollIndex.update((r) => r + 1);
      return;
    }

    if (pins === 10 && rollIdx === 0) {
      // Strike → prochaine frame
      this.pinsStanding.set(10);
      this.currentFrameIndex.update((f) => f + 1);
      this.currentRollIndex.set(0);
    } else if (rollIdx === 0) {
      this.pinsStanding.set(10 - pins);
      this.currentRollIndex.set(1);
    } else {
      this.pinsStanding.set(10);
      this.currentFrameIndex.update((f) => f + 1);
      this.currentRollIndex.set(0);
    }

    // Réinitialiser les quilles à l'entrée du 10ème
    if (this.currentFrameIndex() === 9) {
      this.pinsStanding.set(10);
      this.currentRollIndex.set(0);
    }
  }

  private recalculateScores(): void {
    this.frames.update((frames) => {
      const updated = frames.map((f) => ({ ...f }));
      let cumulative = 0;

      for (let i = 0; i < this.TOTAL_FRAMES; i++) {
        const frame = updated[i];
        if (!frame.isComplete) {
          frame.frameScore = null;
          frame.cumulativeScore = null;
          continue;
        }

        if (i === 9) {
          // 10ème frame : somme directe (pas de bonus supplémentaire)
          frame.frameScore = frame.rolls.reduce((s, r) => s + r.pins, 0);
        } else if (frame.isStrike) {
          const next = this.nextRolls(updated, i, 2);
          if (next.length < 2) { frame.frameScore = null; frame.cumulativeScore = null; continue; }
          frame.frameScore = 10 + next[0] + next[1];
        } else if (frame.isSpare) {
          const next = this.nextRolls(updated, i, 1);
          if (next.length < 1) { frame.frameScore = null; frame.cumulativeScore = null; continue; }
          frame.frameScore = 10 + next[0];
        } else {
          frame.frameScore = frame.rolls.reduce((s, r) => s + r.pins, 0);
        }

        cumulative += frame.frameScore!;
        frame.cumulativeScore = cumulative;
      }

      return updated;
    });
  }

  /** Retourne les `count` prochains lancers après la frame `afterIdx`. */
  private nextRolls(frames: Frame[], afterIdx: number, count: number): number[] {
    const result: number[] = [];
    for (let i = afterIdx + 1; i < frames.length && result.length < count; i++) {
      for (const roll of frames[i].rolls) {
        result.push(roll.pins);
        if (result.length === count) break;
      }
    }
    return result;
  }
}
