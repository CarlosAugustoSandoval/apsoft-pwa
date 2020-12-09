const state = {
  snackbar: null
}

// getters
const getters = {
  snackbar (state) {
    return state.snackbar
  }
}
// actions
const actions = {}

// mutations
const mutations = {
  SET_SNACKBAR (state, data) {
    const timeout = 6000
    let message = ''
    message = data.message
    state.snackbar = {
      timeout: timeout,
      message: message,
      color: data.color
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
