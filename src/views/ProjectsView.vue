<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import SectionLabel from '@/components/SectionLabel.vue'
import { useColorMode } from '@/composables/useColorMode'
import { useSeo } from '@/seo/useSeo'
import projectsRaw from '../../content/projects.yaml'

interface FlatProject {
  name: string
  live?: string
  github?: string
  npm?: string
  preview_light?: string
  preview_dark?: string
}

const { isDark } = useColorMode()
const projects = projectsRaw as unknown as FlatProject[]

const featured = computed(() =>
  projects.filter(p => p.preview_light || p.preview_dark),
)

const others = computed(() =>
  projects.filter(p => !p.preview_light && !p.preview_dark),
)

function previewSrc(p: FlatProject): string | null {
  return isDark.value
    ? (p.preview_dark || p.preview_light || null)
    : (p.preview_light || p.preview_dark || null)
}

function normalizeUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://'))
    return url
  return `https://${url}`
}

function navigate(p: FlatProject) {
  if (!p.live)
    return
  window.open(normalizeUrl(p.live), '_blank', 'noopener,noreferrer')
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Projeler — Atlas Yiğit Aydın',
  'description': 'Geliştirdiğim web uygulamaları, açık kaynak araçları ve kişisel projeler.',
  'url': 'https://atlaxt.me/projects',
  'author': {
    '@type': 'Person',
    'name': 'Atlas Yiğit Aydın',
    'url': 'https://atlaxt.me',
  },
}

useSeo({
  title: 'Projeler',
  description: 'Geliştirdiğim web uygulamaları, açık kaynak araçları ve kişisel projeler.',
  canonicalPath: '/projects',
  type: 'website',
  jsonLd,
})
</script>

<template>
  <div class="px-2 md:px-0 py-16 w-full">
    <PageHeader :crumbs="[{ label: 'Projeler', to: '/projects' }]" />

    <!-- ── Featured: preview'u olan projeler ─────────────── -->
    <div class="grid gap-3 grid-cols-1 md:grid-cols-2">
      <div
        v-for="p in featured"
        :key="p.name"
        class="group flex flex-col border border-border transition-all duration-200 hover:bg-subtle"
        :class="p.live ? 'cursor-pointer' : 'cursor-default'"
        @click="navigate(p)"
      >
        <!-- Preview -->
        <div class="aspect-video overflow-hidden bg-subtle">
          <img
            :key="isDark ? 'dark' : 'light'"
            :src="previewSrc(p)!"
            :alt="p.name"
            loading="lazy"
            decoding="async"
            draggable="false"
            class="w-full h-full object-cover block transition-all duration-300 ease-out"
            :class="p.live ? 'group-hover:opacity-80 group-hover:scale-[1.02]' : ''"
          >
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between gap-3 px-4 py-3">
          <span class="text-[0.84rem] font-medium text-ink truncate min-w-0">{{ p.name }}</span>
          <div class="flex items-center gap-3 shrink-0">
            <!-- GitHub -->
            <a
              v-if="p.github"
              :href="p.github"
              target="_blank"
              rel="noopener noreferrer"
              class="text-ink-muted opacity-40 transition-opacity duration-150 hover:opacity-80"
              :title="`${p.name} — GitHub`"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <!-- npm -->
            <a
              v-if="p.npm"
              :href="p.npm"
              target="_blank"
              rel="noopener noreferrer"
              class="text-ink-muted opacity-40 transition-opacity duration-150 hover:opacity-80"
              :title="`${p.name} — npm`"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.568h-3.82V8.666H8.65v10.245H5.13z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Others: preview'suz projeler ──────────────────── -->
    <div v-if="others.length" class="mt-16">
      <SectionLabel class="mb-6">
        daha fazla
      </SectionLabel>
      <div class="flex flex-col">
        <div
          v-for="p in others"
          :key="p.name"
          class="group flex items-center justify-between gap-4 py-[0.85rem] border-b border-border first:border-t transition-opacity duration-150"
          :class="p.live ? 'cursor-pointer hover:opacity-55' : 'cursor-default'"
          @click="navigate(p)"
        >
          <span class="text-[0.84rem] font-[480] text-ink">{{ p.name }}</span>
          <div class="flex items-center gap-3 shrink-0">
            <!-- GitHub -->
            <a
              v-if="p.github"
              :href="p.github"
              target="_blank"
              rel="noopener noreferrer"
              class="text-ink-muted opacity-40 transition-opacity duration-150 hover:opacity-80"
              :title="`${p.name} — GitHub`"
              @click.stop
            >
              <svg class="w-3.25 h-3.25" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <!-- npm -->
            <a
              v-if="p.npm"
              :href="p.npm"
              target="_blank"
              rel="noopener noreferrer"
              class="text-ink-muted opacity-40 transition-opacity duration-150 hover:opacity-80"
              :title="`${p.name} — npm`"
              @click.stop
            >
              <svg class="w-3.25 h-3.25" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.568h-3.82V8.666H8.65v10.245H5.13z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
