<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: $t('projects'),
    active: route.path.startsWith('/projects'),
    to: '/projects',
  },
  // {
  //   label: $t('writings'),
  //   active: route.path.startsWith('/writings'),
  //   to: '/writings',
  // },
  {
    label: $t('about_me'),
    active: route.path.startsWith('/about'),
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
