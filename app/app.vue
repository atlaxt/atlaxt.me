<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { Analytics } from '@vercel/analytics/nuxt'

import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const { locale } = useI18n()

useHead({
  title: 'Atlas Yiğit Aydın',
  style: [
    { innerHTML: ':root { --ui-primary: black; } .dark { --ui-primary: white; }', id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
  ],
  script: [{
    innerHTML: `document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = ':root { --ui-primary: black; } .dark { --ui-primary: white; }';`,
  }],
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <SpeedInsights />
    <Analytics />
    <UMain>
      <UContainer class="min-h-screen bg-default border-x border-default px-0 sm:px-0 lg:px-0">
        <AppHeader />
        <StarsBg class="fixed" />
        <NuxtPage />
      </UContainer>
    </UMain>
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
