import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import './assets/css/main.css'

const app = createApp(App)

app.use(createHead())

app.use(router)
app.use(i18n)

app.mount('#app')
