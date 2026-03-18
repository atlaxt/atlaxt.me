<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useSeo } from '@/seo/useSeo'

const { t } = useI18n()

useSeo({
  title: computed(() => t('about.title')),
  description: 'Atlas Yiğit Aydın hakkında.',
  canonicalPath: '/about',
  type: 'website',
})
</script>

<template>
  <div class="px-8 py-16 max-w-xl">
    <h1 class="text-2xl font-semibold mb-8" style="color: var(--text);">
      {{ t('about.title') }}
    </h1>
    <p style="color: var(--text-muted);">Yakında...</p>
  </div>
</template>
