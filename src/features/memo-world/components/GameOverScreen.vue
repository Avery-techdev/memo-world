<script setup lang="ts">
import { computed } from "vue";
import ModalOverlay from "./ModalOverlay.vue";
import { formatDuration } from "../utils/formatDuration";

const props = defineProps<{
  open: boolean;
  won: boolean;
  points: number;
  attempts: number;
  timeElapsedSeconds: number;
  matchedPairs: number;
  totalPairs: number;
  isNewHighscore: boolean;
  bestPoints: number | null;
}>();

const emit = defineEmits<{ restart: []; quit: [] }>();

const title = computed(() => (props.won ? "You Win" : "Time's Up"));
</script>

<template>
  <ModalOverlay :open="open" labelledby="gameover-title" @close="emit('quit')">
    <div class="flex flex-col gap-6 text-center">
      <div class="flex flex-col gap-1">
        <h2 id="gameover-title" class="text-2xl font-light uppercase tracking-[0.3em]">{{ title }}</h2>
        <p v-if="isNewHighscore" class="text-xs uppercase tracking-widest text-white">New highscore</p>
        <p v-else-if="bestPoints !== null" class="text-xs uppercase tracking-widest text-ui-muted">
          Best {{ bestPoints }} pts
        </p>
      </div>

      <dl class="grid grid-cols-2 gap-4 text-left tabular-nums">
        <div>
          <dt class="text-[10px] uppercase tracking-widest text-ui-muted">Points</dt>
          <dd class="text-xl font-light">{{ points }}</dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase tracking-widest text-ui-muted">Time</dt>
          <dd class="text-xl font-light">{{ formatDuration(timeElapsedSeconds) }}</dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase tracking-widest text-ui-muted">Pairs</dt>
          <dd class="text-xl font-light">{{ matchedPairs }} / {{ totalPairs }}</dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase tracking-widest text-ui-muted">Attempts</dt>
          <dd class="text-xl font-light">{{ attempts }}</dd>
        </div>
      </dl>

      <div class="flex flex-col gap-3">
        <button
          type="button"
          class="rounded-sm border border-accent bg-accent px-4 py-2 text-xs uppercase tracking-widest text-stage transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="emit('restart')"
        >
          Play Again
        </button>
        <button
          type="button"
          class="rounded-sm border border-card-back-line px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="emit('quit')"
        >
          Level Overview
        </button>
      </div>
    </div>
  </ModalOverlay>
</template>
