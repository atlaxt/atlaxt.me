import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
    },
  },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    'nuxt-gtag',
    '@nuxt/content',
  ],
  css: ['~/assets/style/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
    storageKey: 'nuxt-color-mode',
  },
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID,
  },
})
