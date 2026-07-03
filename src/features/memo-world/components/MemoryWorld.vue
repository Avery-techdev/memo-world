<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Highscores } from "@/features/memo-world/types";
import { useMemoryGame } from "../composables/useMemoryGame";
import { gameStorageService } from "../services/gameStorageService";
import LevelSelect from "./LevelSelect.vue";
import GameHeader from "./GameHeader.vue";
import GameBoard from "./GameBoard.vue";
import PauseOverlay from "./PauseOverlay.vue";
import GameOverScreen from "./GameOverScreen.vue";

// Container: owns the game state (composable) and highscore persistence (service),
// and wires read-only state / events to the presentational components.
const game = useMemoryGame();

const highscores = ref<Highscores>(gameStorageService.getHighscores());

// Refresh the cached highscores whenever a round finishes or we return to the menu.
watch(game.status, (status) => {
  if (status === "idle" || status === "won") {
    highscores.value = gameStorageService.getHighscores();
  }
});

const isMenu = computed(() => game.status.value === "idle");
const isPaused = computed(() => game.status.value === "paused");
const isGameOver = computed(() => game.status.value === "won" || game.status.value === "lost");
const bestPoints = computed(() => highscores.value[game.level.value]?.points ?? null);
</script>

<template>
  <main class="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-6 p-4 sm:p-6">
    <LevelSelect v-if="isMenu" :highscores="highscores" @select="game.startGame" />

    <template v-else>
      <GameHeader
        :time-elapsed-seconds="game.timeElapsedSeconds.value"
        :remaining-seconds="game.remainingSeconds.value"
        :attempts="game.attempts.value"
        :matched-pairs="game.matchedPairs.value"
        :total-pairs="game.totalPairs.value"
        @pause="game.pauseGame"
      />
      <GameBoard
        :cards="game.cards.value"
        :level="game.level.value"
        :locked="game.isInteractionLocked.value"
        @flip="game.flipCard"
      />
    </template>

    <PauseOverlay
      :open="isPaused"
      :points="game.points.value"
      :attempts="game.attempts.value"
      :time-elapsed-seconds="game.timeElapsedSeconds.value"
      :matched-pairs="game.matchedPairs.value"
      :total-pairs="game.totalPairs.value"
      @resume="game.resumeGame"
      @restart="game.restartGame"
      @quit="game.exitToMenu"
    />

    <GameOverScreen
      :open="isGameOver"
      :won="game.status.value === 'won'"
      :points="game.points.value"
      :attempts="game.attempts.value"
      :time-elapsed-seconds="game.timeElapsedSeconds.value"
      :matched-pairs="game.matchedPairs.value"
      :total-pairs="game.totalPairs.value"
      :is-new-highscore="game.isNewHighscore.value"
      :best-points="bestPoints"
      @restart="game.restartGame"
      @quit="game.exitToMenu"
    />
  </main>
</template>
