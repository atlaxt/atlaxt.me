<script setup lang="ts">
import { NuxtLayout, NuxtPage } from '#components'
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

useHead({
  title: 'Atlas Yiğit Aydın',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Analytics />
  <SpeedInsights />
</template>
