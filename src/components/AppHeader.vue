<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import signBlack from '@/assets/sign_black.png'
import signWhite from '@/assets/sign_white.png'
import { useColorMode } from '@/composables/useColorMode'

const { isDark, toggle: toggleColorMode } = useColorMode()

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300"
    :style="{
      background: scrolled
        ? 'color-mix(in srgb, var(--bg) 85%, transparent)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    }"
  >
    <div class="flex items-center justify-between px-8 py-5">
      <!-- Logo -->
      <RouterLink to="/" class="transition-opacity hover:opacity-50">
        <img
          :src="isDark ? signWhite : signBlack"
          alt="Atlas"
          class="h-7 w-auto"
        >
      </RouterLink>

      <!-- Nav -->
      <nav class="flex items-center gap-8">
        <RouterLink
          to="/writings"
          class="text-sm transition-opacity hover:opacity-100"
          style="color: var(--text-muted);"
          active-class="!opacity-100 !text-[color:var(--text)]"
        >
          Yazılar
        </RouterLink>
        <!-- <RouterLink
          to="/about"
          class="text-sm transition-opacity hover:opacity-100"
          style="color: var(--text-muted);"
          active-class="!opacity-100 !text-[color:var(--text)]"
        >
          Hakkımda
        </RouterLink> -->

        <RouterLink
          to="/feed"
          class="text-sm transition-opacity hover:opacity-100"
          style="color: var(--text-muted);"
          active-class="!opacity-100 !text-[color:var(--text)]"
        >
          Haberler
        </RouterLink>

        <RouterLink
          to="/cli"
          class="text-sm transition-opacity hover:opacity-100"
          style="color: var(--text-muted);"
          active-class="!opacity-100 !text-[color:var(--text)]"
        >
          CLI
        </RouterLink>

        <!-- Controls -->
        <div class="flex items-center gap-4" style="color: var(--text-muted);">
          <button class="flex transition-opacity hover:opacity-60" @click="toggleColorMode($event)">
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>
