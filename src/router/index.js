import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/es5/services/goto'
import Home from '@/views/Home.vue'
import authenticationRoutes from '@/modules/auth/router'
import demandaInducidaRoutes from '@/modules/demandaInducida/router'
import complementosRoutes from '@/modules/complementos/router'
import covidRoutes from '@/modules/covid/router'
import sincronizadorRoutes from '@/modules/sincronizador/router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Home' },
    component: () => import('@/layouts/full-layout/Layout'),
    children: [
      {
        name: 'Home',
        path: 'home',
        // redirect: { name: 'DemandaInducida' },
        component: Home,
        meta: {
          requiresAuth: true,
          title: {
            text: 'Prescripciones',
            icon: 'fas fa-prescription',
            color: 'light-blue',
            breadcrumbs: [
              {
                text: 'Prescripciones',
                disabled: true
              }
            ]
          }
        }
      }
    ]
  },
  authenticationRoutes,
  demandaInducidaRoutes,
  complementosRoutes,
  covidRoutes,
  sincronizadorRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0
    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }
    return goTo(scrollTo)
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.user === null) {
      next({
        name: 'Login'
      })
    } else if (to.meta.requiresPermission) {
      if (store.getters.getPermission(to.meta.requiresPermission)) {
        next()
      } else {
        setTimeout(() => {
          store.commit('SET_SNACKBAR', {
            color: 'error',
            message: `No tiene permisos para ingresar al módulo ${to.meta.title}.`
          })
        }, 200)
        next({
          name: 'Home'
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
