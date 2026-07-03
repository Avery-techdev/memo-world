<script setup lang="ts">
import { computed } from "vue";
import type { Card } from "@/features/memo-world/types";
import LandmarkIllustration from "../illustrations/LandmarkIllustration.vue";

const props = defineProps<{
  card: Card;
  landmarkName: string;
  landmarkCity: string;
  /** Position in the deck; drives the staggered deal-in delay. */
  index: number;
  /** True while this card is part of a revealed, mismatched pair. */
  mismatched: boolean;
  /** Blocks flipping while the board resolves a pair or the game is not running. */
  locked: boolean;
}>();

const dealInStyle = computed(() => ({ animationDelay: `${props.index * 45}ms` }));

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
  <div class="animate-deal-in motion-reduce:animate-none" :style="dealInStyle">
    <button
      type="button"
      class="group relative aspect-3/4 w-full touch-manipulation select-none rounded-sm transition-transform duration-200 ease-out perspective-[1000px] enabled:hover:-translate-y-1 enabled:active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      :class="mismatched ? 'animate-shake motion-reduce:animate-none' : ''"
      :disabled="card.isMatched"
      :aria-label="ariaLabel"
      @click="onFlip"
    >
      <span
        class="relative block h-full w-full transform-3d transition-transform duration-[550ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        :class="revealed ? 'rotate-y-180' : ''"
      >
        <!-- Face-down side: graphite polaroid back -->
        <span
          class="card-back-pattern card-elevation group-enabled:group-hover:card-elevation-hover absolute inset-0 rounded-sm border border-card-back-line backface-hidden transition-all duration-200 group-enabled:group-hover:border-accent/60"
        ></span>

        <!-- Face-up side: polaroid — hatched photo inset in a solid frame, caption below -->
        <span
          class="card-elevation absolute inset-0 flex rotate-y-180 flex-col rounded-sm border bg-card-face p-2 backface-hidden"
          :class="
            card.isMatched
              ? 'border-accent/70 animate-match-glow motion-reduce:animate-none'
              : 'border-card-back-line'
          "
        >
          <span
            class="photo-inset-pattern grid flex-1 place-items-center rounded-xs border border-black/40 p-3 text-ui-text"
          >
            <LandmarkIllustration :landmark-id="card.landmarkId" />
          </span>
          <span class="px-1 pt-2 pb-1 text-center">
            <span class="block truncate text-[11px] leading-tight font-medium text-ui-text">{{
              landmarkName
            }}</span>
            <span class="mt-0.5 block truncate text-[8px] uppercase tracking-widest text-ui-muted">
              {{ landmarkCity }}
            </span>
          </span>
        </span>
      </span>
    </button>
  </div>
</template>
