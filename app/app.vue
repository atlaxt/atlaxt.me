<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { Analytics } from '@vercel/analytics/nuxt'

import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const { locale } = useI18n()

useHead({
  title: 'Atlas Yiğit Aydın',
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <SpeedInsights />
    <Analytics />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
