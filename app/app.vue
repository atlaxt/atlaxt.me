<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const route = useRoute()

const title = computed(() => {
  const baseTitle = 'Atlas Yiğit Aydın | Web Developer'
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

const isLoading = ref(true)

onMounted(() => {
  if (document.readyState === 'complete') {
    finishLoading()
  }
  else {
    window.addEventListener('load', finishLoading)
    setTimeout(finishLoading, 3000)
  }
})

function finishLoading() {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
</script>

<template>
  <SpeedInsights />
  <Analytics />
  <div>
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700"
      :class="{ 'opacity-0 pointer-events-none': !isLoading }"
    >
      <div class="text-white text-2xl font-bold animate-pulse">
        YÜKLENİYOR...
      </div>
    </div>

    <NuxtLayout>
      <div class="relative py-1 flex items-center justify-center gap-3  px-4 font-bold tracking-widest uppercase text-xs md:text-sm">
        <Icon name="lucide:construction" class="w-5 " />
        <span class="drop-shadow-sm">Website is Under Construction</span>
        <Icon name="lucide:construction" class="w-5 " />
      </div>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(-1rem);
  filter: blur(5px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(1rem);
  filter: blur(5px);
}

.hazard-stripes {
  background-image: linear-gradient(
    45deg,
    #000000 25%,
    transparent 25%,
    transparent 50%,
    #000000 50%,
    #000000 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
}

@keyframes slide-bg {
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
}

.animate-slide-bg {
  animation: slide-bg 2s linear infinite;
}
</style>
