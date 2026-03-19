import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import tr from './locales/tr.json'

const savedLocale = typeof window !== 'undefined'
  ? (localStorage.getItem('locale') ?? 'tr')
  : 'tr'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'tr',
  messages: { tr, en },
})
