/**
 * Header Module
 */
import { itemsMenu } from './data'

const state = {
  itemsMenu
}

// getters
const getters = {
  itemsMenu: (state, getters) => {
    const menuPrincipal = []
    // ERP
    if (getters.getPermission('covid-tamizajeVer')) menuPrincipal.push(state.itemsMenu.find(x => x.id === 18))
    if (getters.getPermission('covid-DomicilioSinEncuestaIndex')) menuPrincipal.push(state.itemsMenu.find(x => x.id === 36))
    // RCV
    // if (getters.getPermission('aps-encuestasRCVIndex')) menuPrincipal.push(state.itemsMenu.find(x => x.id === 27))
    // Demanda Inducida
    // if (getters.getPermission('demandaInducida-index')) menuPrincipal.push(state.itemsMenu.find(x => x.id === 30))
    // General
    menuPrincipal.push(state.itemsMenu.find(x => x.id === 1))
    // menuPrincipal.push(state.itemsMenu.find(x => x.id === 6))
    menuPrincipal.push(state.itemsMenu.find(x => x.id === 2))
    menuPrincipal.push(state.itemsMenu.find(x => x.id === 35))
    return menuPrincipal
  }
}

// actions
const actions = {}

// mutations
const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
