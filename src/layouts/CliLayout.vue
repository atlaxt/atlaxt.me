<script setup lang="ts">
import type { ToolEntry } from '@/types'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useReadmeCache } from '@/composables/useReadmeCache'
import toolsRaw from '../../content/tools.yaml'

const tools = toolsRaw as unknown as ToolEntry[]

const route = useRoute()
const { preloadAll } = useReadmeCache()

const sidebarBorderStyle = 'border-right: 1px solid color-mix(in srgb, var(--border) 68%, transparent);'
const mobilePanelStyle = 'background-color: color-mix(in srgb, var(--bg-subtle) 92%, var(--bg)); border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);'

const mobileMenuOpen = ref(false)
let scrollLockY = 0

let desktopQuery: MediaQueryList | null = null

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
}

function unlockPageScroll() {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollLockY)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMobileMenu()
  }
}

function syncGlobalScrollLock() {
  const lockScroll = desktopQuery?.matches ?? false
  document.documentElement.classList.toggle('cli-scroll-lock', lockScroll)
  document.body.classList.toggle('cli-scroll-lock', lockScroll)
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
  preloadAll(tools.map(t => t.package))

  desktopQuery = window.matchMedia('(min-width: 768px)')
  syncGlobalScrollLock()
  desktopQuery.addEventListener('change', syncGlobalScrollLock)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  desktopQuery?.removeEventListener('change', syncGlobalScrollLock)
  window.removeEventListener('keydown', onKeydown)
  unlockPageScroll()
  document.documentElement.classList.remove('cli-scroll-lock')
  document.body.classList.remove('cli-scroll-lock')
})
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh-57px)] md:h-[calc(100vh-57px)] md:flex-row md:overflow-hidden">
    <!-- Sidebar -->
    <aside class="hidden md:flex md:h-full flex-col w-52 shrink-0 px-2 md:px-0" :style="sidebarBorderStyle">
      <nav class="flex h-full flex-col gap-1 overflow-y-auto py-16 pr-2">
        <!-- Giriş -->
        <RouterLink
          to="/cli"
          class="text-sm py-1 transition-opacity hover:opacity-100"
          :style="route.path === '/cli' ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
        >
          Giriş
        </RouterLink>

        <!-- Templates -->
        <RouterLink
          to="/cli/templates"
          class="text-sm py-1 transition-opacity hover:opacity-100"
          :style="route.path === '/cli/templates' ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
        >
          Templates
        </RouterLink>

        <!-- Tools + liste -->
        <div>
          <RouterLink
            to="/cli/tools"
            class="text-sm py-1 transition-opacity hover:opacity-100"
            :style="route.path === '/cli/tools' ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
          >
            Tools
          </RouterLink>

          <div class="flex flex-col mt-1 ml-3">
            <RouterLink
              v-for="tool in tools"
              :key="tool.id"
              :to="`/cli/tools/${tool.id}`"
              class="text-xs py-1 text-left transition-opacity hover:opacity-100"
              :style="route.path === `/cli/tools/${tool.id}` ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
            >
              {{ tool.package.split('/')[1] }}
            </RouterLink>
          </div>
        </div>
      </nav>
    </aside>
    <div class="px-4 pt-4 md:hidden">
      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-none transition-opacity hover:opacity-70"
        :aria-expanded="mobileMenuOpen"
        aria-label="CLI menusunu ac"
        style="color: var(--text-muted); border: 1px solid color-mix(in srgb, var(--border) 58%, transparent);"
        @click="toggleMobileMenu"
      >
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12H10m10-7H4m16 14H4" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </button>
    </div>

    <Transition name="cli-mobile-menu">
      <div
        v-show="mobileMenuOpen"
        class="fixed inset-0 z-40 md:hidden"
        @click="closeMobileMenu"
      >
        <div class="cli-mobile-overlay absolute inset-0" />

        <nav
          class="cli-mobile-panel absolute left-4 right-4 top-[5.2rem] rounded-none p-4"
          :style="mobilePanelStyle"
          @click.stop
        >
          <div class="flex flex-col gap-2 text-[12px] tracking-[0.05em] uppercase" style="color: var(--text-muted);">
            <RouterLink to="/cli" class="py-1.5 opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
              Giriş
            </RouterLink>
            <RouterLink to="/cli/templates" class="py-1.5 opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
              Templates
            </RouterLink>
            <RouterLink
              to="/cli/tools"
              class="flex items-center justify-between py-1.5 opacity-85 transition-opacity hover:opacity-100"
              :class="route.path.startsWith('/cli/tools') ? 'opacity-100! text-ink!' : ''"
              @click="closeMobileMenu"
            >
              <span>Tools</span>
            </RouterLink>

            <div class="-mt-2 max-h-[38vh] overflow-y-auto pr-1" style="border-left: 1px solid color-mix(in srgb, var(--border) 58%, transparent);">
              <div class="flex flex-col gap-1.5 py-1 pl-2.5 text-[11px] tracking-[0.02em] normal-case">
                <RouterLink
                  v-for="tool in tools"
                  :key="tool.id"
                  :to="`/cli/tools/${tool.id}`"
                  class="py-1 opacity-72 transition-opacity hover:opacity-100"
                  :class="route.path === `/cli/tools/${tool.id}` ? 'opacity-100! text-ink!' : ''"
                  @click="closeMobileMenu"
                >
                  {{ tool.package.split('/')[1] }}
                </RouterLink>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </Transition>

    <!-- İçerik -->
    <main class="flex-1 px-4 py-10 md:px-10 md:py-16 w-full md:h-full md:overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.cli-mobile-overlay {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.cli-mobile-menu-enter-active,
.cli-mobile-menu-leave-active {
  transition: opacity 0.22s ease;
}

.cli-mobile-menu-enter-active .cli-mobile-panel,
.cli-mobile-menu-leave-active .cli-mobile-panel {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.cli-mobile-menu-enter-from,
.cli-mobile-menu-leave-to {
  opacity: 0;
}

.cli-mobile-menu-enter-from .cli-mobile-panel,
.cli-mobile-menu-leave-to .cli-mobile-panel {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}
</style>
