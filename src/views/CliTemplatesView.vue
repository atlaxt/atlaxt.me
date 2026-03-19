<script setup lang="ts">
import CliLayout from '@/layouts/CliLayout.vue'
import CliCommand from '@/components/CliCommand.vue'
import { useSeo } from '@/seo/useSeo'

const templates = [
  {
    name:  'starter-vue-nuxtui',
    desc:  'Vue 3 + Nuxt UI başlangıç şablonu.',
    href:  'https://github.com/atlaxt/starter-vue-nuxtui',
  },
  {
    name:  'starter-nuxt-nuxtui',
    desc:  'Nuxt 3 + Nuxt UI başlangıç şablonu.',
    href:  'https://github.com/atlaxt/starter-nuxt-nuxtui',
  },
  {
    name:  'starter-nuxt-primevue',
    desc:  'Nuxt 3 + PrimeVue başlangıç şablonu.',
    href:  'https://github.com/atlaxt/starter-nuxt-primevue',
  },
  {
    name:  'starter-vue-primevue',
    desc:  'Vue 3 + PrimeVue başlangıç şablonu.',
    href:  'https://github.com/atlaxt/starter-vue-primevue',
  },
]

useSeo({
  title: 'Templates — atlaxt CLI',
  description: 'atlaxt CLI proje şablonları.',
  canonicalPath: '/cli/templates',
  type: 'website',
})
</script>

<template>
  <CliLayout>
    <h1 class="text-lg font-semibold mb-3" style="color: var(--text);">Templates</h1>
    <p class="text-sm leading-relaxed mb-6" style="color: var(--text-muted);">
      Şablonlar GitHub'daki kendi repolarımdan otomatik klonlanır, proje adı vererek başlatılır.
    </p>

    <CliCommand class="mb-10" npm="npx atlaxt templates" pnpm="pnpx atlaxt templates" />

    <div class="flex flex-col" style="border-top: 1px solid var(--border);">
      <a
        v-for="tpl in templates"
        :key="tpl.name"
        :href="tpl.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-start justify-between gap-6 py-5 transition-opacity hover:opacity-60"
        style="border-bottom: 1px solid var(--border); color: var(--text);"
      >
        <div>
          <p class="text-sm font-mono font-medium mb-1">{{ tpl.name }}</p>
          <p class="text-xs leading-relaxed" style="color: var(--text-muted);">{{ tpl.desc }}</p>
        </div>
        <span class="text-sm shrink-0 mt-0.5" style="color: var(--text-muted);">→</span>
      </a>
    </div>
  </CliLayout>
</template>
