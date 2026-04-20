<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SocialIcon from '@/components/SocialIcon.vue'
import { useColorMode } from '@/composables/useColorMode'
import { getSocial } from '@/data/socials'
import signBlack from '/sign_black.png'
import signWhite from '/sign_white.png'

const gh = getSocial('github')
const li = getSocial('linkedin')
const rss = getSocial('rss')

const { isDark, toggle: toggleColorMode } = useColorMode()
const route = useRoute()

// Side nav şimdilik yoruma alındı — aktif edilince bu blok açılacak
// const { subTitle, subParent, tocItems } = usePageContext()
// const activeHeadingId = ref<string | null>(null)
// let tocObserver: IntersectionObserver | null = null
// function scrollToHeading(id: string) { ... }
// function setupTocObserver() { ... }
// watch(tocItems, setupTocObserver, { immediate: true })

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
let scrollLockY = 0

function onScroll() {
  scrolled.value = window.scrollY > 120
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
      <nav class="label-micro hidden md:flex flex-wrap justify-end items-center gap-x-8 gap-y-3">
        <!-- Text links group -->
        <div class="flex items-center gap-8 shrink-0">
          <RouterLink
            to="/"
            class="opacity-70 transition-opacity hover:opacity-100"
            style="color: var(--text-muted);"
            active-class="!opacity-100 !text-[color:var(--text)]"
          >
            Ana Sayfa
          </RouterLink>

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
            to="/notes"
            class="opacity-70 transition-opacity hover:opacity-100"
            style="color: var(--text-muted);"
            active-class="!opacity-100 !text-[color:var(--text)]"
          >
            Notlar
          </RouterLink>

          <RouterLink
            to="/feed"
            class="feed-link transition-opacity"
            active-class="!opacity-100"
          >
            Haberler
          </RouterLink>

          <RouterLink
            to="/contact"
            class="opacity-70 transition-opacity hover:opacity-100"
            style="color: var(--text-muted);"
            active-class="!opacity-100 !text-[color:var(--text)]"
          >
            İletişim
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
        </div>

        <!-- Icons group (wraps to next line when tight) -->
        <div class="flex items-center gap-8">
          <RouterLink
            to="/photos"
            class="flex opacity-70 transition-opacity hover:opacity-100 header-icon-link"
            style="color: var(--text-muted);"
            active-class="!opacity-100 !text-[color:var(--text)]"
            aria-label="Fotoğraflar"
          >
            <SocialIcon name="photos" />
          </RouterLink>

          <RouterLink
            to="/books"
            class="flex opacity-55 transition-opacity hover:opacity-100 header-icon-link"
            style="color: var(--text-muted);"
            active-class="!opacity-100 !text-[color:var(--text)]"
            aria-label="Kitaplar"
          >
            <SocialIcon name="books" />
          </RouterLink>

          <a
            :href="rss.href"
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

          <!-- Instagram icon -->
          <RouterLink to="/instagram" class="flex opacity-55 transition-opacity hover:opacity-100 header-icon-link" style="color: var(--text-muted);" aria-label="Instagram">
            <SocialIcon name="instagram" />
          </RouterLink>

          <!-- Social dropdown -->
          <div class="social-wrap">
            <button class="social-trigger flex opacity-55 transition-opacity hover:opacity-100" aria-label="Sosyal medya">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
            </button>
            <div class="social-dropdown">
              <div class="social-dropdown-inner">
                <a :href="gh.href" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                  <SocialIcon name="github" />
                  <span>GitHub</span>
                </a>
                <a :href="li.href" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                  <SocialIcon name="linkedin" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <button class="flex transition-opacity hover:opacity-60" style="color: var(--text-muted);" @click="toggleColorMode($event)">
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

    <!-- Floating side nav (desktop) -->
    <!-- <div class="side-nav-wrap hidden md:flex" :class="{ 'is-scrolled': scrolled }">
      <div class="side-nav-content label-micro">
        <nav class="side-nav-links">
          <div class="side-nav-item">
            <RouterLink to="/" class="side-nav-link" active-class="side-nav-link--active">
              Ana Sayfa
            </RouterLink>
          </div>
          <div class="side-nav-item">
            <RouterLink to="/projects" class="side-nav-link" active-class="side-nav-link--active">
              Projeler
            </RouterLink>
          </div>
          <div class="side-nav-item">
            <RouterLink to="/blog" class="side-nav-link" :class="{ 'side-nav-link--active': route.path.startsWith('/blog') }">
              Blog
            </RouterLink>
            <Transition name="sub-item">
              <span v-if="subTitle && subParent === '/blog' && route.path.startsWith('/blog')" class="side-nav-sub">{{ subTitle }}</span>
            </Transition>
            <Transition name="toc-section">
              <nav v-if="tocItems.length && subParent === '/blog'" class="side-nav-toc">
                <button
                  v-for="item in tocItems"
                  :key="item.id"
                  class="toc-item"
                  :class="[
                    item.level === 3 && 'toc-item--h3',
                    activeHeadingId === item.id && 'toc-item--active',
                  ]"
                  @click="scrollToHeading(item.id)"
                >
                  <span class="toc-item-text">{{ item.text }}</span>
                  <span class="toc-dot" />
                </button>
              </nav>
            </Transition>
          </div>
          <div class="side-nav-item">
            <RouterLink to="/notes" class="side-nav-link" :class="{ 'side-nav-link--active': route.path.startsWith('/notes') }">
              Notlar
            </RouterLink>
            <Transition name="sub-item">
              <span v-if="subTitle && subParent === '/notes' && route.path.startsWith('/notes')" class="side-nav-sub">{{ subTitle }}</span>
            </Transition>
            <Transition name="toc-section">
              <nav v-if="tocItems.length && subParent === '/notes'" class="side-nav-toc">
                <button
                  v-for="item in tocItems"
                  :key="item.id"
                  class="toc-item"
                  :class="[
                    item.level === 3 && 'toc-item--h3',
                    activeHeadingId === item.id && 'toc-item--active',
                  ]"
                  @click="scrollToHeading(item.id)"
                >
                  <span class="toc-item-text">{{ item.text }}</span>
                  <span class="toc-dot" />
                </button>
              </nav>
            </Transition>
          </div>
          <div class="side-nav-item">
            <RouterLink to="/feed" class="side-nav-link side-nav-link--red" active-class="side-nav-link--active">
              Haberler
            </RouterLink>
          </div>
          <div class="side-nav-item">
            <RouterLink to="/contact" class="side-nav-link" active-class="side-nav-link--active">
              İletişim
            </RouterLink>
          </div>
          <div class="side-nav-item">
            <RouterLink
              to="/cli"
              class="side-nav-link side-nav-cli"
              :class="{ 'side-nav-link--active': route.path.startsWith('/cli') }"
            >
              <span>CLI</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" />
              </svg>
            </RouterLink>
          </div>
        </nav>

        <div class="side-nav-divider" />

        <div class="side-nav-icons">
          <RouterLink to="/photos" class="side-nav-icon-link" active-class="side-nav-link--active" aria-label="Fotoğraflar" style="color:var(--text-muted)">
            <SocialIcon name="photos" />
          </RouterLink>
          <RouterLink to="/books" class="side-nav-icon-link" active-class="side-nav-link--active" aria-label="Kitaplar" style="color:var(--text-muted)">
            <SocialIcon name="books" />
          </RouterLink>
        </div>

        <div class="side-nav-divider side-nav-divider--socials" />

        <div class="side-nav-icons side-nav-icons--socials">
          <a :href="rss.href" target="_blank" rel="noopener noreferrer" class="side-nav-icon-link" aria-label="RSS" style="color:var(--text-muted)">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <RouterLink to="/instagram" class="side-nav-icon-link" aria-label="Instagram" style="color:var(--text-muted)">
            <SocialIcon name="instagram" />
          </RouterLink>
        </div>

        <div class="side-nav-divider side-nav-divider--ext" />

        <div class="side-nav-icons side-nav-icons--ext">
          <a :href="gh.href" target="_blank" rel="noopener noreferrer" class="side-nav-icon-link" aria-label="GitHub" style="color:var(--text-muted)">
            <SocialIcon name="github" />
          </a>
          <a :href="li.href" target="_blank" rel="noopener noreferrer" class="side-nav-icon-link" aria-label="LinkedIn" style="color:var(--text-muted)">
            <SocialIcon name="linkedin" />
          </a>
        </div>
      </div>

      <div class="side-nav-trigger">
        <div class="side-nav-trigger-bar" />
        <div class="side-nav-trigger-ticks">
          <span /><span /><span />
        </div>
      </div>
    </div> -->

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
            <div class="flex flex-col gap-5">
              <RouterLink to="/" class="opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
                Ana Sayfa
              </RouterLink>
              <RouterLink to="/projects" class="opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
                Projeler
              </RouterLink>
              <RouterLink to="/blog" class="opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
                Blog
              </RouterLink>
              <RouterLink to="/notes" class="opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
                Notlar
              </RouterLink>
              <RouterLink to="/feed" class="feed-link transition-opacity hover:opacity-100" active-class="!opacity-100" @click="closeMobileMenu">
                Haberler
              </RouterLink>
              <RouterLink to="/contact" class="opacity-85 transition-opacity hover:opacity-100" active-class="!opacity-100 !text-[color:var(--text)]" @click="closeMobileMenu">
                İletişim
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
                :href="rss.href"
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
            </div>

            <div class="mt-1 h-px" style="background-color: var(--border);" />

            <div class="flex justify-between items-center gap-4" style="color: var(--text-muted);">
              <div class="flex items-center gap-4">
                <RouterLink
                  to="/photos"
                  class="flex opacity-55 transition-opacity hover:opacity-100 header-icon-link"
                  style="color: var(--text-muted);"
                  active-class="!opacity-100 !text-[color:var(--text)]"
                  aria-label="Fotoğraflar"
                >
                  <SocialIcon name="photos" />
                </RouterLink>

                <RouterLink
                  to="/books"
                  class="flex opacity-40 transition-opacity hover:opacity-100 header-icon-link"
                  style="color: var(--text-muted);"
                  active-class="!opacity-100 !text-[color:var(--text)]"
                  aria-label="Kitaplar"
                >
                  <SocialIcon name="books" />
                </RouterLink>
              </div>

              <div class="flex items-center gap-1">
                <a :href="gh.href" target="_blank" rel="noopener noreferrer" class="mobile-social-link" aria-label="GitHub">
                  <SocialIcon name="github" />
                </a>
                <a :href="li.href" target="_blank" rel="noopener noreferrer" class="mobile-social-link" aria-label="LinkedIn">
                  <SocialIcon name="linkedin" />
                </a>
                <RouterLink to="/instagram" class="mobile-social-link" aria-label="Instagram">
                  <SocialIcon name="instagram" />
                </RouterLink>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.social-link :deep(.social-icon svg) {
  width: 14px;
  height: 14px;
}

.feed-link {
  color: #c8232c;
  opacity: 0.75;
}

.feed-link:hover {
  opacity: 1;
}

.header-icon-link :deep(.social-icon svg) {
  width: 15px;
  height: 15px;
}

/* ── Social dropdown ──────────────────────────────────── */
.social-wrap {
  position: relative;
}

.social-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 10px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
  transition-delay: 120ms;
}

.social-dropdown-inner {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 0.3rem 0;
  min-width: 130px;
}

.social-wrap:hover .social-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
  transition-delay: 0ms;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.12s ease;
}

.social-link:hover {
  opacity: 1;
}

/* ── Mobile social links ──────────────────────────────── */
.mobile-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--text-muted);
  opacity: 0.6;
  transition: opacity 0.15s ease;
}

.mobile-social-link :deep(.social-icon svg) {
  width: 15px;
  height: 15px;
}

.mobile-social-link:hover {
  opacity: 1;
}

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

/* ── Floating side nav ────────────────────────────────── */
.side-nav-wrap {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  align-items: center;
  gap: 0;
}

/* Trigger zone — wide invisible hit area */
.side-nav-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 80px;
  padding-right: 14px;
  flex-shrink: 0;
  cursor: default;
  gap: 6px;
  position: relative;
}

/* Thin vertical bar */
.side-nav-trigger-bar {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5px;
  height: 32px;
  background: var(--text-muted);
  opacity: 0;
  border-radius: 2px;
  transition: opacity 0.3s ease, height 0.25s ease;
}

.side-nav-wrap.is-scrolled .side-nav-trigger-bar {
  opacity: 0.2;
}

/* Three tick marks crossing the bar */
.side-nav-trigger-ticks {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.side-nav-trigger-ticks span {
  display: block;
  width: 7px;
  height: 1.5px;
  background: var(--text-muted);
  opacity: 0;
  border-radius: 1px;
  transition: opacity 0.3s ease, width 0.25s ease;
}

.side-nav-wrap.is-scrolled .side-nav-trigger-ticks span {
  opacity: 0.25;
}

.side-nav-wrap:hover .side-nav-trigger-bar {
  opacity: 0.55;
  height: 48px;
}

.side-nav-wrap:hover .side-nav-trigger-ticks span {
  opacity: 0.7;
  width: 10px;
}

/* Content panel */
.side-nav-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  padding-right: 12px;
  pointer-events: none;
}

.side-nav-wrap:hover .side-nav-content {
  pointer-events: auto;
}

/* Text links */
.side-nav-links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

.side-nav-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.side-nav-sub {
  display: block;
  font-size: 0.6rem;
  letter-spacing: 0.03em;
  color: var(--text-muted);
  opacity: 0;
  max-width: 20ch;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.sub-item-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.sub-item-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.sub-item-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.sub-item-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.side-nav-link {
  color: var(--text-muted);
  text-decoration: none;
  opacity: 0;
  transform: translateX(0);
  transition: opacity 0.3s ease, color 0.15s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.side-nav-wrap.is-scrolled .side-nav-link {
  opacity: 0.12;
}

.side-nav-wrap.is-scrolled .side-nav-sub {
  opacity: 0.5;
}

.side-nav-wrap:hover .side-nav-link {
  opacity: 0.55;
}

.side-nav-wrap:hover .side-nav-sub {
  opacity: 0.45;
}

.side-nav-link:hover {
  opacity: 1 !important;
}

.side-nav-wrap.is-scrolled .side-nav-link--active {
  opacity: 0.9 !important;
  color: var(--text) !important;
}

.side-nav-wrap.is-scrolled .side-nav-link--active ~ .side-nav-sub {
  opacity: 0.45;
}

.side-nav-link--red {
  color: #c8232c;
}

.side-nav-cli {
  opacity: 0;
}

/* Divider */
.side-nav-divider {
  width: 24px;
  height: 1px;
  background: var(--border);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.side-nav-wrap.is-scrolled .side-nav-divider {
  opacity: 0.15;
}

.side-nav-wrap:hover .side-nav-divider {
  opacity: 0.6;
}

/* Icon rows */
.side-nav-icons {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.side-nav-wrap.is-scrolled .side-nav-icons {
  opacity: 0.12;
}

.side-nav-wrap:hover .side-nav-icons {
  opacity: 1;
}

.side-nav-icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.45;
  transition: opacity 0.15s ease;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.side-nav-icon-link :deep(.social-icon svg) {
  width: 14px;
  height: 14px;
}

.side-nav-icon-link:hover {
  opacity: 1;
}

/* ── TOC ──────────────────────────────────────────────── */
.side-nav-toc {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.side-nav-wrap.is-scrolled .side-nav-toc {
  opacity: 0.65;
}

.side-nav-wrap:hover .side-nav-toc {
  opacity: 1;
}

/* each TOC row */
.toc-item {
  background: none;
  border: none;
  padding: 2px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  color: var(--text-muted);
  opacity: 0.5;
  transition: opacity 0.15s ease, color 0.15s ease;
  text-transform: none;
  font-family: inherit;
  font-size: 0.6rem;
  letter-spacing: 0.04em;
  line-height: 1.4;
  font-weight: 400;
}

/* text clamped so dot stays visible */
.toc-item-text {
  max-width: 18ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

/* active indicator dot */
.toc-dot {
  flex-shrink: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
}

/* h3 — visually subordinate */
.toc-item--h3 {
  font-size: 0.54rem;
  opacity: 0.35;
  padding-right: 10px;
}

/* active state */
.toc-item--active {
  opacity: 1 !important;
  color: var(--text);
  font-weight: 500;
}

.toc-item--active .toc-dot {
  opacity: 1;
  background: var(--text);
}

.toc-item:hover {
  opacity: 0.9 !important;
}

.toc-section-enter-active,
.toc-section-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toc-section-enter-from,
.toc-section-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* appearance/disappearance of the whole wrap */
.side-nav-fade-enter-active {
  transition: opacity 0.4s ease;
}
.side-nav-fade-leave-active {
  transition: opacity 0.25s ease;
}
.side-nav-fade-enter-from,
.side-nav-fade-leave-to {
  opacity: 0;
}
</style>
