<script setup lang="ts">
import { Analytics as VercelAnalytics } from '@vercel/analytics/vue'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const transitionName = ref('fade')

const router = useRouter()
router.beforeEach((to, from) => {
  const isCli = (path: string) => path.startsWith('/cli')
  transitionName.value = (isCli(to.path) && isCli(from.path)) ? '' : 'fade'
})
</script>

<template>
  <VercelAnalytics />
  <VercelSpeedInsights />
  <div class="min-h-screen" style="background: var(--bg); color: var(--text);">
    <div class="max-w-4xl mx-auto">
      <AppHeader />
      <main>
        <RouterView v-slot="{ Component }">
          <Transition :name="transitionName" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
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
