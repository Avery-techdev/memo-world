// Public API of the `memo-world` feature.
// External imports (e.g. from App.vue) go EXCLUSIVELY through this file.
// Internal files (components/, composables/, services/, types/, illustrations/)
// are private and must not be imported directly.
//
// Re-exports are added in the following steps:
//   export { default as LevelSelect } from "./components/LevelSelect.vue";

export { useMemoryGame } from "./composables/useMemoryGame";
export type { UseMemoryGame } from "./composables/useMemoryGame";
export { gameStorageService } from "./services/gameStorageService";

export type {
  Level,
  LandmarkId,
  Landmark,
  Card,
  GameStatus,
  GameState,
  LevelConfig,
  HighscoreEntry,
  Highscores,
} from "./types";

export { LEVELS, LEVEL_ORDER } from "./config/levels";
