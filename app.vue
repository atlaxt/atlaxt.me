<script setup lang="ts">
import { NuxtLayout, NuxtPage } from '#components'
import { Analytics } from '@vercel/analytics/nuxt'

useHead({
  title: 'Atlas Yiğit Aydın',
})

const colorMode = useColorMode()
onMounted(() => {
  colorMode.preference = 'dark'
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Analytics />
</template>
