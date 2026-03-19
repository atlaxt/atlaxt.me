<script setup lang="ts">
import SignParticle from '@/components/SignParticle.vue'
import { useSeo } from '@/seo/useSeo'

const links = [
  { label: 'GitHub',    href: 'https://github.com/atlaxt' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/atlaxt' },
  { label: 'Instagram', href: 'https://instagram.com/atlaxt.me' },
]

// 'Halen' ise şu an; değilse verilen ay/yıl string'ini Date'e çevirir
const MONTH_MAP: Record<string, number> = {
  'Oca': 0, 'Şub': 1, 'Mar': 2, 'Nis': 3, 'May': 4, 'Haz': 5,
  'Tem': 6, 'Ağu': 7, 'Eyl': 8, 'Eki': 9, 'Kas': 10, 'Ara': 11,
}

function parseDate(str: string): Date {
  if (str === 'Halen') return new Date()
  const [mon, year] = str.split(' ')
  return new Date(parseInt(year!), MONTH_MAP[mon!] ?? 0, 1)
}

function calcDuration(startStr: string, endStr: string): string {
  const start  = parseDate(startStr)
  const end    = parseDate(endStr)
  // LinkedIn gibi: başlangıç ve bitiş ayının ikisi de sayılır (+1 ay)
  let months   = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
  if (months < 1) months = 1
  const years  = Math.floor(months / 12)
  const rem    = months % 12
  if (years === 0) return `${rem} ay`
  if (rem === 0)   return `${years} yıl`
  return `${years} yıl ${rem} ay`
}

const education = [
  {
    degree:   'Bilgisayar Mühendisliği',
    level:    'Yüksek Lisans',
    school:   null,
    period:   'Planlanıyor',
    planned:  true,
  },
  {
    degree:   'Yönetim Bilişim Sistemleri',
    level:    'Lisans',
    school:   'Anadolu Üniversitesi',
    initials: 'AÜ',
    period:   'Eki 2024 – Halen',
    planned:  false,
  },
  {
    degree:   'Bilgisayar Programlama',
    level:    'Ön Lisans',
    school:   'Eskişehir Teknik Üniversitesi',
    initials: 'ESTÜ',
    period:   '2021 – 2023',
    planned:  false,
  },
]

const experience = [
  {
    title:    'Frontend Developer',
    company:  'trex Digital Manufacturing',
    type:     'Tam zamanlı',
    start:    'Tem 2023',
    end:      'Halen',
    location: 'Bursa, Türkiye',
    mode:     'Ofisten',
  },
  {
    title:    'Stajyer',
    company:  'trex Digital Manufacturing',
    type:     'Stajyer',
    start:    'Tem 2022',
    end:      'Eyl 2022',
    location: 'Bursa, Türkiye',
    mode:     'Ofisten',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://atlaxt.me/#person',
      name: 'Atlas Yiğit Aydın',
      url: 'https://atlaxt.me',
      sameAs: [
        'https://github.com/atlaxt',
        'https://linkedin.com/in/atlaxt',
        'https://instagram.com/atlaxt.me',
      ],
      jobTitle: 'Web Geliştirici',
      worksFor: { '@type': 'Organization', name: 'trex Digital Manufacturing' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://atlaxt.me/#website',
      url: 'https://atlaxt.me',
      name: 'Atlas Yiğit Aydın',
      description: "Vue ekosistemine odaklanan web geliştirici.",
      inLanguage: 'tr-TR',
      author: { '@id': 'https://atlaxt.me/#person' },
    },
  ],
}

useSeo({
  title: 'Atlas Yiğit Aydın',
  description: "Web geliştirici — Vue ekosistemine odaklanan, UX'e önem veren.",
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
        <div class="inline-flex items-center gap-2 mt-6 text-sm" style="color: #4ade80;">
          <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0"></span>
          trex Digital Manufacturing'da çalışıyor
        </div>

        <div class="flex items-center gap-5 mt-6">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm transition-opacity hover:opacity-100 opacity-50"
            style="color: var(--text);"
          >
            {{ link.label }}
          </a>
        </div>
      </div>

      <!-- Sağ: Particle imza -->
      <div class="hidden md:block flex-1 relative">
        <SignParticle class="absolute inset-0" />
      </div>
    </div>



    <!-- Deneyim: scroll ile görünen bölüm -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <p class="text-xs font-medium mb-8 tracking-widest uppercase" style="color: var(--text-muted); opacity: 0.5;">Deneyim</p>
      <div class="flex flex-col">
        <div
          v-for="(exp, i) in experience"
          :key="exp.title + exp.start"
          class="flex items-start gap-4 py-6"
          :style="i > 0 ? 'border-top: 1px solid var(--border);' : ''"
        >
          <div class="flex-1 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium" style="color: var(--text);">{{ exp.title }}</p>
              <p class="text-xs mt-1" style="color: var(--text-muted);">{{ exp.company }} · {{ exp.type }}</p>
              <p class="text-xs mt-0.5" style="color: var(--text-muted); opacity: 0.6;">{{ exp.location }} · {{ exp.mode }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs" style="color: var(--text-muted); opacity: 0.8;">{{ exp.start }} – {{ exp.end }}</p>
              <p class="text-xs mt-0.5" style="color: var(--text-muted); opacity: 0.5;">{{ calcDuration(exp.start, exp.end) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Eğitim: scroll ile görünen bölüm -->
    <div class="px-8 py-16 w-full" style="border-top: 1px solid var(--border);">
      <p class="text-xs font-medium mb-8 tracking-widest uppercase" style="color: var(--text-muted); opacity: 0.5;">Eğitim</p>
      <div class="flex flex-col">
        <div
          v-for="(edu, i) in education"
          :key="edu.degree + edu.level"
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
                {{ edu.level }}<template v-if="edu.school"> · {{ edu.school }}</template>
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
