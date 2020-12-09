import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import snackbar from '@/modules/snackbar/store'
import userDrawer from '@/modules/userDrawer/store'
import auth from '@/modules/auth/store'
import menu from '@/modules/menu/store'
import demandaInducida from '@/modules/demandaInducida/store'
import complementos from '@/modules/complementos/store/complementos'
import generales from '@/modules/complementos/store/generales'
import covid from '@/modules/covid/store'
import sincronizador from '@/modules/sincronizador/store'
import loading from '@/modules/loading/store'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    snackbar,
    userDrawer,
    auth,
    menu,
    demandaInducida,
    complementos,
    generales,
    covid,
    sincronizador,
    loading
  },
  plugins: [createPersistedState({
    paths: ['userDrawer', 'auth', 'generales']
  })]
})
