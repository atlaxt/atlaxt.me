<script setup lang="ts">
import type { EducationEntry, ExperienceEntry } from '@/types'
import SectionLabel from '@/components/SectionLabel.vue'
import SignParticle from '@/components/SignParticle.vue'
import { useSeo } from '@/seo/useSeo'
import educationRaw from '../../content/education.yaml'
import experienceRaw from '../../content/experience.yaml'

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
  </div>
</template>
