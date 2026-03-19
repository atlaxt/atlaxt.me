import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('@/views/BooksView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/writings',
      name: 'writings',
      component: () => import('@/views/WritingsView.vue'),
    },
    {
      path: '/writings/:slug',
      name: 'post',
      component: () => import('@/views/PostView.vue'),
    },
    {
      path: '/cli',
      name: 'cli',
      component: () => import('@/views/CliView.vue'),
    },
    {
      path: '/cli/tools',
      name: 'cli-tools',
      component: () => import('@/views/CliToolsView.vue'),
    },
    {
      path: '/cli/tools/:id',
      name: 'cli-tool-detail',
      component: () => import('@/views/CliToolDetailView.vue'),
    },
    {
      path: '/cli/templates',
      name: 'cli-templates',
      component: () => import('@/views/CliTemplatesView.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
