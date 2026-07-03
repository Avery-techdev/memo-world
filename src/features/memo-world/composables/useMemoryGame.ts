import { computed, onUnmounted, ref, type ComputedRef } from "vue";
import type { Card, GameStatus, HighscoreEntry, Level, LevelConfig } from "@/features/memo-world/types";
import { LEVELS } from "@/features/memo-world/config/levels";
import { LANDMARKS } from "@/features/memo-world/config/landmarks";
import { gameStorageService } from "@/features/memo-world/services/gameStorageService";

/** Delay before two non-matching cards flip back, in milliseconds. */
const MISMATCH_FLIP_BACK_MS = 900;
/** Timer tick interval in milliseconds. */
const TICK_MS = 1000;

/** Fisher-Yates shuffle returning a new array (does not mutate the input). */
function shuffle<T>(source: readonly T[]): T[] {
  const result = source.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Builds a shuffled deck of `pairs * 2` cards using the first `pairs` landmarks. */
function buildDeck(pairs: number): Card[] {
  const chosen = LANDMARKS.slice(0, pairs);
  const deck = chosen.flatMap((landmark) => [landmark.id, landmark.id]);
  return shuffle(deck).map((landmarkId, index) => ({
    id: index,
    landmarkId,
    isFlipped: false,
    isMatched: false,
  }));
}

function pointsPerPair(attempts: number, config: LevelConfig): number {
  if (attempts < config.threePointsBelowAttempts) {
    return 3;
  }
  if (attempts <= config.twoPointsMaxAttempts) {
    return 2;
  }
  return 1;
}

export interface UseMemoryGame {
  // Read-only state exposed as computed refs (single source of truth lives on
  // the internal cards/attempts/time/status refs).
  readonly cards: ComputedRef<readonly Card[]>;
  readonly level: ComputedRef<Level>;
  readonly config: ComputedRef<LevelConfig>;
  readonly status: ComputedRef<GameStatus>;
  readonly attempts: ComputedRef<number>;
  readonly timeElapsedSeconds: ComputedRef<number>;
  // Derived values (computed, never stored).
  readonly matchedPairs: ComputedRef<number>;
  readonly totalPairs: ComputedRef<number>;
  readonly remainingSeconds: ComputedRef<number>;
  readonly points: ComputedRef<number>;
  readonly isBoardComplete: ComputedRef<boolean>;
  readonly isInteractionLocked: ComputedRef<boolean>;
  readonly isNewHighscore: ComputedRef<boolean>;
  // Actions (only way to mutate state).
  startGame(level: Level): void;
  restartGame(): void;
  flipCard(cardId: number): void;
  pauseGame(): void;
  resumeGame(): void;
}

/**
 * Central game logic for one Memo·World session. Owns the reactive state and
 * exposes derived values and actions. Consumers receive read-only state and may
 * mutate only through the returned actions.
 */
export function useMemoryGame(): UseMemoryGame {
  const level = ref<Level>("easy");
  const cards = ref<Card[]>([]);
  const attempts = ref(0);
  const timeElapsedSeconds = ref(0);
  const status = ref<GameStatus>("idle");
  const isResolving = ref(false);
  const isNewHighscoreRef = ref(false);

  let timerId: ReturnType<typeof setInterval> | null = null;
  let flipBackId: ReturnType<typeof setTimeout> | null = null;

  const config = computed<LevelConfig>(() => LEVELS[level.value]);
  const totalPairs = computed(() => config.value.pairs);
  const matchedPairs = computed(
    () => cards.value.filter((card) => card.isMatched).length / 2,
  );
  const flippedCards = computed(() =>
    cards.value.filter((card) => card.isFlipped && !card.isMatched),
  );
  const remainingSeconds = computed(() =>
    Math.max(0, config.value.timeLimitSeconds - timeElapsedSeconds.value),
  );
  const isBoardComplete = computed(() => matchedPairs.value === totalPairs.value);
  const points = computed(
    () => matchedPairs.value * pointsPerPair(attempts.value, config.value),
  );
  const isInteractionLocked = computed(
    () => status.value !== "playing" || isResolving.value || flippedCards.value.length >= 2,
  );

  function clearTimers(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    if (flipBackId !== null) {
      clearTimeout(flipBackId);
      flipBackId = null;
    }
  }

  function startTimer(): void {
    if (timerId !== null) {
      return;
    }
    timerId = setInterval(() => {
      timeElapsedSeconds.value += 1;
      if (remainingSeconds.value <= 0) {
        finish("lost");
      }
    }, TICK_MS);
  }

  function finish(outcome: Extract<GameStatus, "won" | "lost">): void {
    clearTimers();
    isResolving.value = false;
    status.value = outcome;
    if (outcome === "won") {
      const entry: HighscoreEntry = {
        points: points.value,
        attempts: attempts.value,
        timeElapsedSeconds: timeElapsedSeconds.value,
        achievedAt: new Date().toISOString(),
      };
      isNewHighscoreRef.value = gameStorageService.saveHighscore(level.value, entry);
    }
  }

  function resolveMatch(): void {
    const [first, second] = flippedCards.value;
    attempts.value += 1;

    if (first.landmarkId === second.landmarkId) {
      first.isMatched = true;
      second.isMatched = true;
      if (isBoardComplete.value) {
        finish("won");
      }
      return;
    }

    isResolving.value = true;
    flipBackId = setTimeout(() => {
      first.isFlipped = false;
      second.isFlipped = false;
      isResolving.value = false;
      flipBackId = null;
    }, MISMATCH_FLIP_BACK_MS);
  }

  function startGame(nextLevel: Level): void {
    clearTimers();
    level.value = nextLevel;
    cards.value = buildDeck(LEVELS[nextLevel].pairs);
    attempts.value = 0;
    timeElapsedSeconds.value = 0;
    isResolving.value = false;
    isNewHighscoreRef.value = false;
    status.value = "playing";
    startTimer();
  }

  function restartGame(): void {
    startGame(level.value);
  }

  function flipCard(cardId: number): void {
    if (isInteractionLocked.value) {
      return;
    }
    const card = cards.value.find((candidate) => candidate.id === cardId);
    if (!card || card.isFlipped || card.isMatched) {
      return;
    }
    card.isFlipped = true;
    if (flippedCards.value.length === 2) {
      resolveMatch();
    }
  }

  function pauseGame(): void {
    if (status.value !== "playing") {
      return;
    }
    clearTimers();
    status.value = "paused";
  }

  function resumeGame(): void {
    if (status.value !== "paused") {
      return;
    }
    status.value = "playing";
    startTimer();
  }

  onUnmounted(clearTimers);

  return {
    cards: computed<readonly Card[]>(() => cards.value),
    level: computed(() => level.value),
    config,
    status: computed(() => status.value),
    attempts: computed(() => attempts.value),
    timeElapsedSeconds: computed(() => timeElapsedSeconds.value),
    matchedPairs,
    totalPairs,
    remainingSeconds,
    points,
    isBoardComplete,
    isInteractionLocked,
    isNewHighscore: computed(() => isNewHighscoreRef.value),
    startGame,
    restartGame,
    flipCard,
    pauseGame,
    resumeGame,
  };
}
