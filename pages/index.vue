<script setup lang="ts">
import Header from '~/components/header.vue'
import Link from '~/components/link.vue'

definePageMeta({
  name: 'home',
})
const projects = [
  {
    label: 'ApiKoi',
    loading: true,
    links: {
      live: 'https://apikoi.com/',
      github: 'https://github.com/atlaxt/qr',
    },
  },
  {
    label: 'InkHub',
    loading: true,
    links: {
      live: 'https://inkhub.atlaxt.me/',
      github: 'https://github.com/atlaxt/InkHub',
    },
  },
  {
    label: '100 css',
    loading: true,
    links: {
      github: 'https://github.com/atlaxt/100-css',
      live: 'https://100-css.atlaxt.me/',
    },
  },
  {
    label: 'Git101',
    links: {
      live: 'https://git101.atlaxt.me/',
      github: 'https://github.com/atlaxt/git101',
    },
  },
  {
    label: 'imoji',
    links: {
      live: 'https://imoji.co/',
      github: 'https://github.com/atlaxt/imoji',
    },
  },
  {
    label: 'KoiJs/Vue',
    disabled: true,
    links: {
      github: 'https://github.com/koijs-vue',
    },
  },
  {
    label: 'KoiJs/React',
    disabled: true,
    links: {
      github: 'https://github.com/koijs-react',
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
          :loading="link.loading"
        />
      </div>

      <p class="mb-12 sticky bottom-0 text-sm text-center text-gray-400 w-full">
        Pixels with purpose, code with soul.
      </p>
    </div>
  </NuxtLayout>
</template>
