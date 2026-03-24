<script setup lang="ts">
import { useSeo } from '@/seo/useSeo'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  'mainEntity': {
    '@type': 'Person',
    'name': 'Atlas Yiğit Aydın',
    'url': 'https://atlaxt.me',
    'jobTitle': 'Web Geliştirici',
    'sameAs': [
      'https://github.com/atlaxt',
      'https://linkedin.com/in/atlaxt',
      'https://instagram.com/atlaxt.me',
    ],
  },
}

useSeo({
  title: 'Hakkımda',
  description: 'Atlas Yiğit Aydın — Vue ekosistemine odaklanan web geliştirici. trex Digital Manufacturing\'da çalışıyor.',
  canonicalPath: '/about',
  type: 'website',
  jsonLd,
})
</script>

<template>
  <div class="px-8 py-16 max-w-xl">
    <h1 class="text-2xl font-semibold mb-8" style="color: var(--text);">
      Hakkımda
    </h1>
    <p style="color: var(--text-muted);">
      Yakında...
    </p>
  </div>
</template>
