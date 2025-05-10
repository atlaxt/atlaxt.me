<script setup lang="ts">
const route = useRoute()

const title = computed(() => {
  const baseTitle = 'Atlas Yiğit Aydın'
  const pageName = route.name?.toString() || ''

  if (!pageName || pageName === 'home')
    return baseTitle
  return `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | ${baseTitle}`
})

const description = computed(() => {
  const descriptions = {
    home: 'Personal website of Atlas Yiğit Aydın - Frontend Developer',
  }
  return descriptions[route.name as keyof typeof descriptions] || descriptions.home
})

const ogImage = computed(() => {
  return isDark ? '/assets/sign/sign_white.png' : '/assets/sign/sign_black.png'
})

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: ogImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
})
</script>

<template>
  <NuxtLayout class="inter">
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.inter {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
}

h2 {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
}
</style>
