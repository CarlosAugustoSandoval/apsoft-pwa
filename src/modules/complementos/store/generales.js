import Vue from 'vue'
import { regimenes, regimenesEspeciales, tiposLlamada, tiposTamizaje } from '@/db/DatosQuemados'

// state
const state = {
  alertChange: 0,
  datosEmpresa: null,
  regimenes: [],
  regimenesEspeciales: [],
  tiposTamizaje: [],
  tiposLlamada: [],
  resultadosPCR: [],
  tiposNoEfectiva: [],
  sexos: [],
  goBack: null,
  municipiosSeleccionadosBarrios: [],
  tipificacionesDomicilioSinEncuesta: [],
  datosMemoria: {
    llamada_entrante: null,
    tipo_tamizaje: null,
    tamizador_id: null,
    departamento_id: null,
    municipio_id: null,
    barrio_id: null,
    localiza_persona: 1
  }
}

// getters
const getters = {
  alertChange: state => {
    return state.alertChange
  },
  datosEmpresa: state => {
    return state.datosEmpresa
  },
  regimenes: state => {
    return state.regimenes
  },
  regimenesEspeciales: state => {
    return state.regimenesEspeciales
  },
  tiposTamizaje: state => {
    return state.tiposTamizaje
  },
  tiposLlamada: state => {
    return state.tiposLlamada
  },
  resultadosPCR: state => {
    return state.resultadosPCR
  },
  tiposNoEfectiva: state => {
    return state.tiposNoEfectiva
  },
  sexos: state => {
    return state.sexos
  },
  sexosCovid: state => {
    return state.sexos.map(x => {
      return { value: x, text: x === 'F' ? 'Femenino' : 'Masculino' }
    })
  },
  goBack: state => {
    return state.goBack
  },
  municipiosSeleccionadosBarrios: state => {
    return state.municipiosSeleccionadosBarrios
  },
  tipificacionesDomicilioSinEncuesta: state => {
    return state.tipificacionesDomicilioSinEncuesta.map(x => {
      return { value: x, text: x }
    })
  },
  datosMemoria: state => {
    return state.datosMemoria
  }
}

// actions
const actions = {
  async getDatosEmpresa (context) {
    return await new Promise(resolve => {
      Vue.axios.get('configuraciones')
        .then(response => {
          response.data.departamento_id = parseInt(response.data.departamento_id)
          context.commit('SET_DATOS_EMPRESA', response.data)
          resolve(true)
        })
        .catch(error => {
          resolve(false)
          context.commit('SET_SNACKBAR', {
            color: 'error',
            message: 'al recuperar los datos de empresa.',
            error: error
          })
        })
    })
  }
}

// mutations
const mutations = {
  SET_RELOAD_CHANGE (state, data) {
    state.alertChange = data
  },
  SET_DATOS_MEMORIA (state, data) {
    state.datosMemoria.llamada_entrante = data.llamada_entrante
    state.datosMemoria.tipo_tamizaje = data.tipo_tamizaje
    state.datosMemoria.tamizador_id = data.tamizador_id
    state.datosMemoria.departamento_id = data.departamento_id
    state.datosMemoria.municipio_id = data.municipio_id
    state.datosMemoria.barrio_id = data.barrio_id
  },
  SET_DELETE_BARRIOS (state) {
    state.municipiosSeleccionadosBarrios = []
  },
  SET_MUNICIPIO_BARRIOS (state, municipio) {
    state.municipiosSeleccionadosBarrios.push(municipio)
  },
  async SET_GOBACK (state, goback = null) {
    state.goBack = goback
  },
  async SET_DATOS_EMPRESA (state, datosEmpresa) {
    state.datosEmpresa = datosEmpresa
  },
  async SET_ASSIGN_GENERALES (state, datos) {
    state.regimenes = regimenes
    state.regimenesEspeciales = regimenesEspeciales
    state.tiposTamizaje = tiposTamizaje
    state.tiposLlamada = tiposLlamada

    state.resultadosPCR = datos.resultado_pcr
    state.tiposNoEfectiva = datos.no_efectividad
    state.sexos = datos.sexos
    state.tipificacionesDomicilioSinEncuesta = datos.tipificaciones
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
