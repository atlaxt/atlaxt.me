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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
