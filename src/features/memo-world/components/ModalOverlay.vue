<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  open: boolean;
  /** Id of the element labelling the dialog (its heading). */
  labelledby: string;
}>();

const emit = defineEmits<{ close: [] }>();

const panel = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function focusableElements(): HTMLElement[] {
  if (!panel.value) {
    return [];
  }
  return Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function onKeydown(event: KeyboardEvent): void {
  if (!props.open) {
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
    return;
  }
  if (event.key !== "Tab") {
    return;
  }
  const elements = focusableElements();
  if (elements.length === 0) {
    event.preventDefault();
    panel.value?.focus();
    return;
  }
  const first = elements[0];
  const last = elements[elements.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", onKeydown);
      await nextTick();
      (focusableElements()[0] ?? panel.value)?.focus();
    } else {
      document.removeEventListener("keydown", onKeydown);
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  },
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-stage/80 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="labelledby"
        tabindex="-1"
        class="w-full max-w-md rounded-sm border border-card-back-line bg-card-face p-8 text-ui-text shadow-2xl focus:outline-none"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
