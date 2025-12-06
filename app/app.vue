<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

const route = useRoute()

const title = computed(() => {
  const baseTitle = 'Atlas Yiğit Aydın | Frontend Developer'
  const pageName = route.name?.toString() || ''

  if (!pageName || pageName === 'index')
    return baseTitle
  return `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | Atlas Yiğit Aydın`
})

const description = computed(() => {
  const descriptions = {
    home: 'Frontend Developer specializing in building fast, accessible and user-focused interfaces. Experienced in Vue.js, Nuxt.js and modern web technologies.',
    projects: 'Explore my portfolio of web applications, developer tools, and open source projects. See examples of my work in frontend development, UI/UX design and creative coding.',
    photos: 'A collection of photographs capturing moments and perspectives through my lens. Visual storytelling and creative expression.',
  }
  return descriptions[route.name as keyof typeof descriptions] || descriptions.home
})

const ogImage = computed(() => {
  return '/og_image.jpg'
})

const keywords = computed(() => {
  const baseKeywords = 'frontend developer, web developer, vue.js developer, nuxt.js, javascript, typescript, ui developer'
  const pageKeywords = {
    projects: 'portfolio, web applications, developer tools, open source, ui components, api services',
    photos: 'photography, visual art, creative work, photo collection',
  }
  return pageKeywords[route.name as keyof typeof pageKeywords]
    ? `${baseKeywords}, ${pageKeywords[route.name as keyof typeof pageKeywords]}`
    : baseKeywords
})

useHead({
  title,
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: 'Atlas Yiğit Aydın' },
    { name: 'robots', content: 'index, follow' },
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },

    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: 'https://atlaxt.me' },
    { property: 'og:site_name', content: 'Atlas Yiğit Aydın' },
    { property: 'og:locale', content: 'en_US' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@atlaxt' },
    { name: 'twitter:creator', content: '@atlaxt' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },

    { name: 'theme-color', content: '#18181B' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://atlaxt.me' },
    { rel: 'alternate', hreflang: 'en', href: 'https://atlaxt.me' },
  ],
})
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden">
    <ColorBends
      :colors="['#ff5c7a', '#8a5cff', '#00ffd1']"
      :rotation="80"
      :speed="0.4"
      :scale="2"
      :frequency="1.5"
      :warp-strength="1.2"
      :mouse-influence="0.8"
      :parallax="2"
      :noise="0.02"
    />
  </div>

  <div class="relative z-10">
    <Analytics />
    <UApp>
      <AppHeader />
      <UMain>
        <UContainer>
          <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
        </UContainer>
      </UMain>
      <AppFooter />
    </UApp>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(-1rem);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
