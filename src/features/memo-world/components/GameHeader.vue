<script setup lang="ts">
import { computed, ref, watch } from "vue";
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

// Announce the low-time warning once for screen reader users; the visual cue
// alone (color change) would otherwise be a color-only status signal.
const timeAnnouncement = ref("");
watch(isTimeCritical, (critical) => {
  timeAnnouncement.value = critical ? "15 seconds remaining" : "";
});
</script>

<template>
  <header class="flex items-center justify-between gap-3 text-ui-text">
    <p class="sr-only" role="status" aria-live="polite">{{ timeAnnouncement }}</p>
    <dl class="flex items-center gap-3 tabular-nums sm:gap-8">
      <div class="flex flex-col">
        <dt class="text-[10px] whitespace-nowrap uppercase tracking-widest text-ui-muted">Time</dt>
        <dd
          class="text-base font-light whitespace-nowrap sm:text-lg"
          :class="isTimeCritical ? 'text-white' : ''"
        >
          {{ elapsedLabel }}
          <span class="text-[10px] text-ui-muted"
            >/ {{ formatDuration(remainingSeconds) }} left</span
          >
        </dd>
      </div>
      <div class="flex flex-col">
        <dt class="text-[10px] whitespace-nowrap uppercase tracking-widest text-ui-muted">
          Attempts
        </dt>
        <dd class="text-base font-light whitespace-nowrap sm:text-lg">{{ attempts }}</dd>
      </div>
      <div class="flex flex-col">
        <dt class="text-[10px] whitespace-nowrap uppercase tracking-widest text-ui-muted">Pairs</dt>
        <dd class="text-base font-light whitespace-nowrap sm:text-lg">
          {{ matchedPairs }} / {{ totalPairs }}
        </dd>
      </div>
    </dl>

    <button
      type="button"
      class="rounded-sm border border-card-back-line px-3 py-2 text-xs whitespace-nowrap uppercase tracking-widest text-ui-text transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4"
      @click="emit('pause')"
    >
      Pause
    </button>
  </header>
</template>
