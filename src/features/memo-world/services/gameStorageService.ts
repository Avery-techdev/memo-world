import type { HighscoreEntry, Highscores, Level } from "@/features/memo-world/types";
import { LEVEL_ORDER } from "@/features/memo-world/config/levels";

// Persistence layer for highscores (localStorage). This is the only place that
// touches the storage API. Data read back is treated as unsafe and validated
// beyond pure structure before use (see guidelines: type guards for external data).

const STORAGE_KEY = "memo-world:highscores";

const LEVEL_SET: ReadonlySet<Level> = new Set(LEVEL_ORDER);

function isLevel(value: unknown): value is Level {
  return typeof value === "string" && LEVEL_SET.has(value as Level);
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isHighscoreEntry(value: unknown): value is HighscoreEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    isNonNegativeNumber(entry.points) &&
    isNonNegativeNumber(entry.attempts) &&
    isNonNegativeNumber(entry.timeElapsedSeconds) &&
    typeof entry.achievedAt === "string" &&
    entry.achievedAt.trim() !== "" &&
    !Number.isNaN(Date.parse(entry.achievedAt))
  );
}

function parseHighscores(raw: string | null): Highscores {
  if (!raw) {
    return {};
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof parsed !== "object" || parsed === null) {
    return {};
  }
  const result: Highscores = {};
  for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (isLevel(key) && isHighscoreEntry(value)) {
      result[key] = value;
    }
  }
  return result;
}

/** True if `candidate` is strictly better than `current` (higher points, then fewer attempts, then less time). */
function isBetter(candidate: HighscoreEntry, current: HighscoreEntry | undefined): boolean {
  if (!current) {
    return true;
  }
  if (candidate.points !== current.points) {
    return candidate.points > current.points;
  }
  if (candidate.attempts !== current.attempts) {
    return candidate.attempts < current.attempts;
  }
  return candidate.timeElapsedSeconds < current.timeElapsedSeconds;
}

export const gameStorageService = {
  getHighscores(): Highscores {
    return parseHighscores(localStorage.getItem(STORAGE_KEY));
  },

  getHighscore(level: Level): HighscoreEntry | undefined {
    return this.getHighscores()[level];
  },

  /** Persists the entry only if it beats the existing one. Returns true if stored. */
  saveHighscore(level: Level, entry: HighscoreEntry): boolean {
    const highscores = this.getHighscores();
    if (!isBetter(entry, highscores[level])) {
      return false;
    }
    highscores[level] = entry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(highscores));
    return true;
  },
};
