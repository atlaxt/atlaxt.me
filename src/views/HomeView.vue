<script setup lang="ts">
import type { Book, EducationEntry, ExperienceEntry, FeedItem, FeedSource, Photo, Post } from '@/types'
import { nextTick, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import SectionLabel from '@/components/SectionLabel.vue'
import SignParticle from '@/components/SignParticle.vue'
import { fetchFeed } from '@/composables/useFeeds'
import { useSeo } from '@/seo/useSeo'
import booksRaw from '../../content/books.yaml'
import educationRaw from '../../content/education.yaml'
import experienceRaw from '../../content/experience.yaml'
import feedsRaw from '../../content/feeds.yaml'
import photosRaw from '../../content/photos.yaml'

// ─── Son yazılar ────────────────────────────────────────────────
const modules = import.meta.glob('../../content/blogs/*.md', { eager: true })
const recentPosts = (Object.values(modules) as { default: Post }[])
  .map(m => m.default)
  .filter(p => p?.frontmatter)
  .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
  .slice(0, 3)

// ─── Son fotoğraflar ────────────────────────────────────────────
const recentPhotos = (photosRaw as unknown as Photo[]).slice(-3)

function thumb(file: string) {
  if (import.meta.env.DEV)
    return `/photos/${file}`
  return `/_vercel/image?url=${encodeURIComponent(`/photos/${file}`)}&w=400&q=65`
}

// ─── En beğenilen kitaplar ──────────────────────────────────────
const recentBooks = (booksRaw as unknown as Book[])
  .filter(b => b.name && b.rate)
  .sort((a, b) => Number.parseFloat(b.rate) - Number.parseFloat(a.rate))
  .slice(0, 3)

// ─── Son haberler ───────────────────────────────────────────────
const feedItems = ref<FeedItem[]>([])
const feedLoading = ref(true)

const HOME_SCROLL_KEY = 'home-scroll-y'

onBeforeRouteLeave(() => {
  sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY))
})

onMounted(async () => {
  const saved = sessionStorage.getItem(HOME_SCROLL_KEY)
  if (saved) {
    sessionStorage.removeItem(HOME_SCROLL_KEY)
    nextTick(() => window.scrollTo({ top: Number(saved), behavior: 'instant' }))
  }
  else {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (import.meta.env.DEV) {
    feedLoading.value = false
    return
  }
  const sources = feedsRaw as unknown as FeedSource[]
  const results = await Promise.all(
    sources.map(s => fetchFeed(s.url, s.name, s.link)),
  )
  feedItems.value = results
    .flat()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3)
  feedLoading.value = false
})

function favicon(url: string): string {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`
  }
  catch {
    return ''
  }
}

function isFeedToday(d: Date): boolean {
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate()
}

function feedDate(d: Date): string {
  if (isFeedToday(d))
    return 'Bugün'
  const yest = new Date()
  yest.setDate(yest.getDate() - 1)
  if (d.getFullYear() === yest.getFullYear() && d.getMonth() === yest.getMonth() && d.getDate() === yest.getDate())
    return 'Dün'
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

const isDev = import.meta.env.DEV

const links = [
  { label: 'GitHub', href: 'https://github.com/atlaxt', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/atlaxt', external: true },
  { label: 'Instagram', href: 'https://instagram.com/atlaxt.me', external: true },
]

// 'Halen' ise şu an; değilse verilen ay/yıl string'ini Date'e çevirir
const MONTH_MAP: Record<string, number> = {
  Oca: 0,
  Şub: 1,
  Mar: 2,
  Nis: 3,
  May: 4,
  Haz: 5,
  Tem: 6,
  Ağu: 7,
  Eyl: 8,
  Eki: 9,
  Kas: 10,
  Ara: 11,
}

function parseDate(str: string): Date {
  if (str === 'Halen')
    return new Date()
  const [mon, year] = str.split(' ')
  return new Date(Number.parseInt(year!), MONTH_MAP[mon!] ?? 0, 1)
}

function calcDuration(startStr: string, endStr: string): string {
  const start = parseDate(startStr)
  const end = parseDate(endStr)
  // LinkedIn gibi: başlangıç ve bitiş ayının ikisi de sayılır (+1 ay)
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
  if (months < 1)
    months = 1
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (years === 0)
    return `${rem} ay`
  if (rem === 0)
    return `${years} yıl`
  return `${years} yıl ${rem} ay`
}

const education = educationRaw as unknown as EducationEntry[]

const experience = experienceRaw as unknown as ExperienceEntry[]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://atlaxt.me/#person',
      'name': 'Atlas Yiğit Aydın',
      'url': 'https://atlaxt.me',
      'sameAs': [
        'https://github.com/atlaxt',
        'https://linkedin.com/in/atlaxt',
        'https://instagram.com/atlaxt.me',
      ],
      'jobTitle': 'Web Geliştirici',
      'worksFor': { '@type': 'Organization', 'name': 'trex Digital Manufacturing' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://atlaxt.me/#website',
      'url': 'https://atlaxt.me',
      'name': 'Atlas Yiğit Aydın',
      'description': 'Vue ekosistemine odaklanan web geliştirici.',
      'inLanguage': 'tr-TR',
      'author': { '@id': 'https://atlaxt.me/#person' },
    },
  ],
}

function setShineDuration(sec: number) {
  const el = document.querySelector('.shine-border')
  if (!el)
    return
  for (const anim of el.getAnimations({ subtree: true })) {
    if (anim instanceof CSSAnimation && anim.animationName === 'shine-sweep') {
      const oldDuration = (anim.effect?.getComputedTiming().duration as number) ?? 3000
      const progress = (anim.currentTime as number) / oldDuration
      anim.effect?.updateTiming({ duration: sec * 1000 })
      anim.currentTime = progress * sec * 1000
    }
  }
}

useSeo({
  title: 'Atlas Yiğit Aydın',
  description: 'Web geliştirici — Vue ekosistemine odaklanan, UX\'e önem veren.',
  canonicalPath: '/',
  type: 'website',
  jsonLd,
})
</script>

<template>
  <div>
    <!-- Hero: tam ekran yüksekliği -->
    <div class="flex h-[calc(100vh-57px)]">
      <!-- Sol: Bio -->
      <div class="flex flex-col justify-center px-8 py-12 w-full md:w-2/5 shrink-0">
        <h1 class="text-2xl font-semibold mb-4" style="color: var(--text);">
          Atlas Yiğit Aydın
        </h1>
        <p class="text-sm leading-relaxed max-w-xs" style="color: var(--text-muted);">
          Öncelikli olarak Nuxt ekosistemine odaklanan bir Web Geliştiricisiyim. Nihai hedefim, yalnızca işlevsel kod yazmanın ötesine geçerek her üründe üst düzey Kullanıcı Deneyimi (UX) sunmak.
        </p>
        <!-- Şu an çalışılan yer -->
        <div class="inline-flex items-center gap-2 mt-6 text-xs" style="color: #4ade80;">
          <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
          trex Digital Manufacturing'da çalışıyor
        </div>

        <RouterLink
          to="/cli"
          class="shine-border inline-flex items-center gap-3 mt-6 px-4 py-2 text-sm font-mono"
          style="color: var(--text-muted);"
          @mouseenter="setShineDuration(1.2)"
          @mouseleave="setShineDuration(3)"
        >
          <span style="color: var(--text-muted); opacity: 0.5;">$</span>
          <span style="color: var(--text);">npx atlaxt</span>
        </RouterLink>

        <div class="flex items-center gap-5 mt-6">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm transition-opacity hover:opacity-100 opacity-50"
            style="color: var(--text);"
          >{{ link.label }}</a>
        </div>

        <div class="flex items-center gap-5 mt-2">
          <RouterLink
            to="/books"
            class="text-sm transition-opacity hover:opacity-100 opacity-50"
            style="color: var(--text);"
          >
            Kitaplık
          </RouterLink>
          <RouterLink
            to="/photos"
            class="text-sm transition-opacity hover:opacity-100 opacity-50"
            style="color: var(--text);"
          >
            Fotoğraflar
          </RouterLink>
        </div>
      </div>

      <!-- Sağ: Particle imza -->
      <div class="hidden md:block flex-1 relative">
        <SignParticle class="absolute inset-0" />
      </div>
    </div>

    <!-- ─── Son yazılar ─────────────────────────────────────────── -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <div class="flex items-baseline justify-between mb-8">
        <SectionLabel>Yazılar</SectionLabel>
        <RouterLink
          to="/writings"
          class="text-xs transition-opacity hover:opacity-100 opacity-40"
          style="color: var(--text);"
        >
          tümü →
        </RouterLink>
      </div>
      <div class="flex flex-col">
        <RouterLink
          v-for="post in recentPosts"
          :key="post.slug"
          :to="`/writings/${post.slug}`"
          class="flex flex-col py-5 transition-opacity hover:opacity-70"
          style="border-bottom: 1px solid var(--border);"
        >
          <div class="flex items-baseline justify-between gap-8 mb-1">
            <span class="text-sm font-medium" style="color: var(--text);">{{ post.frontmatter.title }}</span>
            <span class="text-xs shrink-0 tabular-nums" style="color: var(--text-muted);">
              {{ new Date(post.frontmatter.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </span>
          </div>
          <p class="text-xs leading-relaxed" style="color: var(--text-muted);">
            {{ post.frontmatter.description }}
          </p>
        </RouterLink>
      </div>
    </div>

    <!-- ─── Son kitaplar ─────────────────────────────────────────── -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <div class="flex items-baseline justify-between mb-8">
        <SectionLabel>Kitaplık</SectionLabel>
        <RouterLink
          to="/books"
          class="text-xs transition-opacity hover:opacity-100 opacity-40"
          style="color: var(--text);"
        >
          tümü →
        </RouterLink>
      </div>
      <div class="flex flex-col">
        <div
          v-for="book in recentBooks"
          :key="book.number"
          class="flex items-baseline justify-between py-4"
          style="border-bottom: 1px solid var(--border);"
        >
          <div class="flex items-baseline gap-3 min-w-0">
            <span class="text-sm truncate" style="color: var(--text);">{{ book.name }}</span>
            <span class="text-xs shrink-0 hidden sm:inline" style="color: var(--text-muted);">{{ book.author }}</span>
          </div>
          <span v-if="book.rate" class="text-xs shrink-0 ml-6 tabular-nums" style="color: var(--text-muted);">
            {{ book.rate }} / 10
          </span>
        </div>
      </div>
    </div>

    <!-- ─── Son haberler ─────────────────────────────────────────── -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <div class="flex items-baseline justify-between mb-8">
        <SectionLabel>Haberler</SectionLabel>
        <RouterLink
          to="/feed"
          class="text-xs transition-opacity hover:opacity-100 opacity-40"
          style="color: var(--text);"
        >
          tümü →
        </RouterLink>
      </div>

      <!-- Yükleniyor -->
      <div v-if="feedLoading" class="flex flex-col">
        <div
          v-for="n in 3"
          :key="n"
          class="py-4"
          style="border-bottom: 1px solid var(--border);"
        >
          <div class="h-3 w-2/3 mb-2 rounded" style="background: var(--bg-subtle);" />
          <div class="h-2.5 w-1/3 rounded" style="background: var(--bg-subtle);" />
        </div>
      </div>

      <!-- Haberler -->
      <div v-else class="flex flex-col">
        <a
          v-for="item in feedItems"
          :key="item.link"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-start justify-between gap-6 py-4 transition-opacity hover:opacity-60"
          style="border-bottom: 1px solid var(--border); color: var(--text);"
        >
          <div class="min-w-0">
            <p class="text-sm font-medium leading-snug mb-1.5 truncate">{{ item.title }}</p>
            <div class="flex items-center gap-2">
              <img :src="favicon(item.sourceLink)" class="w-3 h-3 rounded-sm" alt="" aria-hidden="true">
              <span class="text-xs" style="color: var(--text-muted); opacity: 0.6;">{{ item.source }}</span>
              <span style="color: var(--border);">·</span>
              <span
                class="text-xs font-medium"
                :style="isFeedToday(item.date)
                  ? 'color: var(--text);'
                  : 'color: var(--text-muted); opacity: 0.5;'"
              >{{ feedDate(item.date) }}</span>
            </div>
          </div>
          <span class="text-sm shrink-0 mt-0.5" style="color: var(--text-muted);">↗</span>
        </a>
        <p v-if="!feedItems.length" class="text-sm py-6 font-mono" style="color: var(--text-muted); opacity: 0.35;">
          {{ isDev ? 'lokaldeyisiniz' : 'içerik yüklenemedi.' }}
        </p>
      </div>
    </div>

    <!-- Deneyim: scroll ile görünen bölüm -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <SectionLabel class="mb-8">
        Deneyim
      </SectionLabel>
      <div class="flex flex-col">
        <div
          v-for="(exp, i) in experience"
          :key="exp.title! + exp.start!"
          class="flex items-start gap-4 py-6"
          :style="i > 0 ? 'border-top: 1px solid var(--border);' : ''"
        >
          <div class="flex-1 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium" style="color: var(--text);">
                {{ exp.title }}
              </p>
              <p class="text-xs mt-1" style="color: var(--text-muted);">
                {{ exp.company }} · {{ exp.type }}
              </p>
              <p class="text-xs mt-0.5" style="color: var(--text-muted); opacity: 0.6;">
                {{ exp.location }} · {{ exp.mode }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs" style="color: var(--text-muted); opacity: 0.8;">
                {{ exp.start }} – {{ exp.end }}
              </p>
              <p class="text-xs mt-0.5" style="color: var(--text-muted); opacity: 0.5;">
                {{ calcDuration(exp.start!, exp.end!) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Eğitim: scroll ile görünen bölüm -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <SectionLabel class="mb-8">
        Eğitim
      </SectionLabel>
      <div class="flex flex-col">
        <div
          v-for="(edu, i) in education"
          :key="edu.degree! + edu.level!"
          class="flex items-start gap-4 py-6"
          :style="i > 0 ? 'border-top: 1px solid var(--border);' : ''"
        >
          <div class="flex-1 flex items-start justify-between gap-4">
            <div>
              <p
                class="text-sm font-medium"
                :style="edu.planned ? 'color: var(--text-muted);' : 'color: var(--text);'"
              >
                {{ edu.degree }}
              </p>
              <p class="text-xs mt-1" style="color: var(--text-muted);">
                {{ edu.level }}<template v-if="edu.school">
                  · {{ edu.school }}
                </template>
              </p>
            </div>
            <div class="text-right shrink-0">
              <p
                class="text-xs"
                :style="edu.planned
                  ? 'color: var(--text-muted); opacity: 0.4; font-style: italic;'
                  : 'color: var(--text-muted); opacity: 0.8;'"
              >
                {{ edu.period }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Fotoğraflar (Pinterest grid) ────────────────────────── -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <div class="flex items-baseline justify-between mb-8">
        <SectionLabel>Fotoğraflar</SectionLabel>
        <RouterLink
          to="/photos"
          class="text-xs transition-opacity hover:opacity-100 opacity-40"
          style="color: var(--text);"
        >
          tümü →
        </RouterLink>
      </div>
      <div class="photo-pinterest">
        <RouterLink
          v-for="photo in recentPhotos"
          :key="photo.file"
          to="/photos"
          class="photo-card"
        >
          <img
            :src="thumb(photo.file)"
            :alt="photo.alt ?? photo.file"
            loading="lazy"
            decoding="async"
            draggable="false"
          >
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-pinterest {
  columns: 3 220px;
  gap: 14px;
}

.photo-card {
  display: block;
  break-inside: avoid;
  margin-bottom: 12px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.13), 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.photo-card:hover {
  transform: translateY(-3px);
}

.dark .photo-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45), 0 1px 4px rgba(0, 0, 0, 0.3);
}

.photo-card img {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 640px) {
  .photo-pinterest {
    columns: 2 140px;
    gap: 8px;
  }
  .photo-card {
    margin-bottom: 8px;
  }
}
</style>
