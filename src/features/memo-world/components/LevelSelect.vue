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
      <h1
        class="text-3xl font-light tracking-[0.15em] text-ui-text sm:text-4xl sm:tracking-[0.3em]"
      >
        MEMO·WORLD
      </h1>
      <p class="text-sm tracking-widest text-ui-muted">
        Match the landmarks. Fewer tries, more points.
      </p>
    </div>

    <ul class="grid w-full gap-4 sm:grid-cols-3">
      <li v-for="level in LEVEL_ORDER" :key="level">
        <button
          type="button"
          class="card-elevation hover:card-elevation-hover flex h-full w-full flex-col items-center gap-3 rounded-sm border border-card-back-line bg-card-face p-6 text-ui-text transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="emit('select', level)"
        >
          <span class="text-xl font-light tracking-[0.2em] uppercase">{{
            LEVELS[level].label
          }}</span>
          <span class="text-xs tracking-widest text-ui-muted">
            {{ LEVELS[level].pairs }} pairs · {{ formatDuration(LEVELS[level].timeLimitSeconds) }}
          </span>
          <span class="mt-1 text-[11px] uppercase tracking-widest text-accent/80">
            <template v-if="highscores[level]">Best {{ highscores[level]?.points }} pts</template>
            <template v-else>No score yet</template>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
