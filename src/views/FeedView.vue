<script setup lang="ts">
import type { FeedItem, FeedSource } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { fetchFeed } from '@/composables/useFeeds'
import { useSeo } from '@/seo/useSeo'
import feedsRaw from '../../content/feeds.yaml'

const sources = feedsRaw as unknown as FeedSource[]

const items = ref<FeedItem[]>([])
const loading = ref(true)
const selected = ref<string | null>(null)

const filtered = computed(() => {
  const base = items.value.slice().sort((a, b) => b.date.getTime() - a.date.getTime())
  if (!selected.value)
    return base
  return base.filter(i => i.source === selected.value)
})

const sourceNames = computed(() => [...new Set(items.value.map(i => i.source))])

function formatDate(d: Date): string {
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
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
  <div class="px-8 py-16 max-w-2xl">
    <div class="mb-10">
      <h1 class="text-xl font-semibold mb-3" style="color: var(--text);">
        Haberler
      </h1>
      <p class="text-sm leading-relaxed" style="color: var(--text-muted);">
        Takip ettiğim kaynaklardan toplanan güncel içerikler.
        Vue, Nuxt ve ekosisteminden kim ne yazıyor, ne yayınlıyor.
      </p>
    </div>

    <!-- Filtre -->
    <div class="flex items-center gap-2 flex-wrap mb-10">
      <button
        class="text-xs px-3 py-1 transition-opacity"
        :style="!selected ? 'background: var(--text); color: var(--bg);' : 'border: 1px solid var(--border); color: var(--text-muted); opacity: 0.6;'"
        @click="selected = null"
      >
        Tümü
      </button>
      <button
        v-for="name in sourceNames"
        :key="name"
        class="text-xs px-3 py-1 transition-opacity"
        :style="selected === name ? 'background: var(--text); color: var(--bg);' : 'border: 1px solid var(--border); color: var(--text-muted); opacity: 0.6;'"
        @click="selected = name"
      >
        {{ name }}
      </button>
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
              class="text-xs hover:opacity-100 transition-opacity"
              style="color: var(--text-muted); opacity: 0.6;"
              @click.stop
            >{{ item.source }}</a>
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
