<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import SectionLabel from '@/components/SectionLabel.vue'
import { useColorMode } from '@/composables/useColorMode'
import { useSeo } from '@/seo/useSeo'
import projectsRaw from '../../content/projects.yaml'

interface FlatProject {
  name: string
  live?: string
  github?: string
  npm?: string
  preview_light?: string
  preview_dark?: string
}

const { isDark } = useColorMode()
const projects = projectsRaw as unknown as FlatProject[]

const featured = computed(() =>
  projects.filter(p => p.preview_light || p.preview_dark),
)

const others = computed(() =>
  projects.filter(p => !p.preview_light && !p.preview_dark),
)

function previewSrc(p: FlatProject): string | null {
  return isDark.value
    ? (p.preview_dark || p.preview_light || null)
    : (p.preview_light || p.preview_dark || null)
}

function isWide(index: number): boolean {
  return index % 3 === 0
}

function openLive(p: FlatProject) {
  if (!p.live)
    return
  const url = p.live.startsWith('http') ? p.live : `https://${p.live}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Projeler — Atlas Yiğit Aydın',
  'description': 'Geliştirdiğim web uygulamaları, açık kaynak araçları ve kişisel projeler.',
  'url': 'https://atlaxt.me/projects',
  'author': {
    '@type': 'Person',
    'name': 'Atlas Yiğit Aydın',
    'url': 'https://atlaxt.me',
  },
}

useSeo({
  title: 'Projeler',
  description: 'Geliştirdiğim web uygulamaları, açık kaynak araçları ve kişisel projeler.',
  canonicalPath: '/projects',
  type: 'website',
  jsonLd,
})
</script>

<template>
  <div class="px-2 md:px-0 py-16 w-full">
    <PageHeader :crumbs="[{ label: 'Projeler', to: '/projects' }]" />

    <!-- ── Featured grid ─────────────────────────────────────────── -->
    <div class="proj-grid">
      <div
        v-for="(p, i) in featured"
        :key="p.name"
        class="proj-card"
        :class="[
          isWide(i) ? 'proj-card--wide' : 'proj-card--narrow',
          p.live ? 'proj-card--live' : '',
        ]"
        @click="openLive(p)"
      >
        <!-- Image -->
        <div class="proj-img-wrap">
          <img
            :key="isDark ? 'dark' : 'light'"
            :src="previewSrc(p)!"
            :alt="p.name"
            loading="lazy"
            decoding="async"
            draggable="false"
            class="proj-img"
          >
          <div class="proj-img-overlay" />
          <span v-if="p.live" class="proj-open-hint">↗</span>
        </div>

        <!-- Footer -->
        <div class="proj-footer">
          <div class="proj-footer-left">
            <span class="proj-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="proj-name">{{ p.name }}</span>
          </div>
          <div class="proj-footer-right">
            <a
              v-if="p.github"
              :href="p.github"
              target="_blank"
              rel="noopener noreferrer"
              :title="`${p.name} — GitHub`"
              class="proj-icon-link"
              @click.stop
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              v-if="p.npm"
              :href="p.npm"
              target="_blank"
              rel="noopener noreferrer"
              :title="`${p.name} — npm`"
              class="proj-icon-link"
              @click.stop
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.568h-3.82V8.666H8.65v10.245H5.13z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Others ─────────────────────────────────────────────────── -->
    <div v-if="others.length" class="mt-20">
      <SectionLabel class="mb-5">
        daha fazla
      </SectionLabel>
      <div class="others-grid">
        <a
          v-for="(p, i) in others"
          :key="p.name"
          :href="p.github ?? p.live"
          target="_blank"
          rel="noopener noreferrer"
          class="other-item"
        >
          <span class="other-num">{{ String(featured.length + i + 1).padStart(2, '0') }}</span>
          <span class="other-name">{{ p.name }}</span>
          <div class="other-links">
            <span v-if="p.github" class="other-badge">gh</span>
            <span v-if="p.npm" class="other-badge">npm</span>
          </div>
          <span class="other-arrow">↗</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Grid container: gap trick creates 1-px grid lines ─── */
.proj-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

@media (max-width: 640px) {
  .proj-grid {
    grid-template-columns: 1fr;
  }

  .proj-card--wide,
  .proj-card--narrow {
    grid-column: span 1 !important;
  }
}

/* ── Cards ───────────────────────────────────────────────── */
.proj-card {
  background: var(--bg);
  display: flex;
  flex-direction: column;
  cursor: default;
  overflow: hidden;
}

.proj-card--wide {
  grid-column: span 2;
}

.proj-card--live {
  cursor: pointer;
}

/* ── Image wrap ──────────────────────────────────────────── */
.proj-img-wrap {
  position: relative;
  overflow: hidden;
  background: var(--bg-subtle);
}

.proj-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.3s ease;
}

.proj-img-overlay {
  position: absolute;
  inset: 0;
  background: var(--bg);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.proj-open-hint {
  position: absolute;
  top: 0.85rem;
  right: 0.9rem;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0;
  transform: translate(-3px, 3px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}

.proj-card--live:hover .proj-img {
  transform: scale(1.04);
}

.proj-card--live:hover .proj-img-overlay {
  opacity: 0.08;
}

.proj-card--live:hover .proj-open-hint {
  opacity: 0.6;
  transform: translate(0, 0);
}

/* ── Footer ──────────────────────────────────────────────── */
.proj-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  border-top: 1px solid var(--border);
}

.proj-footer-left {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  min-width: 0;
}

.proj-num {
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  opacity: 0.3;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.proj-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.proj-footer-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.proj-icon-link {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.proj-icon-link svg {
  width: 0.875rem;
  height: 0.875rem;
}

.proj-card:hover .proj-icon-link {
  opacity: 0.35;
}

.proj-icon-link:hover {
  opacity: 0.8 !important;
}

/* ── Others ──────────────────────────────────────────────── */
.others-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
  .others-grid {
    grid-template-columns: 1fr;
  }
}

.other-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  transition: opacity 0.15s ease;
  position: relative;
}

.other-item:nth-child(odd) {
  padding-right: 1.5rem;
  border-right: 1px solid var(--border);
}

.other-item:nth-child(even) {
  padding-left: 1.5rem;
}

@media (max-width: 640px) {
  .other-item:nth-child(odd) {
    padding-right: 0;
    border-right: none;
  }

  .other-item:nth-child(even) {
    padding-left: 0;
  }
}

.other-item:hover {
  opacity: 0.55;
}

.other-num {
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  opacity: 0.3;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.other-name {
  font-size: 0.8rem;
  font-weight: 480;
  flex: 1;
  min-width: 0;
}

.other-links {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
}

.other-badge {
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
  opacity: 0.3;
  font-variant-numeric: tabular-nums;
}

.other-arrow {
  font-size: 0.7rem;
  color: var(--text-muted);
  opacity: 0;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.other-item:hover .other-arrow {
  opacity: 0.4;
}
</style>
