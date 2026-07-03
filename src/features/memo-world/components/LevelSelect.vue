<script setup lang="ts">
import type { Highscores, Level } from "@/features/memo-world/types";
import { LEVELS, LEVEL_ORDER } from "@/features/memo-world/config/levels";
import { formatDuration } from "../utils/formatDuration";

defineProps<{ highscores: Highscores }>();

const emit = defineEmits<{ select: [level: Level] }>();
</script>

<template>
  <section class="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-light tracking-[0.3em] text-ui-text">MEMO·WORLD</h1>
      <p class="text-sm tracking-widest text-accent/70">Match the landmarks. Fewer tries, more points.</p>
    </div>

    <ul class="grid w-full gap-4 sm:grid-cols-3">
      <li v-for="level in LEVEL_ORDER" :key="level">
        <button
          type="button"
          class="flex h-full w-full flex-col items-center gap-3 rounded-sm border border-card-back-line bg-card-face p-6 text-ui-text transition-colors hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="emit('select', level)"
        >
          <span class="text-xl font-light tracking-[0.2em] uppercase">{{ LEVELS[level].label }}</span>
          <span class="text-xs tracking-widest text-ui-text/60">
            {{ LEVELS[level].pairs }} pairs · {{ formatDuration(LEVELS[level].timeLimitSeconds) }}
          </span>
          <span class="mt-1 text-[11px] uppercase tracking-widest text-accent/60">
            <template v-if="highscores[level]">Best {{ highscores[level]?.points }} pts</template>
            <template v-else>No score yet</template>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
