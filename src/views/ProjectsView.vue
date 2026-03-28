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
  <div class="px-8 py-16">
    <PageHeader :crumbs="[{ label: 'Projeler', to: '/projects' }]" />

    <p class="note">
      Temizlik yapıyorum
    </p>
  </div>
</template>

<style scoped>
.note {
  font-size: 0.82rem;
  color: var(--text-muted);
  opacity: 0.45;
}
</style>
