<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const mounted = ref(false)

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/',
  },
  {
    label: 'Projects',
    active: route.path.startsWith('/projects'),
    to: '/projects',
  },
  // {
  //   label: 'Design',
  //   active: route.path.startsWith('/design'),
  //   disabled: true,
  // },
  // {
  //   label: 'Photos',
  //   active: route.path.startsWith('/photos'),
  //   to: '/photos',
  // },
  {
    label: 'Books',
    to: '/books',
    active: route.path.startsWith('/books'),
  },
])
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div class="select-none fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10">
    <GlassSurface
      v-if="mounted"
      :width="320"
      :height="50"
      :border-width="0"
      :displace="0.7"
      :border-radius="40"
    >
      <UNavigationMenu
        :items="items"
        variant="link"
        color="neutral"
        :ui="{
          link: 'px-2 py-1',
          linkLeadingIcon: 'hidden',
        }"
      >
        <template #list-trailing>
          <ColorModeButton />
        </template>
      </UNavigationMenu>
    </GlassSurface>
  </div>
</template>
