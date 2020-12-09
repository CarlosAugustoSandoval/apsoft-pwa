// state
const state = {
  Customizer_drawer: false,
  darkMode: false,
  themeColor: '#5D92F4',
  themeColors: [
    '#5D92F4',
    '#468AB0',
    '#58B0A0',
    '#00D0BD'

  ]
}

// getters
const getters = {
  themeColors: state => {
    return state.themeColors
  },
  themeColor: state => {
    return state.themeColor
  },
  darkMode: state => {
    return state.darkMode
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  SET_CUSTOMIZER_DRAWER (state, payload) {
    state.Customizer_drawer = payload
  },
  SET_THEME_MODE (state, dark) {
    state.darkMode = dark
  },
  SET_THEME_COLOR (state, color) {
    state.themeColor = color
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
