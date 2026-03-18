import { createI18n } from 'vue-i18n'
import tr from './locales/tr.json'
import en from './locales/en.json'

const savedLocale = localStorage.getItem('locale') ?? 'tr'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'tr',
  messages: { tr, en },
})
