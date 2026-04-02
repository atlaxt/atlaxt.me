<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits<{
  activate: []
}>()

const isVisible = ref(true)

function updateVisibility() {
  isVisible.value = window.scrollY < 24
}

function onClick() {
  emit('activate')
}

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
})
</script>

<template>
  <Transition name="scroll-cue-fade">
    <button
      v-show="isVisible"
      class="scroll-cue"
      type="button"
      aria-label="Aşağı kaydır"
      @click="onClick"
    >
      <span class="scroll-cue-icon">
        <span class="scroll-cue-dot" />
      </span>
      <span class="scroll-cue-arrow" aria-hidden="true" />
    </button>
  </Transition>
</template>

<style scoped>
.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 5rem;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.22rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text);
  opacity: 0.68;
  z-index: 55;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.scroll-cue:hover {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

.scroll-cue-fade-enter-active,
.scroll-cue-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-cue-fade-enter-from,
.scroll-cue-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}

.scroll-cue-icon {
  width: 0.88rem;
  height: 1.42rem;
  border: 1px solid color-mix(in srgb, var(--text) 45%, var(--border));
  border-radius: 999px;
  display: grid;
  place-items: start center;
  padding-top: 0.22rem;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--bg-subtle) 80%, transparent);
}

.scroll-cue-dot {
  width: 0.18rem;
  height: 0.18rem;
  border-radius: 999px;
  background: currentColor;
  animation: scroll-cue-bob 1.2s ease-in-out infinite;
}

.scroll-cue-arrow {
  width: 0.22rem;
  height: 0.22rem;
  border-right: 1.35px solid currentColor;
  border-bottom: 1.35px solid currentColor;
  transform: rotate(45deg);
  opacity: 0.6;
}

@keyframes scroll-cue-bob {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.2;
  }

  50% {
    transform: translateY(0.48rem);
    opacity: 0.95;
  }
}

@media (max-width: 640px) {
  .scroll-cue {
    bottom: 2.85rem;
  }
}
</style>
