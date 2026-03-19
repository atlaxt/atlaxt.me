import { createHead } from '@unhead/vue/client'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import './assets/css/main.css'

const app = createApp(App)

app.use(createHead())

app.use(router)
app.use(i18n)

app.mount('#app')
