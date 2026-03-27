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
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
    },
    {
      path: '/blog/:slug',
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
    {
      path: '/photos',
      name: 'photos',
      component: () => import('@/views/PhotosView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition)
      return savedPosition
    if (to.path === '/')
      return false
    return new Promise(resolve => setTimeout(resolve, 180, { top: 0 }))
  },
})

export default router
