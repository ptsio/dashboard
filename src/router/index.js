import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { isUserLoggedIn } from '@/auth/utils'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/sites',
      name: 'sites',
      component: () => import('@/views/sites/Sites.vue'),
      meta: {
        pageTitle: 'Sites',
        breadcrumb: [
          {
            text: 'Dashboard',
            active: false,
          },
          {
            text: 'Sites',
            active: true,
          },
        ],
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        access: 'guest',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
        access: 'guest',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (to.matched.some(route => !route.meta.access)) {
    if (!isLoggedIn) {
      next({ name: 'login' })
      return
    }
    next()
  }

  if (to.matched.some(route => route.meta.access === 'guest')) {
    if (isLoggedIn) {
      next({ name: 'home' })
      return
    }
    next()
  }

  next()
})

export default router
