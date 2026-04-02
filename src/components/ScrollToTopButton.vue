<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const showScrollTop = ref(false)
const hasNewsTicker = ref(false)
let tickerObserver: MutationObserver | null = null

function updateScrollTopVisibility() {
  showScrollTop.value = window.scrollY > 260
}

function updateTickerVisibility() {
  hasNewsTicker.value = !!document.querySelector('.news-ticker')
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollTopVisibility()
  updateTickerVisibility()
  window.addEventListener('scroll', updateScrollTopVisibility, { passive: true })

  tickerObserver = new MutationObserver(() => {
    updateTickerVisibility()
  })
  tickerObserver.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollTopVisibility)
  tickerObserver?.disconnect()
})
</script>

<template>
  <Transition name="scroll-top-fade">
    <button
      v-if="showScrollTop"
      class="scroll-top-btn"
      :class="{ 'scroll-top-btn--banner-off': !hasNewsTicker }"
      type="button"
      aria-label="Yukari cik"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M7.5 9.5L12 5l4.5 4.5" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.scroll-top-btn {
  position: fixed;
  right: max(0.75rem, calc((100vw - 60rem) / 2 - 2.35rem));
  bottom: 3.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 0;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  z-index: 48;
  transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease, bottom 0.2s ease;
}

.scroll-top-btn--banner-off {
  bottom: 1rem;
}

.scroll-top-btn:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--border) 70%, var(--text) 30%);
}

.scroll-top-btn:active {
  transform: translateY(0);
}

.scroll-top-btn svg {
  width: 0.75rem;
  height: 0.75rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.92;
}

.scroll-top-fade-enter-active,
.scroll-top-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.scroll-top-fade-enter-from,
.scroll-top-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 640px) {
  .scroll-top-btn {
    bottom: 2.95rem;
    height: 1.9rem;
    width: 1.9rem;
  }

  .scroll-top-btn--banner-off {
    bottom: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top-btn,
  .scroll-top-fade-enter-active,
  .scroll-top-fade-leave-active {
    transition: none;
  }
}
</style>
