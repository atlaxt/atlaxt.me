<script setup lang="ts">
import type { FeedItem, FeedSource } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColorMode } from '@/composables/useColorMode'
import { fetchFeed } from '@/composables/useFeeds'
import feedsRaw from '../../content/feeds.yaml'

const route = useRoute()
const router = useRouter()
const { isDark } = useColorMode()

const items = ref<FeedItem[]>([])
const dismissed = ref(false)

const show = computed(() =>
  !dismissed.value
  && items.value.length > 0
  && route.path !== '/feed',
)

// Seamless loop: içeriği ikile
const tickerItems = computed(() => [...items.value, ...items.value])

// Her item için yaklaşık ~6sn, minimum 20sn
const duration = computed(() => Math.max(items.value.length * 6, 20))

function isToday(d: Date): boolean {
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate()
}

onMounted(async () => {
  if (import.meta.env.DEV) {
    items.value = [
      { title: 'Vue 3.5 yeni özellikleri ve performans iyileştirmeleri', source: 'Vue Blog', link: '#', sourceLink: '#', date: new Date() },
      { title: 'Nuxt 4 yol haritası açıklandı', source: 'Nuxt', link: '#', sourceLink: '#', date: new Date() },
      { title: 'Vite 6.0 stabil sürümü yayında', source: 'Vite', link: '#', sourceLink: '#', date: new Date() },
    ]
    return
  }
  const sources = feedsRaw as unknown as FeedSource[]
  const results = await Promise.all(
    sources.map(s => fetchFeed(s.url, s.name, s.link)),
  )
  items.value = results
    .flat()
    .filter(i => isToday(i.date))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
})
</script>

<template>
  <Transition name="ticker-slide">
    <div
      v-if="show"
      class="news-ticker"
      :class="isDark ? 'ticker--light' : 'ticker--dark'"
    >
      <!-- Sol etiket -->
      <div class="ticker-label">
        bugün
      </div>

      <!-- Kayan içerik: tıklama /feed'e, başlık tıklaması habere -->
      <div class="ticker-viewport" @click="router.push('/feed')">
        <div
          class="ticker-track"
          :style="`animation-duration: ${duration}s`"
        >
          <div
            v-for="(item, i) in tickerItems"
            :key="`${item.link}-${i}`"
            class="ticker-item"
          >
            <span class="ticker-source">{{ item.source }}</span>
            <span class="ticker-sep">—</span>
            <a
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="ticker-title"
              @click.stop
            >{{ item.title }}</a>
          </div>
        </div>
      </div>

      <!-- Kapatma -->
      <button
        class="ticker-close"
        aria-label="Kapat"
        @click="dismissed = true"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.news-ticker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  height: 36px;
  overflow: hidden;
}

/* Ters tema */
.ticker--dark {
  background: #0a0a0a;
  color: #e5e5e5;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.ticker--light {
  background: #f5f5f5;
  color: #1a1a1a;
  border-top: 1px solid rgba(0,0,0,0.08);
}

/* Sol etiket */
.ticker-label {
  flex-shrink: 0;
  padding: 0 0.9rem;
  font-size: 0.55rem;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.45;
  border-right: 1px solid;
  height: 100%;
  display: flex;
  align-items: center;
}

.ticker--dark .ticker-label { border-color: rgba(255,255,255,0.1); }
.ticker--light .ticker-label { border-color: rgba(0,0,0,0.1); }

/* Viewport */
.ticker-viewport {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* Kayan şerit */
.ticker-track {
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  animation: ticker-scroll linear infinite;
  will-change: transform;
}

@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Tek haber */
.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 2.5rem;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.15s ease;
}

.ticker-item:hover {
  opacity: 0.6;
}

.ticker-source {
  font-size: 0.58rem;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.ticker-sep {
  opacity: 0.2;
  font-size: 0.6rem;
  flex-shrink: 0;
}

.ticker-title {
  font-size: 0.72rem;
  font-weight: 440;
}

/* Kapatma */
.ticker-close {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0.3;
  cursor: pointer;
  background: transparent;
  border: none;
  color: inherit;
  transition: opacity 0.15s ease;
  border-left: 1px solid;
}

.ticker--dark .ticker-close { border-color: rgba(255,255,255,0.1); }
.ticker--light .ticker-close { border-color: rgba(0,0,0,0.1); }

.ticker-close:hover {
  opacity: 0.7;
}

/* Giriş / çıkış animasyonu */
.ticker-slide-enter-active,
.ticker-slide-leave-active {
  transition: transform 0.3s ease;
}
.ticker-slide-enter-from,
.ticker-slide-leave-to {
  transform: translateY(100%);
}
</style>
