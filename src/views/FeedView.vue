<script setup lang="ts">
import type { FeedItem, FeedSource } from '@/types'
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { fetchFeed } from '@/composables/useFeeds'
import { useSeo } from '@/seo/useSeo'
import feedsRaw from '../../content/feeds.yaml'

const sources = feedsRaw as unknown as FeedSource[]

const items = ref<FeedItem[]>([])
const loading = ref(true)
const selected = ref<Set<string>>(new Set())
const showRssSources = ref(false)

function toggle(name: string) {
  const next = new Set(selected.value)
  if (next.has(name))
    next.delete(name)
  else
    next.add(name)
  selected.value = next
}

const filtered = computed(() => {
  const base = items.value.slice().sort((a, b) => b.date.getTime() - a.date.getTime())
  if (!selected.value.size)
    return base
  return base.filter(i => selected.value.has(i.source))
})

const sourceNames = computed(() => [...new Set(items.value.map(i => i.source))])

const categories = computed(() => {
  const cats = new Map<string, FeedSource[]>()
  for (const src of sources) {
    if (!sourceNames.value.includes(src.name))
      continue
    const cat = src.category ?? 'Diğer'
    if (!cats.has(cat))
      cats.set(cat, [])
    cats.get(cat)!.push(src)
  }
  return cats
})

const rssCategories = computed(() => {
  const cats = new Map<string, FeedSource[]>()
  for (const src of sources) {
    const cat = src.category ?? 'Diğer'
    if (!cats.has(cat))
      cats.set(cat, [])
    cats.get(cat)!.push(src)
  }
  return cats
})

function isToday(d: Date): boolean {
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate()
}

function isYesterday(d: Date): boolean {
  const yest = new Date()
  yest.setDate(yest.getDate() - 1)
  return d.getFullYear() === yest.getFullYear()
    && d.getMonth() === yest.getMonth()
    && d.getDate() === yest.getDate()
}

function formatDate(d: Date): string {
  if (isToday(d))
    return 'Bugün'
  if (isYesterday(d))
    return 'Dün'
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function favicon(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
  }
  catch {
    return ''
  }
}

const isDev = import.meta.env.DEV

onMounted(async () => {
  if (isDev) {
    loading.value = false
    return
  }
  const results = await Promise.all(
    sources.map(s => fetchFeed(s.url, s.name, s.link)),
  )
  items.value = results.flat()
  loading.value = false
})

useSeo({
  title: 'Haberler',
  description: 'Vue, Nuxt ve web ekosisteminden düzenli takip ettiğim kaynaklar ve güncel içerikler.',
  canonicalPath: '/feed',
  type: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Haberler — Atlas Yiğit Aydın',
    'description': 'Vue, Nuxt ve web ekosisteminden düzenli takip edilen kaynaklar.',
    'url': 'https://atlaxt.me/feed',
    'inLanguage': 'tr-TR',
    'author': {
      '@type': 'Person',
      'name': 'Atlas Yiğit Aydın',
      'url': 'https://atlaxt.me',
    },
  },
})
</script>

<template>
  <div class="px-8 py-16">
    <PageHeader :crumbs="[{ label: 'Haberler', to: '/feed' }]" />

    <p v-if="isDev" class="text-xs font-mono mb-10" style="color: var(--text-muted); opacity: 0.35;">
      -- local ortamda haberler yüklenmiyor --
    </p>

    <!-- RSS Kaynakları (isteğe bağlı) -->
    <div class="mb-10 flex flex-col gap-3">
      <button
        type="button"
        class="text-xs px-3 py-1 transition-opacity self-start"
        :style="showRssSources ? 'background: var(--text); color: var(--bg);' : 'border: 1px solid var(--border); color: var(--text-muted); opacity: 0.6;'"
        @click="showRssSources = !showRssSources"
      >
        RSS kaynakları {{ showRssSources ? 'gizle' : 'göster' }}
      </button>

      <div v-if="showRssSources" style="border: 1px solid var(--border);">
        <div class="px-4 py-3" style="border-bottom: 1px solid var(--border);">
          <p class="text-xs uppercase tracking-widest" style="color: var(--text-muted); opacity: 0.6;">
            RSS Kaynakları
          </p>
        </div>

        <div class="px-4 py-3 flex flex-col gap-4">
          <div
            v-for="[cat, srcs] in rssCategories"
            :key="cat"
            class="flex flex-col gap-2"
          >
            <p class="text-xs" style="color: var(--text-muted); opacity: 0.5;">
              {{ cat }}
            </p>

            <div class="flex flex-col">
              <div
                v-for="src in srcs"
                :key="src.name"
                class="flex items-start justify-between gap-4 py-2"
                style="border-top: 1px solid var(--border);"
              >
                <div class="min-w-0">
                  <a
                    :href="src.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
                    style="color: var(--text);"
                  >
                    <img :src="favicon(src.link)" class="w-3 h-3 rounded-sm" alt="" aria-hidden="true">
                    <span class="truncate">{{ src.name }}</span>
                  </a>

                  <div class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.65;">
                    <a
                      :href="src.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="transition-opacity hover:opacity-100"
                      style="opacity: 0.9;"
                    >
                      {{ src.url }}
                    </a>
                  </div>
                </div>

                <a
                  :href="src.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs shrink-0 mt-0.5 transition-opacity hover:opacity-60"
                  style="color: var(--text-muted);"
                >
                  RSS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtre -->
    <div class="mb-10 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <button
          class="text-xs px-3 py-1 transition-opacity"
          :style="!selected.size ? 'background: var(--text); color: var(--bg);' : 'border: 1px solid var(--border); color: var(--text-muted); opacity: 0.6;'"
          @click="selected = new Set()"
        >
          Tümü
        </button>
      </div>
      <div
        v-for="[cat, srcs] in categories"
        :key="cat"
        class="flex items-center gap-2 flex-wrap"
      >
        <span class="text-xs w-16 shrink-0" style="color: var(--text-muted); opacity: 0.4;">{{ cat }}</span>
        <button
          v-for="src in srcs"
          :key="src.name"
          class="inline-flex items-center gap-1.5 text-xs px-3 py-1 transition-opacity"
          :style="selected.has(src.name) ? 'background: var(--text); color: var(--bg);' : 'border: 1px solid var(--border); color: var(--text-muted); opacity: 0.6;'"
          @click="toggle(src.name)"
        >
          <img :src="favicon(src.link)" class="w-3 h-3 rounded-sm" alt="" aria-hidden="true">
          {{ src.name }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-4">
      <div v-for="n in 6" :key="n" class="py-5" style="border-bottom: 1px solid var(--border);">
        <div class="h-3 w-2/3 mb-2" style="background: var(--bg-subtle);" />
        <div class="h-2.5 w-1/3" style="background: var(--bg-subtle);" />
      </div>
    </div>

    <!-- Liste -->
    <div v-else class="flex flex-col">
      <a
        v-for="item in filtered"
        :key="item.link"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-start justify-between gap-6 py-5 transition-opacity hover:opacity-60"
        style="border-bottom: 1px solid var(--border); color: var(--text);"
      >
        <div class="min-w-0">
          <p class="text-sm font-medium leading-snug mb-1.5 truncate">{{ item.title }}</p>
          <div class="flex items-center gap-2">
            <a
              :href="item.sourceLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs hover:opacity-100 transition-opacity"
              style="color: var(--text-muted); opacity: 0.6;"
              @click.stop
            >
              <img :src="favicon(item.sourceLink)" class="w-3 h-3 rounded-sm" alt="" aria-hidden="true">
              {{ item.source }}
            </a>
            <span style="color: var(--border);">·</span>
            <span
              class="text-xs font-medium"
              :style="isToday(item.date)
                ? 'color: var(--text);'
                : 'color: var(--text-muted); opacity: 0.5;'"
            >{{ formatDate(item.date) }}</span>
          </div>
        </div>
        <span class="text-sm shrink-0 mt-0.5" style="color: var(--text-muted);">↗</span>
      </a>

      <p v-if="!filtered.length" class="text-sm py-8" style="color: var(--text-muted); opacity: 0.4;">
        İçerik bulunamadı.
      </p>
    </div>
  </div>
</template>
