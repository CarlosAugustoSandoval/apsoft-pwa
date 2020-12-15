import Vue from 'vue'
// state
const state = {
  token_type: null,
  access_token: null,
  refresh_token: null,
  user: null,
  permisos: null,
  // server: 'http://localhost:9000'
  server: 'https://pruebas.apsoft.io'
  // server: 'https://sosaludaps.tk:9000'
}

// getters
const getters = {
  user: state => {
    return state.user
  },
  getPermission: state => namePermission => {
    return state.permisos && !!state.permisos.find(x => x.nombre === namePermission)
  },
  roles: state => {
    if (state.user && state.user.roles && state.user.roles.length) {
      return state.user.roles
    }
    return []
  },
  getPermissionModule: state => modulo => {
    if (state.user && state.permisos && state.permisos.length) {
      return state.permisos.filter(x => x.nombre.toString().toLowerCase().indexOf(modulo.toString().toLowerCase()) > -1).map(x => x.nombre.split(`${modulo}-`)[1]).reduce((value, key) => {
        value[key] = value[key] || true
        return value
      }, {})
    } else {
      return {}
    }
  }
}

// actions
const actions = {
  getUser (context) {
    Vue.axios.get('user-fresh')
      .then(response => {
        context.commit('SET_REFRESH_USER', response.data)
      })
      .catch(error => {
        context.commit('SET_SNACKBAR', { color: 'error', message: 'al recuperar los datos del usuario.', error: error })
      })
  },
  async login (context, user) {
    Vue.axios.defaults.baseURL = context.state.server
    return await new Promise(resolve => {
      Vue.axios.post('/api/login', user)
        .then(response => {
          const dataToken = {
            grant_type: response.data.grant_type,
            client_id: response.data.client_id,
            client_secret: response.data.client_secret,
            username: response.data.user.email,
            password: user.password,
            scope: ''
          }
          const responseUser = response.data.user
          const permisosUsuario = response.data.permisos
          Vue.axios.post('/oauth/token', dataToken)
            .then(response => {
              const dataSuccess = {
                token_type: response.data.token_type,
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                user: responseUser,
                permisos: permisosUsuario
              }
              setTimeout(() => {
                context.commit('SET_DATA_LOGIN', dataSuccess)
                context.commit('SET_DEFAULT_AXIOS')
                resolve(true)
              }, 500)
            })
            .catch(error => {
              setTimeout(() => {
                context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al iniciar sesión.', error: error })
                resolve(false)
              }, 500)
            })
        })
        .catch(error => {
          setTimeout(() => {
            context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al iniciar sesión.', error: error })
            resolve(false)
          }, 500)
        })
    })
  }
}

// mutations
const mutations = {
  SET_DATA_LOGIN (state, data) {
    state.user = data.user
    state.token_type = data.token_type
    state.access_token = data.access_token
    state.refresh_token = data.refresh_token
    state.permisos = data.permisos
  },
  SET_DEFAULT_AXIOS (state) {
    Vue.axios.defaults.baseURL = state.server
    if (state.access_token && state.token_type) {
      Vue.axios.defaults.baseURL = `${state.server}/api`
      Vue.axios.defaults.headers.common.Authorization = `${state.token_type} ${state.access_token}`
    }
  },
  SET_TOKEN_AXIOS (state) {
    Vue.axios.defaults.headers.common.Authorization = `${state.token_type} ${state.access_token}`
  },
  SET_LOGOUT (state) {
    Vue.axios.defaults.baseURL = state.server
    state.user = null
    state.token_type = null
    state.access_token = null
    state.refresh_token = null
    state.permisos = null
    Vue.axios.defaults.headers.common.Authorization = null
  },
  SET_REFRESH_USER (state, data) {
    state.user = data.user
    state.permisos = data.permisos
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
