<script setup lang="ts">
import { useSeo } from '@/seo/useSeo'

useSeo({
  title: '404',
  description: 'Sayfa bulunamadı.',
  noindex: true,
})
</script>

<template>
  <div class="flex flex-col justify-center px-8 py-32">
    <p class="text-xs font-mono mb-4" style="color: var(--text-muted); opacity: 0.4;">404</p>
    <h1 class="text-2xl font-semibold mb-3" style="color: var(--text);">
      Sayfa bulunamadı.
    </h1>
    <p class="text-sm mb-8" style="color: var(--text-muted);">
      Aradığın sayfa taşınmış veya silinmiş olabilir.
    </p>
    <RouterLink
      to="/"
      class="text-sm transition-opacity hover:opacity-60 w-fit"
      style="color: var(--text);"
    >
      ← Ana sayfaya dön
    </RouterLink>
  </div>
</template>
