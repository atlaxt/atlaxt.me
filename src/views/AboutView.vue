<script setup lang="ts">
import { useSeo } from '@/seo/useSeo'

useSeo({
  title: 'Hakkımda',
  description: 'Atlas Yiğit Aydın hakkında.',
  canonicalPath: '/about',
  type: 'website',
})
</script>

<template>
  <div class="px-8 py-16 max-w-xl">
    <h1 class="text-2xl font-semibold mb-8" style="color: var(--text);">
      Hakkımda
    </h1>
    <p style="color: var(--text-muted);">
      Yakında...
    </p>
  </div>
</template>
