<script setup lang="ts">
import Header from '~/components/header.vue'
import Link from '~/components/link.vue'

definePageMeta({
  name: 'home',
})
const projects = [
  {
    label: 'Git101',
    links: {
      live: 'https://git101.atlaxt.me/',
      github: 'https://github.com/atlaxt/git101',
    },
  },
  {
    label: 'Emojix',
    links: {
      live: 'https://emojix.atlaxt.me/',
      github: 'https://github.com/atlaxt/emojix',
    },
  },
  {
    label: 'ApiKoi',
    links: {
      live: 'https://apikoi.com/',
      github: 'https://github.com/atlaxt/qr',
    },
  },
  {
    label: 'KoiJs/Vue',
    disabled: true,
    links: {
      live: 'https://koijs.com/',
      github: 'https://github.com/koijs-vue',
    },
  },
  {
    label: 'KoiJs/React',
    disabled: true,
    links: {
      live: 'https://koijs.com/',
      github: 'https://github.com/koijs-react',
    },
  },
  {
    label: 'Border White',
    links: {
      live: 'https://border-white.atlasyigitaydin.com/',
      github: 'https://github.com/atlaxt/border-white',
    },
  },
  {
    label: 'Qr',
    links: {
      live: 'https://qr.atlasyigitaydin.com/',
      github: 'https://github.com/atlaxt/qr',
    },
  },
]
</script>

<template>
  <NuxtLayout>
    <div class="lg:w-96 md:w-10/12 w-full lg:p-0 p-2 flex flex-col h-full justify-center items-start relative">
      <Header />

      <div class="flex flex-col gap-4 w-full h-full justify-center">
        <Link
          v-for="(link, key) in projects"
          :key
          :label="link.label"
          :links="link.links"
          :disabled="link.disabled"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
