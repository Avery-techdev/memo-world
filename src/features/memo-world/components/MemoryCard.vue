<script setup lang="ts">
import { computed } from "vue";
import type { Card } from "@/features/memo-world/types";
import LandmarkIllustration from "../illustrations/LandmarkIllustration.vue";

const props = defineProps<{
  card: Card;
  landmarkName: string;
  /** Blocks flipping while the board resolves a pair or the game is not running. */
  locked: boolean;
}>();

const emit = defineEmits<{ flip: [cardId: number] }>();

const revealed = computed(() => props.card.isFlipped || props.card.isMatched);

const ariaLabel = computed(() =>
  revealed.value
    ? props.card.isMatched
      ? `${props.landmarkName}, matched`
      : props.landmarkName
    : "Face-down card",
);

function onFlip(): void {
  if (props.locked || revealed.value) {
    return;
  }
  emit("flip", props.card.id);
}
</script>

<template>
  <button
    type="button"
    class="group relative aspect-square w-full rounded-sm perspective-[1000px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    :disabled="card.isMatched"
    :aria-label="ariaLabel"
    @click="onFlip"
  >
    <span
      class="relative block h-full w-full transform-3d transition-transform duration-500 ease-out motion-reduce:transition-none"
      :class="revealed ? 'rotate-y-180' : ''"
    >
      <!-- Face-down side: graphite polaroid back -->
      <span
        class="card-back-pattern absolute inset-0 rounded-sm border border-card-back-line backface-hidden"
      ></span>

      <!-- Face-up side: landmark illustration with polaroid title -->
      <span
        class="absolute inset-0 flex rotate-y-180 flex-col rounded-sm border border-card-back-line bg-card-face backface-hidden transition-shadow duration-300"
        :class="card.isMatched ? 'shadow-[0_0_18px_rgba(245,245,245,0.35)]' : ''"
      >
        <span class="grid flex-1 place-items-center p-2 text-ui-text sm:p-3">
          <LandmarkIllustration :landmark-id="card.landmarkId" />
        </span>
        <span
          class="truncate border-t border-card-back-line px-1 py-1 text-center text-[9px] uppercase tracking-widest text-ui-text/80 sm:text-[10px]"
        >
          {{ landmarkName }}
        </span>
      </span>
    </span>
  </button>
</template>
