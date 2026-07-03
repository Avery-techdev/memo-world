<script setup lang="ts">
import { computed } from "vue";
import type { Card, LandmarkId, Level } from "@/features/memo-world/types";
import { LANDMARKS } from "@/features/memo-world/config/landmarks";
import MemoryCard from "./MemoryCard.vue";

const props = defineProps<{
  cards: readonly Card[];
  level: Level;
  locked: boolean;
}>();

const emit = defineEmits<{ flip: [cardId: number] }>();

const nameById = new Map<LandmarkId, string>(
  LANDMARKS.map((landmark) => [landmark.id, landmark.name]),
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
  <div class="mx-auto grid w-full max-w-2xl gap-2 sm:gap-3" :class="gridClass">
    <MemoryCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :landmark-name="nameById.get(card.landmarkId) ?? ''"
      :locked="locked"
      @flip="emit('flip', $event)"
    />
  </div>
</template>
