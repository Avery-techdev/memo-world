// Central domain types for the Memo·World memory game.
// Defined once here and reused across composables, services and components.

/** Semantic level identifier (no magic numbers). */
export type Level = "easy" | "medium" | "hard";

/** Stable identifier of a landmark illustration. */
export type LandmarkId =
  | "eiffel-tower"
  | "empire-state-building"
  | "brandenburg-gate"
  | "berlin-tv-tower"
  | "colosseum"
  | "big-ben"
  | "burj-khalifa"
  | "sagrada-familia"
  | "sydney-opera-house"
  | "taj-mahal";

/** A single landmark motif rendered as a white line-art SVG. */
export interface Landmark {
  readonly id: LandmarkId;
  /** Photo title shown on the polaroid frame. */
  readonly name: string;
  /** City subtitle. */
  readonly city: string;
}

/**
 * A single card on the board. Two cards share the same `landmarkId` to form a pair.
 * `isFlipped` / `isMatched` are the single source of truth for card visibility;
 * derived values (flipped pair, matched count, ...) are computed, never stored.
 */
export interface Card {
  /** Unique, stable per-card identifier. */
  readonly id: number;
  readonly landmarkId: LandmarkId;
  isFlipped: boolean;
  isMatched: boolean;
}

/** Lifecycle of a single game round. */
export type GameStatus = "idle" | "playing" | "paused" | "won" | "lost";

/**
 * Persisted, minimal game state (single source of truth).
 * Everything derivable (points, matched pairs, remaining time, game over)
 * is computed in the composable and must not be added here.
 */
export interface GameState {
  level: Level;
  cards: Card[];
  attempts: number;
  timeElapsedSeconds: number;
  status: GameStatus;
}

/** Immutable configuration for one level. */
export interface LevelConfig {
  readonly level: Level;
  /** Human-facing label. */
  readonly label: string;
  /** Number of pairs on the board. */
  readonly pairs: number;
  /** Time limit in seconds; the round is lost when elapsed reaches it. */
  readonly timeLimitSeconds: number;
  /** Points per matched pair when attempts are strictly below this. */
  readonly threePointsBelowAttempts: number;
  /** Points per matched pair when attempts are at or below this (else 1 point). */
  readonly twoPointsMaxAttempts: number;
}

/** Best result achieved for a level, persisted in localStorage. */
export interface HighscoreEntry {
  readonly points: number;
  readonly attempts: number;
  readonly timeElapsedSeconds: number;
  /** ISO-8601 timestamp of when the score was achieved. */
  readonly achievedAt: string;
}

/** Highscore table keyed by level (a level may not have a score yet). */
export type Highscores = Partial<Record<Level, HighscoreEntry>>;
