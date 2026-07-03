import type { Level, LevelConfig } from "@/features/memo-world/types";

// Hardcoded level configuration – single source of truth for pairs, time limits
// and scoring thresholds. Scoring mirrors the reference mechanic: more points per
// pair the fewer attempts were needed.

export const LEVELS: Readonly<Record<Level, LevelConfig>> = {
  easy: {
    level: "easy",
    label: "Easy",
    pairs: 6,
    timeLimitSeconds: 120,
    threePointsBelowAttempts: 6,
    twoPointsMaxAttempts: 9,
  },
  medium: {
    level: "medium",
    label: "Medium",
    pairs: 8,
    timeLimitSeconds: 240,
    threePointsBelowAttempts: 8,
    twoPointsMaxAttempts: 14,
  },
  hard: {
    level: "hard",
    label: "Hard",
    pairs: 10,
    timeLimitSeconds: 360,
    threePointsBelowAttempts: 10,
    twoPointsMaxAttempts: 16,
  },
} as const;

/** Levels in display order for the level selection screen. */
export const LEVEL_ORDER: readonly Level[] = ["easy", "medium", "hard"] as const;
