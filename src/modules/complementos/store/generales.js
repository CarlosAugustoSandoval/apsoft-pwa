import Vue from 'vue'
import { regimenes, regimenesEspeciales, tiposLlamada, tiposTamizaje } from '@/db/DatosQuemados'

// state
const state = {
  datosEmpresa: null,
  regimenes: regimenes,
  regimenesEspeciales: regimenesEspeciales,
  tiposTamizaje: tiposTamizaje,
  tiposLlamada: tiposLlamada,
  resultadosPCR: [],
  tiposNoEfectiva: [],
  sexos: [],
  goBack: null,
  municipiosSeleccionadosBarrios: [],
  tipificacionesDomicilioSinEncuesta: []
}

// getters
const getters = {
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
