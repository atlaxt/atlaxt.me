<script setup lang="ts">
import type { Photo } from '@/types'
import { computed, onUnmounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useSeo } from '@/seo/useSeo'
import photosRaw from '../../content/photos.yaml'

const photos = photosRaw as unknown as Photo[]

function vercelImage(file: string, w: number, q: number) {
  return `/_vercel/image?url=${encodeURIComponent(`/photos/${file}`)}&w=${w}&q=${q}`
}

function thumb(file: string) {
  if (import.meta.env.DEV)
    return `/photos/${file}`
  return vercelImage(file, 640, 60)
}

function full(file: string) {
  if (import.meta.env.DEV)
    return `/photos/${file}`
  return vercelImage(file, 1920, 85)
}

function thumbSrcSet(file: string): string | undefined {
  if (import.meta.env.DEV)
    return undefined
  return [
    `${vercelImage(file, 384, 55)} 384w`,
    `${vercelImage(file, 640, 60)} 640w`,
    `${vercelImage(file, 828, 70)} 828w`,
  ].join(', ')
}

function direct(file: string) {
  return `/photos/${file}`
}

function onImgError(e: Event, file: string) {
  const el = e.target as HTMLImageElement | null
  if (!el)
    return
  const fallback = direct(file)
  // Döngüye girmesin
  if (el.src.endsWith(fallback))
    return
  el.srcset = ''
  el.src = fallback
}

// Lightbox
const lightboxIndex = ref<number | null>(null)

const currentPhoto = computed(() => {
  const i = lightboxIndex.value
  if (i === null)
    return null
  return photos[i] ?? null
})

function prev() {
  if (lightboxIndex.value === null)
    return
  if (!photos.length) {
    close()
    return
  }
  lightboxIndex.value = (lightboxIndex.value - 1 + photos.length) % photos.length
}

function next() {
  if (lightboxIndex.value === null)
    return
  if (!photos.length) {
    close()
    return
  }
  lightboxIndex.value = (lightboxIndex.value + 1) % photos.length
}

function open(i: number) {
  lightboxIndex.value = i
  document.body.style.overflow = 'hidden'
}

function close() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

const suppressNextClick = ref(false)
const touch = ref<{ x: number, y: number, t: number } | null>(null)

function onOverlayClick() {
  if (suppressNextClick.value) {
    suppressNextClick.value = false
    return
  }
  close()
}

function onTouchStart(e: TouchEvent) {
  if (lightboxIndex.value === null)
    return
  if (e.touches.length !== 1)
    return
  const p = e.touches[0]!
  touch.value = { x: p.clientX, y: p.clientY, t: performance.now() }
}

function onTouchEnd(e: TouchEvent) {
  if (!touch.value)
    return
  const end = e.changedTouches[0]
  if (!end) {
    touch.value = null
    return
  }

  const dx = end.clientX - touch.value.x
  const dy = end.clientY - touch.value.y
  const dt = performance.now() - touch.value.t
  touch.value = null

  // Yatay swipe: yeterince uzun + dikeyden belirgin + hızlı
  if (dt > 900)
    return
  if (Math.abs(dx) < 50)
    return
  if (Math.abs(dx) < Math.abs(dy) * 1.2)
    return

  suppressNextClick.value = true
  if (dx < 0)
    next()
  else
    prev()
}

function onTouchCancel() {
  touch.value = null
}

function onKey(e: KeyboardEvent) {
  if (lightboxIndex.value === null)
    return
  if (!photos.length) {
    close()
    return
  }
  if (e.key === 'ArrowLeft')
    prev()
  else if (e.key === 'ArrowRight')
    next()
  else
    close()
}

window.addEventListener('keydown', onKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  'name': 'Fotoğraflar — Atlas Yiğit Aydın',
  'description': 'Objektifimden kareler.',
  'url': 'https://atlaxt.me/photos',
  'author': {
    '@type': 'Person',
    'name': 'Atlas Yiğit Aydın',
    'url': 'https://atlaxt.me',
  },
}

useSeo({
  title: 'Fotoğraflar',
  description: 'Objektifimden kareler. Seyahat, mimari ve gündelik hayattan fotoğraflar.',
  canonicalPath: '/photos',
  type: 'website',
  jsonLd,
})
</script>

<template>
  <div class="px-8 py-16">
    <PageHeader :crumbs="[{ label: 'Fotoğraflar', to: '/photos' }]" />
    <!-- Masonry grid -->
    <div v-if="photos.length" class="masonry-grid">
      <button
        v-for="(photo, i) in photos"
        :key="photo.file"
        class="masonry-item group"
        @click="open(i)"
      >
        <img
          :src="thumb(photo.file)"
          :alt="photo.alt ?? photo.file"
          :srcset="thumbSrcSet(photo.file)"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
          class="no-drag w-full block transition-opacity duration-300 group-hover:opacity-80"
          loading="lazy"
          decoding="async"
          draggable="false"
          @dragstart.prevent
          @error="onImgError($event, photo.file)"
        >
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="currentPhoto"
          class="fixed inset-0 z-50 flex items-center justify-center"
          style="background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);"
          @click="onOverlayClick"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
          @touchcancel="onTouchCancel"
        >
          <!-- Fotoğraf -->
          <img
            :src="full(currentPhoto.file)"
            :alt="currentPhoto.alt ?? currentPhoto.file"
            class="no-drag max-h-[90vh] max-w-[90vw] object-contain"
            draggable="false"
            @dragstart.prevent
            @error="onImgError($event, currentPhoto.file)"
          >
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.masonry-grid {
  columns: 3 220px;
  gap: 8px;
}

.masonry-item {
  position: relative;
  display: block;
  break-inside: avoid;
  margin-bottom: 8px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

@media (max-width: 640px) {
  .masonry-grid {
    columns: 2 160px;
  }
}

/* Lightbox transition */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.2s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

.no-drag {
  -webkit-user-drag: none;
  user-select: none;
}
</style>
