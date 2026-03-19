import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      component: () => import('@/views/cli/IndexView.vue'),
    },
    {
      path: '/cli/tools',
      name: 'cli-tools',
      component: () => import('@/views/cli/ToolsView.vue'),
    },
    {
      path: '/cli/tools/:id',
      name: 'cli-tool-detail',
      component: () => import('@/views/cli/ToolDetailView.vue'),
    },
    {
      path: '/cli/templates',
      name: 'cli-templates',
      component: () => import('@/views/cli/TemplatesView.vue'),
    },
    {
      path: '/feed',
      name: 'feed',
      component: () => import('@/views/FeedView.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
