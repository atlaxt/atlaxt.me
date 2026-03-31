<script setup lang="ts">
import type { Book, EducationEntry, ExperienceEntry, Photo, Post, Quote } from '@/types'
import photoMeta from 'virtual:photo-meta'
import { nextTick, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import SectionLabel from '@/components/SectionLabel.vue'
import SignParticle from '@/components/SignParticle.vue'
import { useSeo } from '@/seo/useSeo'
import booksRaw from '../../content/books.yaml'
import educationRaw from '../../content/education.yaml'
import experienceRaw from '../../content/experience.yaml'
import photosRaw from '../../content/photos.yaml'
import quotesRaw from '../../content/quotes.yaml'

// ─── Günün sözü ─────────────────────────────────────────────────
const quotes = quotesRaw as unknown as Quote[]
const QUOTE_KEY = 'quote-index'
const quoteIndex = Number(localStorage.getItem(QUOTE_KEY) ?? 0) % quotes.length
localStorage.setItem(QUOTE_KEY, String((quoteIndex + 1) % quotes.length))
const currentQuote = quotes[quoteIndex]!

// ─── Son yazılar ────────────────────────────────────────────────
const modules = import.meta.glob('../../content/blogs/*.md', { eager: true })
const recentPosts = (Object.values(modules) as { default: Post }[])
  .map(m => m.default)
  .filter(p => p?.frontmatter)
  .sort((a, b) => b.frontmatter.date?.localeCompare(a.frontmatter.date))
  .slice(0, 3)

// ─── Son fotoğraflar ────────────────────────────────────────────
const recentPhotos = (photosRaw as unknown as Photo[])
  .filter(p => (photoMeta as Record<string, boolean>)[p.file])
  .slice(-6)

function thumb(file: string) {
  return `/photos/thumbs/${file}`
}

// ─── En beğenilen kitaplar ──────────────────────────────────────
const recentBooks = (booksRaw as unknown as Book[])
  .filter(b => b.name && b.rate)
  .sort((a, b) => Number.parseFloat(b.rate) - Number.parseFloat(a.rate))
  .slice(0, 3)

const HOME_SCROLL_KEY = 'home-scroll-y'

onBeforeRouteLeave(() => {
  sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY))
})

onMounted(() => {
  const saved = sessionStorage.getItem(HOME_SCROLL_KEY)
  if (saved) {
    sessionStorage.removeItem(HOME_SCROLL_KEY)
    nextTick(() => window.scrollTo({ top: Number(saved), behavior: 'instant' }))
  }
  else {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
})

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
      <div class="flex flex-col justify-center px-2 md:px-0 py-12 w-full md:w-2/5 shrink-0">
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

    <!-- ─── Blog ─────────────────────────────────────────── -->
    <div class="px-2 md:px-0 py-16 w-full">
      <div class="flex items-baseline justify-between mb-8">
        <SectionLabel>Blog</SectionLabel>
        <RouterLink to="/blog" class="section-more">
          tümü →
        </RouterLink>
      </div>
      <div class="blog-wrap">
        <div class="blog-list">
          <RouterLink
            v-for="post in recentPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="blog-card"
          >
            <div class="blog-card-inner">
              <div class="blog-card-top">
                <span class="blog-date">
                  {{ new Date(post.frontmatter.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) }}
                </span>
                <span class="blog-arrow">↗</span>
              </div>
              <p class="blog-title">
                {{ post.frontmatter.title }}
              </p>
              <p class="blog-desc">
                {{ post.frontmatter.description }}
              </p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Deneyim + Eğitim: Timeline -->
    <div class="px-2 md:px-0 py-16 w-full">
      <div class="timeline-grid">
        <!-- Deneyim -->
        <div>
          <SectionLabel class="mb-8">
            Deneyim
          </SectionLabel>
          <div class="timeline">
            <div
              v-for="exp in experience"
              :key="exp.title! + exp.start!"
              class="timeline-item"
            >
              <div class="timeline-dot-wrap">
                <div class="timeline-dot" :class="exp.end === 'Halen' ? 'timeline-dot--active' : ''" />
                <span v-if="exp.end === 'Halen'" class="timeline-pulse" />
              </div>
              <div class="timeline-body">
                <div class="timeline-meta">
                  <span class="timeline-period">{{ exp.start }} – {{ exp.end }}</span>
                  <span class="timeline-duration">{{ calcDuration(exp.start!, exp.end!) }}</span>
                </div>
                <p class="timeline-title">
                  {{ exp.title }}
                </p>
                <p class="timeline-sub">
                  {{ exp.company }} · {{ exp.type }}
                </p>
                <p class="timeline-sub timeline-sub--faint">
                  {{ exp.location }} · {{ exp.mode }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Eğitim -->
        <div>
          <SectionLabel class="mb-8">
            Eğitim
          </SectionLabel>
          <div class="timeline">
            <div
              v-for="edu in education"
              :key="edu.degree! + edu.level!"
              class="timeline-item"
            >
              <div class="timeline-dot-wrap">
                <div class="timeline-dot" :class="!edu.planned ? 'timeline-dot--faint' : edu.active ? 'timeline-dot--active' : ''" />
                <span v-if="edu.active" class="timeline-pulse" />
              </div>
              <div class="timeline-body">
                <div class="timeline-meta">
                  <span
                    class="timeline-period"
                    :style="edu.planned ? 'font-style:italic; opacity:0.4;' : ''"
                  >{{ edu.period }}</span>
                </div>
                <p class="timeline-title" :style="edu.planned ? 'opacity:0.4;' : ''">
                  {{ edu.degree }}
                </p>
                <p class="timeline-sub">
                  {{ edu.level }}<template v-if="edu.school">
                    · {{ edu.school }}
                  </template>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Son kitaplar ─────────────────────────────────────────── -->
    <div class="px-2 md:px-0 py-16 w-full">
      <div class="flex items-baseline justify-between mb-2">
        <SectionLabel>Kitaplık</SectionLabel>
        <RouterLink to="/books" class="section-more">
          tümü →
        </RouterLink>
      </div>
      <p class="book-subtitle">
        en çok beğendiklerim
      </p>
      <div class="book-list">
        <RouterLink
          v-for="(book, i) in recentBooks"
          :key="book.number"
          to="/books"
          class="book-card"
        >
          <span class="book-rank">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="book-info">
            <span class="book-name">{{ book.name }}</span>
            <span class="book-author">{{ book.author }}</span>
          </div>
          <span v-if="book.rate" class="book-rate">
            {{ book.rate }}
            <span class="book-rate-denom">/10</span>
          </span>
        </RouterLink>
      </div>
    </div>

    <!-- ─── Fotoğraflar (Pinterest grid) ────────────────────────── -->
    <div class="px-2 md:px-0 py-16 w-full">
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
      <RouterLink to="/photos" class="photo-peek-wrap">
        <div class="photo-masonry">
          <div
            v-for="photo in recentPhotos"
            :key="photo.file"
            class="photo-item"
          >
            <img
              :src="thumb(photo.file)"
              :alt="photo.alt ?? photo.file"
              loading="lazy"
              decoding="async"
              draggable="false"
            >
          </div>
        </div>
        <div class="photo-fade" />
      </RouterLink>
    </div>

    <!-- ─── Söz ───────────────────────────────────────────── -->
    <div class="px-2 md:px-0 py-20 w-full">
      <blockquote class="quote-block max-w-lg mx-auto text-center">
        <p class="quote-text">
          <span class="quote-mark">"</span>{{ currentQuote.text }}<span class="quote-mark">"</span>
        </p>
        <footer v-if="currentQuote.author" class="quote-author">
          {{ currentQuote.author }}
        </footer>
      </blockquote>
    </div>
  </div>
</template>

<style scoped>
/* ── Shared ───────────────────────────────────────────── */
.section-more {
  font-size: 0.7rem;
  color: var(--text);
  text-decoration: none;
  opacity: 0.35;
  transition: opacity 0.18s ease;
}

.section-more:hover {
  opacity: 0.8;
}

/* ── Blog ─────────────────────────────────────────────── */
.blog-wrap {
  position: relative;
  max-height: 175px;
  overflow: hidden;
}

.blog-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--bg) 90%);
}

.blog-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  overflow: hidden;
}

.blog-card {
  text-decoration: none;
  transition: background 0.18s ease;
  background: transparent;
}

.blog-card:hover {
  background: var(--bg-subtle, rgba(255,255,255,0.03));
}

.blog-card:not(:last-child) {
  border-right: 1px solid var(--border);
}

.blog-card-inner {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.25rem 1.5rem;
  height: 100%;
}

.blog-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blog-date {
  font-size: 0.62rem;
  color: var(--text-muted);
  opacity: 0.5;
  white-space: nowrap;
}

.blog-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
  margin-top: 0.1rem;
}

.blog-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
  opacity: 0.75;
  line-height: 1.6;
  margin-top: auto;
  padding-top: 0.35rem;
}

.blog-arrow {
  font-size: 0.72rem;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease;
  flex-shrink: 0;
}

.blog-card:hover .blog-arrow {
  opacity: 0.5;
  transform: translate(2px, -2px);
}

@media (max-width: 600px) {
  .blog-list {
    grid-template-columns: 1fr;
  }

  .blog-card:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

/* ── Books ────────────────────────────────────────────── */
.book-subtitle {
  font-size: 0.7rem;
  color: var(--text-muted);
  opacity: 0.9;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
}

.book-list {
  display: flex;
  flex-direction: column;
}

.book-card {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.9rem 0;
  text-decoration: none;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  transition: opacity 0.15s ease;
}

.book-card:last-child {
  border-bottom: none;
}

.book-card:hover {
  opacity: 0.6;
}

.book-rank {
  font-size: 0.6rem;
  color: var(--text-muted);
  opacity: 0.55;
  flex-shrink: 0;
  min-width: 1.4rem;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
}

.book-name {
  font-size: 0.84rem;
  font-weight: 480;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author {
  font-size: 0.68rem;
  color: var(--text-muted);
  opacity: 0.7;
}

.book-rate {
  flex-shrink: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.book-rate-denom {
  font-size: 0.6rem;
  font-weight: 400;
  color: var(--text-muted);
  opacity: 0.65;
  margin-left: 0.05rem;
}

/* ── Timeline ─────────────────────────────────────────── */
.timeline-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 8px;
  bottom: 0;
  width: 1px;
  background: var(--border);
}

.timeline-dot-wrap {
  position: relative;
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  margin-top: 4px;
  z-index: 1;
}

.timeline-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border);
  border: 1px solid var(--border);
}

.timeline-dot--active {
  background: #4ade80;
  border-color: #4ade80;
}

.timeline-dot--faint {
  opacity: 0.3;
}

.timeline-pulse {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px solid #4ade80;
  animation: timeline-pulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes timeline-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%       { opacity: 0; transform: scale(2.2); }
}

.timeline-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.timeline-meta {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
}

.timeline-period {
  font-size: 0.65rem;
  color: var(--text-muted);
  opacity: 0.7;
  letter-spacing: 0.03em;
}

.timeline-duration {
  font-size: 0.62rem;
  color: var(--text-muted);
  opacity: 0.6;
}

.timeline-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.3;
}

.timeline-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0.7;
}

.timeline-sub--faint {
  opacity: 0.6;
}

/* ── Quote ────────────────────────────────────────────── */
.quote-block {
  opacity: 0.5;
  transition: opacity 0.4s ease;
}

.quote-block:hover {
  opacity: 0.8;
}

.quote-text {
  font-size: 0.8rem;
  font-style: italic;
  letter-spacing: 0.03em;
  line-height: 1.8;
  color: var(--text);
}

.quote-mark {
  font-size: 1.6rem;
  font-style: normal;
  line-height: 0;
  vertical-align: -0.3em;
  opacity: 0.35;
  font-family: Georgia, serif;
  margin: 0 0.1em;
}

.quote-author {
  margin-top: 0.75rem;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.photo-peek-wrap {
  position: relative;
  max-height: 340px;
  overflow: hidden;
  display: block;
  cursor: pointer;
}

.photo-masonry {
  columns: 3 180px;
  gap: 8px;
}

.photo-item {
  display: block;
  break-inside: avoid;
  margin-bottom: 8px;
  overflow: hidden;
}

.photo-item img {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.photo-item:hover img {
  opacity: 0.8;
}

.photo-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 220px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--bg) 80%);
}

@media (max-width: 640px) {
  .photo-masonry {
    columns: 2 140px;
  }
}
</style>
