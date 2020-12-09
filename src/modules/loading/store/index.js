// state
const state = {
  textLoading: null,
  percent: null
}

// getters
const getters = {
  textLoading: state => {
    return state.textLoading
  },
  percent: state => {
    return state.percent
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  SET_TEXT_LOADING (state, text = null) {
    state.textLoading = text
  },
  SET_PERCENT_LOADING (state, percent = null) {
    state.percent = percent
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
