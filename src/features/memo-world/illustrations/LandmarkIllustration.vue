<script setup lang="ts">
import { computed } from "vue";
import type { LandmarkId } from "@/features/memo-world/types";
import { LANDMARK_ILLUSTRATIONS } from "./registry";

const props = defineProps<{ landmarkId: LandmarkId }>();

const illustration = computed(() => LANDMARK_ILLUSTRATIONS[props.landmarkId]);
</script>

<template>
  <!-- Decorative motif; the accessible name is provided by the card's photo title. -->
  <component :is="illustration" class="block h-full w-full text-current" />
</template>
