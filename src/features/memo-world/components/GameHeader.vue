<script setup lang="ts">
import { computed } from "vue";
import { formatDuration } from "../utils/formatDuration";

const props = defineProps<{
  timeElapsedSeconds: number;
  remainingSeconds: number;
  attempts: number;
  matchedPairs: number;
  totalPairs: number;
}>();

const emit = defineEmits<{ pause: [] }>();

const elapsedLabel = computed(() => formatDuration(props.timeElapsedSeconds));
const isTimeCritical = computed(() => props.remainingSeconds <= 15);
</script>

<template>
  <header class="flex items-center justify-between gap-3 text-ui-text">
    <dl class="flex items-center gap-4 tabular-nums sm:gap-8">
      <div class="flex flex-col">
        <dt class="text-[10px] uppercase tracking-widest text-ui-text/50">Time</dt>
        <dd class="text-lg font-light" :class="isTimeCritical ? 'text-white' : ''">
          {{ elapsedLabel }}
          <span class="text-[10px] text-ui-text/40">/ {{ formatDuration(remainingSeconds) }} left</span>
        </dd>
      </div>
      <div class="flex flex-col">
        <dt class="text-[10px] uppercase tracking-widest text-ui-text/50">Attempts</dt>
        <dd class="text-lg font-light">{{ attempts }}</dd>
      </div>
      <div class="flex flex-col">
        <dt class="text-[10px] uppercase tracking-widest text-ui-text/50">Pairs</dt>
        <dd class="text-lg font-light">{{ matchedPairs }} / {{ totalPairs }}</dd>
      </div>
    </dl>

    <button
      type="button"
      class="rounded-sm border border-card-back-line px-4 py-2 text-xs uppercase tracking-widest text-ui-text transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      @click="emit('pause')"
    >
      Pause
    </button>
  </header>
</template>
