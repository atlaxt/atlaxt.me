import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'color-scheme', content: 'dark' },
      ],
      htmlAttrs: {
        class: 'dark',
      },
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/color-mode', '@nuxt/icon'],
  colorMode: {
    classSuffix: '',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
