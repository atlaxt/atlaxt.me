<script setup lang="ts">
import VercelAnalytics from '@vercel/analytics'
import VercelSpeedInsights from '@vercel/speed-insights'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <VercelAnalytics />
  <VercelSpeedInsights />
  <div class="min-h-screen" style="background: var(--bg); color: var(--text);">
    <div class="max-w-4xl mx-auto">
      <AppHeader />
      <main>
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
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
