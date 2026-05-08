<script setup lang="ts">
import { Analytics as VercelAnalytics } from '@vercel/analytics/vue'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import NewsTicker from '@/components/NewsTicker.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'
import AppFooter from './components/AppFooter.vue'

const transitionName = ref('fade')

const router = useRouter()
router.beforeEach((to, from) => {
  const isCli = (path: string) => path.startsWith('/cli')
  transitionName.value = (isCli(to.path) && isCli(from.path)) ? '' : 'fade'
})

const route = useRoute()
const showFooter = computed(() => !route.path.startsWith('/cli'))

const COOLDOWN_MS = 60 * 60 * 1000

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const source = params.has('cv') ? 'cv' : params.has('qr') ? 'qr' : null
  if (!source) return

  const { cv: _cv, qr: _qr, ...restQuery } = route.query
  router.replace({ query: restQuery })

  try {
    const storageKey = `visit_tracked_${source}`
    const lastTracked = Number(localStorage.getItem(storageKey) ?? 0)
    const now = Date.now()
    if (now - lastTracked < COOLDOWN_MS) return
    localStorage.setItem(storageKey, String(now))
  }
  catch {
    // localStorage unavailable (private browsing / iframe) — still send the request
  }

  fetch('/api/track-visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source }),
  }).catch(() => {})
})
</script>

<template>
  <VercelAnalytics />
  <VercelSpeedInsights />
  <div class="flex flex-col min-h-screen overflow-x-hidden" style="background: var(--bg); color: var(--text);">
    <!-- <ArtPlum /> -->
    <div class="site-banner-wrap">
      <a
        href="https://github.com/atlaxt/talks/blob/master/2026-05-08/src/examples/mushroom_exp.md"
        target="_blank"
        rel="noopener noreferrer"
        class="site-banner"
      >
        <span class="site-banner__text">Halisünasyon avı oyunu için gelenler buraya tıklayabilir</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="site-banner__icon">
          <path d="M7 17L17 7" /><path d="M8 7h9v9" />
        </svg>
      </a>
      <div class="site-banner-info">
        <button class="site-banner-info__trigger" aria-label="Oyun nedir?">
          oyun nedir?
        </button>
        <div class="site-banner-info__popover">
          <p>Bu yapay zeka cevabında tespit ettiğiniz halisünasyonu bana mail üzerinden atarak hediyenizi kazanabilirsiniz.</p>
          <a href="mailto:atlasyigitaydin@gmail.com" class="site-banner-info__mail">atlasyigitaydin@gmail.com</a>
        </div>
      </div>
    </div>
    <AppHeader />
    <div class="flex-1">
      <main class="max-w-4xl mx-auto min-h-screen">
        <RouterView v-slot="{ Component }">
          <Transition :name="transitionName" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
    <AppFooter v-if="showFooter" />
    <ScrollToTopButton />
    <NewsTicker />
  </div>
</template>

<style>
.site-banner-wrap {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border);
}

.site-banner {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.03em;
  opacity: 0.75;
  transition: opacity 0.15s ease;
}

.site-banner:hover {
  opacity: 1;
}

.site-banner__icon {
  flex-shrink: 0;
  opacity: 0.6;
}

.site-banner-info {
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 1rem;
}

.site-banner-info__trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  opacity: 0.45;
  padding: 0.25rem 0.5rem;
  border-left: 1px solid var(--border);
  transition: opacity 0.15s ease;
  white-space: nowrap;
  font-family: inherit;
}

.site-banner-info:hover .site-banner-info__trigger {
  opacity: 1;
}

.site-banner-info__popover {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 100;
}

.site-banner-info:hover .site-banner-info__popover {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.site-banner-info__popover p {
  font-size: 0.7rem;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0;
}

.site-banner-info__mail {
  font-size: 0.68rem;
  color: var(--text-muted);
  opacity: 0.6;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: opacity 0.12s ease;
}

.site-banner-info__mail:hover {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
