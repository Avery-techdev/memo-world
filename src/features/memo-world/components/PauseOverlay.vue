<script setup lang="ts">
import ModalOverlay from "./ModalOverlay.vue";
import { formatDuration } from "../utils/formatDuration";

defineProps<{
  open: boolean;
  points: number;
  attempts: number;
  timeElapsedSeconds: number;
  matchedPairs: number;
  totalPairs: number;
}>();

const emit = defineEmits<{ resume: []; restart: []; quit: [] }>();
</script>

<template>
  <ModalOverlay :open="open" labelledby="pause-title" @close="emit('resume')">
    <div class="flex flex-col gap-6 text-center">
      <h2 id="pause-title" class="text-2xl font-light uppercase tracking-[0.3em]">Paused</h2>

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
          @click="emit('resume')"
        >
          Resume
        </button>
        <button
          type="button"
          class="rounded-sm border border-card-back-line px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="emit('restart')"
        >
          Restart
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
