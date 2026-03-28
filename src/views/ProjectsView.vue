<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { useSeo } from '@/seo/useSeo'

useSeo({
  title: 'Projeler',
  description: 'Projeler yakında.',
  canonicalPath: '/projects',
  type: 'website',
  noindex: true,
})
</script>

<template>
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'Projeler', to: '/projects' }]" />

    <p class="note">
      Temizlik yapıyorum
    </p>

    <div class="w-full py-16 text-center font-mono text-xs">
      <a href="https://github.com/atlaxt" class="text-ink-muted" target="_blank" rel="noopener noreferrer">
        https://github.com/atlaxt
      </a>
    </div>
  </div>
</template>

<style scoped>
.note {
  font-size: 0.82rem;
  color: var(--text-muted);
  opacity: 0.45;
}
</style>
