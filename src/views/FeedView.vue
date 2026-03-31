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
const highlightedLink = ref<string | null>(null)

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

onMounted(async () => {
  // Dev modda mock data
  if (import.meta.env.DEV) {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    items.value = [
      // Bugün (3)
      { title: 'Vue 3.5 Composition API ile Dynamic Forms', link: 'https://example.com/1', date: today, source: 'Vue Blog', sourceLink: 'https://blog.vuejs.org' },
      { title: 'Nuxt 4 Yeni Server Route Configuration', link: 'https://example.com/2', date: today, source: 'Nuxt', sourceLink: 'https://nuxt.com' },
      { title: 'TypeScript 5.4 Type Inference Improvements', link: 'https://example.com/3', date: today, source: 'TypeScript', sourceLink: 'https://typescriptlang.org' },
      // Dün (5)
      { title: 'Vite 6.0 Plugin System Enhancements', link: 'https://example.com/4', date: yesterday, source: 'Vite', sourceLink: 'https://vitejs.dev' },
      { title: 'Web Components Best Practices 2026', link: 'https://example.com/5', date: yesterday, source: 'MDN', sourceLink: 'https://mdn.org' },
      { title: 'React 19 Async Component Features', link: 'https://example.com/6', date: yesterday, source: 'React', sourceLink: 'https://react.dev' },
      { title: 'Next.js 15 Performance Metrics', link: 'https://example.com/7', date: yesterday, source: 'Vercel', sourceLink: 'https://vercel.com' },
      { title: 'Tailwind CSS v4 New Features', link: 'https://example.com/8', date: yesterday, source: 'Tailwind', sourceLink: 'https://tailwindcss.com' },
      // 2 gün önce (7)
      { title: 'Node.js 22 LTS Release Notes', link: 'https://example.com/9', date: twoDaysAgo, source: 'Node.js', sourceLink: 'https://nodejs.org' },
      { title: 'Webpack 6 Migration Guide', link: 'https://example.com/10', date: twoDaysAgo, source: 'Webpack', sourceLink: 'https://webpack.js.org' },
      { title: 'GraphQL Best Practices 2026', link: 'https://example.com/11', date: twoDaysAgo, source: 'Apollo', sourceLink: 'https://apollographql.com' },
      { title: 'Svelte 5 Framework Update', link: 'https://example.com/12', date: twoDaysAgo, source: 'Svelte', sourceLink: 'https://svelte.dev' },
      { title: 'Web Assembly Performance Tips', link: 'https://example.com/13', date: twoDaysAgo, source: 'MDN', sourceLink: 'https://mdn.org' },
      { title: 'Docker Container Optimization', link: 'https://example.com/14', date: twoDaysAgo, source: 'Docker', sourceLink: 'https://docker.com' },
      { title: 'Kubernetes Cost Reduction', link: 'https://example.com/15', date: twoDaysAgo, source: 'CNCF', sourceLink: 'https://cncf.io' },
      // 3 gün önce (7)
      { title: 'Rust Async/Await Patterns', link: 'https://example.com/16', date: threeDaysAgo, source: 'Rust', sourceLink: 'https://rust-lang.org' },
      { title: 'Python 3.13 What\'s New', link: 'https://example.com/17', date: threeDaysAgo, source: 'Python', sourceLink: 'https://python.org' },
      { title: 'Go 1.23 Release Review', link: 'https://example.com/18', date: threeDaysAgo, source: 'Go', sourceLink: 'https://golang.org' },
      { title: 'Java 23 Virtual Threads', link: 'https://example.com/19', date: threeDaysAgo, source: 'Java', sourceLink: 'https://java.com' },
      { title: 'Kubernetes 1.31 Features', link: 'https://example.com/20', date: threeDaysAgo, source: 'CNCF', sourceLink: 'https://cncf.io' },
      { title: 'AWS Lambda Performance', link: 'https://example.com/21', date: threeDaysAgo, source: 'AWS', sourceLink: 'https://aws.amazon.com' },
      { title: 'Web Security Headers Guide', link: 'https://example.com/22', date: threeDaysAgo, source: 'OWASP', sourceLink: 'https://owasp.org' },
    ]
    loading.value = false

    // Global highlight state'i kontrol et (DEV modda da)
    if ((window as any).feedHighlightedItem) {
      highlightedLink.value = (window as any).feedHighlightedItem as string;
      (window as any).feedHighlightedItem = null
      // 3 saniye sonra highlight'ı kaldır
      setTimeout(() => {
        highlightedLink.value = null
      }, 3000)
    }
    return
  }

  // Haberler yükleniyor (prod)
  const feedSources = feedsRaw as unknown as FeedSource[]
  const results = await Promise.all(
    feedSources.map(s => fetchFeed(s.url, s.name, s.link)),
  )
  items.value = results.flat()
  loading.value = false

  // Global highlight state'i kontrol et
  if ((window as any).feedHighlightedItem) {
    highlightedLink.value = (window as any).feedHighlightedItem as string;
    (window as any).feedHighlightedItem = null
    // 3 saniye sonra highlight'ı kaldır
    setTimeout(() => {
      highlightedLink.value = null
    }, 3000)
  }
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
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'Haberler', to: '/feed' }]" />

    <div class="page-intro">
      <p class="page-intro-title">
        Takip ettiğim yazılar.
      </p>
      <p class="page-intro-sub">
        Benimle aynı yolda ilerliyorsanız işinize yarayabilir.
      </p>
    </div>

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
        class="flex p-1 items-start justify-between gap-6 py-5 transition-opacity hover:opacity-60" :class="[
          highlightedLink === item.link && 'feed-item-highlight',
        ]"
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

<style scoped>
.page-intro {
  margin-bottom: 2rem;
}

.page-intro-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.3rem;
}

.page-intro-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
  opacity: 0.5;
}

@keyframes highlight-pulse {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: var(--bg-subtle);
  }
  100% {
    background-color: transparent;
  }
}

.feed-item-highlight {
  animation: highlight-pulse 0.8s ease-in-out 3 !important;
}
</style>
