<script setup lang="ts">
import { Analytics as VercelAnalytics } from '@vercel/analytics/vue'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import NewsTicker from '@/components/NewsTicker.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'

const transitionName = ref('fade')

const router = useRouter()
router.beforeEach((to, from) => {
  const isCli = (path: string) => path.startsWith('/cli')
  transitionName.value = (isCli(to.path) && isCli(from.path)) ? '' : 'fade'
})

const route = useRoute()
const showFooter = computed(() => !route.path.startsWith('/cli'))
</script>

<template>
  <VercelAnalytics />
  <VercelSpeedInsights />
  <div class="min-h-screen overflow-x-hidden" style="background: var(--bg); color: var(--text);">
    <!-- <ArtPlum /> -->
    <AppHeader />
    <div class="max-w-4xl mx-auto">
      <main>
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
