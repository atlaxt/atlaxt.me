<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: $t('projects'),
    to: '/projects',
  },
  // {
  //   label: $t('writings'),
  //   to: '/writings',
  // },
  {
    label: $t('about_me'),
    to: '/about',
  },
])
</script>

<template>
  <UHeader :ui="{ root: 'border-none' }">
    <template #title>
      <Logo class="h-10 w-auto" />
    </template>

    <UNavigationMenu color="neutral" :items="items" variant="link" />

    <template #body>
      <UNavigationMenu color="neutral" orientation="vertical" :items="items" variant="link" />
    </template>

    <template #right>
      <UButton color="neutral" variant="ghost" icon="lucide:languages" @click="$i18n.setLocale($i18n.locale === 'tr' ? 'en' : 'tr')" />
      <UColorModeButton />
    </template>
  </UHeader>
</template>
