<script setup lang="ts">
import type { FeedItem, FeedSource } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { fetchFeed } from '@/composables/useFeeds'
import { useSeo } from '@/seo/useSeo'
import feedsRaw from '../../content/feeds.yaml'

const sources = feedsRaw as unknown as FeedSource[]

const items = ref<FeedItem[]>([])
const loading = ref(true)
const selected = ref<Set<string>>(new Set())

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

function formatDate(d: Date): string {
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

onMounted(async () => {
  const results = await Promise.all(
    sources.map(s => fetchFeed(s.url, s.name, s.link)),
  )
  items.value = results.flat()
  loading.value = false
})

useSeo({
  title: 'Haberler',
  description: 'Vue, Nuxt ve ekosisteminden takip ettiğim güncel içerikler.',
  canonicalPath: '/feed',
  type: 'website',
})
</script>

<template>
  <div class="px-8 py-16">
    <div class="mb-10">
      <h1 class="text-xl font-semibold mb-3" style="color: var(--text);">
        Haberler
      </h1>
      <p class="text-sm leading-relaxed" style="color: var(--text-muted);">
        Düzenli okuduğum kaynaklar. Benimle aynı yolda gidiyorsanız işinize yarayabilir.
      </p>
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
            <span class="text-xs" style="color: var(--text-muted); opacity: 0.5;">{{ formatDate(item.date) }}</span>
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
