<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useMemoryGame } from "../composables/useMemoryGame";
import LevelSelect from "./LevelSelect.vue";
import GameHeader from "./GameHeader.vue";
import GameBoard from "./GameBoard.vue";
import PauseOverlay from "./PauseOverlay.vue";
import GameOverScreen from "./GameOverScreen.vue";

// Container: owns the game state via the composable and wires read-only state /
// events to the presentational components. Persistence stays behind the
// composable; the UI never talks to the storage service directly.
const game = useMemoryGame();

// Escape pauses an active round; while paused, the overlay's own Escape resumes it.
function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape" && game.status.value === "playing") {
    game.pauseGame();
  }
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));

const isMenu = computed(() => game.status.value === "idle");
const isPaused = computed(() => game.status.value === "paused");
const isGameOver = computed(() => game.status.value === "won" || game.status.value === "lost");
// While an overlay is open, take the background out of tab order and the a11y tree.
const isOverlayOpen = computed(() => isPaused.value || isGameOver.value);
</script>

<template>
  <main
    class="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-6 p-4 sm:p-6"
    :inert="isOverlayOpen"
  >
    <LevelSelect v-if="isMenu" :highscores="game.highscores.value" @select="game.startGame" />

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
        :key="game.roundId.value"
        :cards="game.cards.value"
        :level="game.level.value"
        :locked="game.isInteractionLocked.value"
        :is-resolving="game.isResolving.value"
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

    <!-- Ambient film grain across the whole scene (decorative). -->
    <div
      class="film-grain pointer-events-none fixed inset-[-8%] z-40 opacity-[0.04] mix-blend-screen"
      aria-hidden="true"
    ></div>

    <GameOverScreen
      :open="isGameOver"
      :won="game.status.value === 'won'"
      :points="game.points.value"
      :attempts="game.attempts.value"
      :time-elapsed-seconds="game.timeElapsedSeconds.value"
      :matched-pairs="game.matchedPairs.value"
      :total-pairs="game.totalPairs.value"
      :is-new-highscore="game.isNewHighscore.value"
      :best-points="game.bestPoints.value"
      @restart="game.restartGame"
      @quit="game.exitToMenu"
    />
  </main>
</template>
