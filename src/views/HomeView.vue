<script setup lang="ts">
import SignParticle from '@/components/SignParticle.vue'
import { useSeo } from '@/seo/useSeo'

const links = [
  { label: 'GitHub',    href: 'https://github.com/atlaxt' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/atlaxt' },
  { label: 'Instagram', href: 'https://instagram.com/atlaxt.me' },
]

useSeo({
  title: 'Atlas Yiğit Aydın',
  description: "Web geliştirici — Nuxt ekosistemine odaklanan, UX'e önem veren.",
  canonicalPath: '/',
  type: 'website',
})
</script>

<template>
  <div class="flex h-[calc(100vh-57px)]">
    <!-- Sol: Bio -->
    <div class="flex flex-col justify-center px-8 py-12 w-full md:w-2/5 shrink-0">
      <h1 class="text-2xl font-semibold mb-4" style="color: var(--text);">
        Atlas Yiğit Aydın
      </h1>
      <p class="text-sm leading-relaxed max-w-xs" style="color: var(--text-muted);">
        Öncelikli olarak Nuxt ekosistemine odaklanan bir Web Geliştiricisiyim. Nihai hedefim, yalnızca işlevsel kod yazmanın ötesine geçerek her üründe üst düzey Kullanıcı Deneyimi (UX) sunmak.
      </p>
      <!-- Şu an çalışılan yer -->
      <div class="inline-flex items-center gap-2 mt-6 text-sm" style="color: #4ade80;">
        <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0"></span>
        trex Digital Manufacturing'da çalışıyor
      </div>

      <div class="flex items-center gap-5 mt-6">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm transition-opacity hover:opacity-100 opacity-50"
          style="color: var(--text);"
        >
          {{ link.label }}
        </a>
      </div>
    </div>

    <!-- Sağ: Particle imza -->
    <div class="hidden md:block flex-1 relative">
      <SignParticle class="absolute inset-0" />
    </div>
  </div>
</template>
