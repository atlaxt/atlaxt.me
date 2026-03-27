<script setup lang="ts">
import { useSeo } from '@/seo/useSeo'

useSeo({
  title: '404 — Sayfa Bulunamadı',
  description: 'Aradığınız sayfa bulunamadı.',
  canonicalPath: '/404',
  type: 'website',
  noindex: true,
})
</script>

<template>
  <div class="not-found">
    <div class="content">
      <p class="label">
        404
      </p>
      <h1 class="heading">
        Sayfa bulunamadı.
      </h1>
      <RouterLink to="/" class="back-link">
        <span class="arrow">←</span> Ana sayfaya dön
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 57px);
  padding: 2rem 2rem 2rem 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding-left: 2rem;
}

.label {
  font-size: 0.65rem;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.18em;
  color: var(--text-muted);
  opacity: 0.4;
}

.heading {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--text);
  line-height: 1.15;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--text);
  opacity: 0.35;
  transition: opacity 0.2s ease;
  text-decoration: none;
  margin-top: 0.5rem;
}

.back-link:hover {
  opacity: 0.85;
}

.arrow {
  transition: transform 0.2s ease;
}

.back-link:hover .arrow {
  transform: translateX(-3px);
}
</style>
