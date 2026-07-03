<script setup lang="ts">
import { computed } from "vue";
import type { Card, LandmarkId, Level } from "@/features/memo-world/types";
import { LANDMARKS } from "@/features/memo-world/config/landmarks";
import MemoryCard from "./MemoryCard.vue";

const props = defineProps<{
  cards: readonly Card[];
  level: Level;
  locked: boolean;
  /** True while a mismatched pair is shown; used to shake the wrong cards. */
  isResolving: boolean;
}>();

function isMismatched(card: Card): boolean {
  return props.isResolving && card.isFlipped && !card.isMatched;
}

const emit = defineEmits<{ flip: [cardId: number] }>();

const landmarkById = new Map<LandmarkId, { name: string; city: string }>(
  LANDMARKS.map((landmark) => [landmark.id, { name: landmark.name, city: landmark.city }]),
);

// Responsive column count per level (mobile-first): denser boards get more columns.
const gridClass = computed<string>(() => {
  const byLevel: Record<Level, string> = {
    easy: "grid-cols-3 sm:grid-cols-4",
    medium: "grid-cols-4",
    hard: "grid-cols-4 sm:grid-cols-5",
  };
  return byLevel[props.level];
});
</script>

<template>
  <div class="relative mx-auto w-full max-w-2xl">
    <div class="board-glow pointer-events-none absolute -inset-8 -z-10" aria-hidden="true"></div>
    <div class="grid gap-2 sm:gap-3" :class="gridClass">
      <MemoryCard
        v-for="(card, index) in cards"
        :key="card.id"
        :card="card"
        :landmark-name="landmarkById.get(card.landmarkId)?.name ?? ''"
        :landmark-city="landmarkById.get(card.landmarkId)?.city ?? ''"
        :index="index"
        :mismatched="isMismatched(card)"
        :locked="locked"
        @flip="emit('flip', $event)"
      />
    </div>
  </div>
</template>
