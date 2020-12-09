import Vue from 'vue'
import './registerServiceWorker'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueOffline from 'vue-offline'
import moment from 'moment'
import router from './router'
import store from './store/index'
import GlobalComponents from './plugins/globalComponents'
import './plugins/veeValidate'
import vuetify from './plugins/vuetify'
import './plugins/mixin'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueOffline)
Vue.use(GlobalComponents)
moment.locale('es')
Vue.prototype.moment = moment
store.commit('SET_DEFAULT_AXIOS')
// store.commit('SET_TOKEN_AXIOS')
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
