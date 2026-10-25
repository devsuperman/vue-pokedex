import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { formatName } from '@/utils/format'

// Teach TypeScript about our custom route meta field
declare module 'vue-router' {
  interface RouteMeta {
    title?: string | ((to: RouteLocationNormalized) => string)
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'All Pokémon' },
    },
    {
      path: '/pokemon/:name',
      name: 'pokemon',
      // Lazy loaded: this view's code is only downloaded when the route is visited
      component: () => import('@/views/PokemonDetailView.vue'),
      // Pass the :name param to the view as a prop instead of reading useRoute() inside it
      props: true,
      meta: { title: (to) => formatName(String(to.params.name)) },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorites' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
  // Start new pages at the top, but restore the position when going back
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

// Update the browser tab title after every navigation
router.afterEach((to) => {
  const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title
  document.title = title ? `${title} · Pokédex` : 'Pokédex'
})

export default router
