<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useColorMode } from '@/composables/useColorMode'
import signBlack from '/sign_black.png'
import signWhite from '/sign_white.png'

const { isDark, toggle: toggleColorMode } = useColorMode()
const route = useRoute()

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
let scrollLockY = 0

function onScroll() {
  scrolled.value = window.scrollY > 10
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function lockPageScroll() {
  scrollLockY = window.scrollY
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollLockY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
  document.body.style.touchAction = 'none'
}

function unlockPageScroll() {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  document.body.style.touchAction = ''
  window.scrollTo(0, scrollLockY)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMobileMenu()
  }
}

watch(() => route.fullPath, closeMobileMenu)

watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    lockPageScroll()
    return
  }
  unlockPageScroll()
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  unlockPageScroll()
})
</script>

<template>
  <header
    class="z-50 w-screen border-b border-transparent transition-all duration-300"
    :class="scrolled
      ? 'backdrop-blur-xs lg:backdrop-blur-none'
      : 'bg-transparent border-transparent'"
  >
    <div class="mx-auto flex items-center justify-between md:justify-end px-4 md:px-8 py-5 mt-2">
      <!-- Logo -->
      <RouterLink to="/" class="md:fixed md:left-8 left-4 z-50 transition-opacity hover:opacity-50" @click="closeMobileMenu">
        <img
          :src="isDark ? signWhite : signBlack"
          alt="Atlas"
          class="h-7 w-auto"
        >
      </RouterLink>

      <!-- Mobile actions -->
      <div class="flex items-center gap-3 md:hidden" style="color: var(--text-muted);">
        <button class="flex transition-opacity hover:opacity-60" aria-label="Renk modu" @click="toggleColorMode($event)">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </button>

        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-none transition-opacity hover:opacity-70"
          aria-label="Menuyu ac"
          :aria-expanded="mobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 12H10m10-7H4m16 14H4" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Desktop nav -->
      <nav class="label-micro hidden md:flex items-center gap-6">
        <RouterLink
          to="/projects"
          class="opacity-70 transition-opacity hover:opacity-100"
          style="color: var(--text-muted);"
          active-class="!opacity-100 !text-[color:var(--text)]"
        >
          Projeler
        </RouterLink>

        <RouterLink
          to="/blog"
          class="opacity-70 transition-opacity hover:opacity-100"
          style="color: var(--text-muted);"
          active-class="!opacity-100 !text-[color:var(--text)]"
        >
          Blog
        </RouterLink>

        <RouterLink
          to="/feed"
          class="opacity-70 transition-opacity hover:opacity-100"
          style="color: var(--text-muted);"
          active-class="!opacity-100 !text-[color:var(--text)]"
        >
          Haberler
        </RouterLink>

        <RouterLink
          to="/cli"
          class="group inline-flex items-center gap-1.5 rounded-none px-1.5 py-0.5 text-[11px] tracking-[0.08em] uppercase opacity-70 transition-opacity duration-200 hover:opacity-100"
          style="color: var(--text-muted); background-color: var(--bg-subtle);"
          active-class="!opacity-100 !text-[color:var(--text)]"
          aria-label="CLI"
        >
          <span class="opacity-85 group-hover:opacity-100">CLI</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-75 group-hover:opacity-100">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" x2="20" y1="19" y2="19" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-45 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-85">
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </RouterLink>

        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          class="flex transition-opacity hover:opacity-60 opacity-50"
          style="color: var(--text-muted);"
          aria-label="RSS Feed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <!-- Controls -->
        <div class="flex items-center gap-4" style="color: var(--text-muted);">
          <a
            href="https://github.com/atlaxt"
            target="_blank"
            rel="noopener noreferrer"
            class="flex transition-opacity hover:opacity-60"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.8 1.1 1.8 1.1 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.8-1.5-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.4.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.7 5 18.7 5.3 18.7 5.3c.6 1.7.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .3" />
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/atlaxt"
            target="_blank"
            rel="noopener noreferrer"
            class="flex transition-opacity hover:opacity-60"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          <a
            href="https://instagram.com/atlaxt.me"
            target="_blank"
            rel="noopener noreferrer"
            class="flex transition-opacity hover:opacity-60"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37a4 4 0 1 1-3.37-3.37 4 4 0 0 1 3.37 3.37Z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>

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

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-show="mobileMenuOpen"
        class="fixed inset-0 z-40 md:hidden"
        @click="closeMobileMenu"
      >
        <div class="mobile-menu-overlay absolute inset-0" />

        <nav
          class="mobile-menu-panel absolute left-4 right-4 top-[5.2rem] rounded-none p-4"
          style="background-color: var(--bg-subtle); border: 1px solid var(--border);"
          @click.stop
        >
          <div class="label-micro flex flex-col gap-3" style="color: var(--text-muted);">
            <RouterLink to="/projects" class="py-1.5 opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
              Projeler
            </RouterLink>
            <RouterLink to="/blog" class="py-1.5 opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
              Blog
            </RouterLink>
            <RouterLink to="/feed" class="py-1.5 opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
              Haberler
            </RouterLink>

            <RouterLink
              to="/cli"
              class="group mt-1 inline-flex w-fit items-center gap-1.5 rounded-none px-1.5 py-0.5 label-micro opacity-80 transition-opacity duration-200 hover:opacity-100"
              style="color: var(--text-muted); background-color: var(--bg);"
              active-class="!opacity-100 !text-[color:var(--text)]"
              aria-label="CLI"
              @click="closeMobileMenu"
            >
              <span class="opacity-85 group-hover:opacity-100">CLI</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-75 group-hover:opacity-100">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" x2="20" y1="19" y2="19" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-45 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-85">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </RouterLink>

            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 py-1.5 opacity-85 transition-opacity hover:opacity-100"
              style="color: var(--text-muted);"
              aria-label="RSS Feed"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
              </svg>
              RSS
            </a>

            <div class="mt-2 h-px" style="background-color: var(--border);" />

            <div class="flex items-center gap-4 pt-1" style="color: var(--text-muted);">
              <a href="https://github.com/atlaxt" target="_blank" rel="noopener noreferrer" class="flex transition-opacity hover:opacity-60" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.8 1.1 1.8 1.1 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.8-1.5-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.4.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.7 5 18.7 5.3 18.7 5.3c.6 1.7.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .3" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/atlaxt" target="_blank" rel="noopener noreferrer" class="flex transition-opacity hover:opacity-60" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://instagram.com/atlaxt.me" target="_blank" rel="noopener noreferrer" class="flex transition-opacity hover:opacity-60" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37a4 4 0 1 1-3.37-3.37 4 4 0 0 1 3.37 3.37Z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-menu-overlay {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.22s ease;
}

.mobile-menu-enter-active .mobile-menu-panel,
.mobile-menu-leave-active .mobile-menu-panel {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu-panel,
.mobile-menu-leave-to .mobile-menu-panel {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}
</style>
