import Vue from 'vue'
import covid from '@/db/Covid'
// state
const state = {
  departamentos: [],
  tamizadores: [],
  causalesVisitaFallida: [],
  epss: [],
  ipss: [],
  tiposIdentificacion: [],
  gruposAtencionEspecial: [],
  sintomas: [],
  parentescos: [],
  comorbilidades: []
}

// getters
const getters = {
  departamentos: state => {
    return state.departamentos
  },
  tamizadores: state => {
    return state.tamizadores
  },
  causalesVisitaFallida: state => {
    return state.causalesVisitaFallida
  },
  tiposIdentificacion: state => {
    return state.tiposIdentificacion
  },
  gruposAtencionEspecial: state => {
    return state.gruposAtencionEspecial
  },
  sintomas: state => {
    return state.sintomas
  },
  sintomasFecha: state => {
    return state.sintomas.filter(x => x.solicita_fecha)
  },
  signosAlarma: state => {
    return state.sintomas.filter(x => !x.solicita_fecha)
  },
  ipss: state => {
    return state.ipss
  },
  epss: state => {
    return state.epss
  },
  parentescos: state => {
    return state.parentescos
  },
  comorbilidades: state => {
    return state.comorbilidades
  }
}

// actions
const actions = {
  async descargasGenerales (context) {
    context.commit('SET_TEXT_LOADING', 'Resolviendo descarga de ajustes generales')
    return await new Promise(resolve => {
      Vue.axios.get('ajustes-generales/iniciales')
        .then(async response => {
          context.commit('SET_TEXT_LOADING', 'Asignando departamentos y municipios')
          await covid.departamentos[covid.departamentos.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.departamentos, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando tipos de encuestadores')
          await covid.tamizadores[covid.tamizadores.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.tamizadores, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando causales de visitas fallidas')
          await covid.causalesVisitaFallida[covid.causalesVisitaFallida.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.causal_visita_fallidas, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando tipos de identificación')
          await covid.tiposIdentificacion[covid.tiposIdentificacion.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.tipos_documento_identidad, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando EPS')
          await covid.epss[covid.epss.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.eps, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando grupos de atención especial')
          await covid.gruposAtencionEspecial[covid.gruposAtencionEspecial.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.grupos_atencion_especial_covid, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando síntomas')
          await covid.sintomas[covid.sintomas.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.sintomas, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando parentescos')
          await covid.parentescos[covid.parentescos.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.parentescos, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Asignando comorbilidades')
          await covid.comorbilidades[covid.comorbilidades.count() ? 'bulkPut' : 'bulkAdd'](response.data.parametros.comorbilidades, { allKeys: true })
          context.commit('SET_TEXT_LOADING', 'Terminando asignación')
          await context.commit('SET_ASSIGN_DB_COMPLEMENTOS', 'covidddd')
          await context.commit('SET_ASSIGN_GENERALES', response.data.parametros)
          await context.dispatch('descargasIPSS')
          context.commit('SET_SNACKBAR', {
            color: 'success',
            message: 'Ajustes generales descargados correctamente.'
          })
          resolve(true)
        })
        .catch(error => {
          resolve(false)
          context.commit('SET_SNACKBAR', {
            color: 'error',
            message: 'Error al recuperar los ajustes generales.',
            error: error
          })
        })
    })
  },
  async descargasAfiliados (context) {
    context.commit('SET_TEXT_LOADING', 'Resolviendo descarga de afiliados')
    return await new Promise(resolve => {
      Vue.axios.get('afiliados?per_page=5000')
        .then(async response => {
          console.log('el response de los agilidias', response)
          context.commit('SET_TEXT_LOADING', `Asignando ${response.data.to} registros de ${response.data.total} totales.`)
          context.commit('SET_PERCENT_LOADING', (response.data.to / response.data.total) * 100)
          await covid.afiliados[covid.afiliados.count() ? 'bulkPut' : 'bulkAdd'](response.data.data, { allKeys: true })
          const lengPage = response.data.last_page
          for (var i = 2; i <= lengPage; i++) {
            await new Promise(resolve => {
              Vue.axios.get(`afiliados?per_page=5000&page=${i}`)
                .then(async response => {
                  context.commit('SET_TEXT_LOADING', `Asignando ${response.data.to} registros de ${response.data.total} totales.`)
                  await covid.afiliados[covid.afiliados.count() ? 'bulkPut' : 'bulkAdd'](response.data.data, { allKeys: true })
                  context.commit('SET_PERCENT_LOADING', (response.data.to / response.data.total) * 100)
                  resolve(true)
                })
                .catch(error => {
                  resolve(false)
                  context.commit('SET_SNACKBAR', {
                    color: 'error',
                    message: 'Error al recuperar los registros de los afiliados.',
                    error: error
                  })
                })
            })
          }
          context.commit('SET_SNACKBAR', {
            color: 'success',
            message: 'Afiliados descargados correctamente.'
          })
          resolve(true)
        })
        .catch(error => {
          resolve(false)
          context.commit('SET_SNACKBAR', {
            color: 'error',
            message: 'Error al recuperar los registros de los afiliados.',
            error: error
          })
        })
    })
  },
  async sincronizarBarrios (context, municipios) {
    let registrosFallidos = 0
    context.commit('SET_TEXT_LOADING', 'Resolviendo sincronización de barrios.')
    await covid.barrios.clear()
    context.commit('SET_DELETE_BARRIOS')
    for (var i = 0; i <= municipios.length - 1; i++) {
      const municipio = municipios[i]
      const count = await new Promise(resolve => {
        Vue.axios.get(`barrios?municipio_id=${municipio.id}`)
          .then(async response => {
            municipio.cantidadBarrios = response.data.length
            context.commit('SET_TEXT_LOADING', `Asignando ${municipio.cantidadBarrios} Barrio${municipio.cantidadBarrios === 1 ? '' : 's'} de ${municipio.nombre}, ${municipio.departamento.nombre}.`)
            context.commit('SET_MUNICIPIO_BARRIOS', municipio)
            await covid.barrios.bulkAdd(response.data)
            resolve(0)
          })
          .catch(error => {
            context.commit('SET_SNACKBAR', {
              color: 'error',
              message: `Error al sincronizar los barrios del municipio ${municipio.nombre}.`,
              error: error
            })
            resolve(1)
          })
      })
      registrosFallidos = registrosFallidos + count
    }
    context.commit('SET_SNACKBAR', {
      color: registrosFallidos ? 'orange' : 'success',
      message: `El proceso de sincronización ha terminado${registrosFallidos === 0 ? '' : ` con ${registrosFallidos} ${registrosFallidos === 1 ? 'error' : 'errores'}`}`
    })
  },
  async getBarriosMunicipio (context, municipioId) {
    if (municipioId) {
      const barrios = await covid.barrios
        .where('municipio_id')
        .equals(municipioId)
        .toArray()
      return barrios
    } else {
      return []
    }
  },
  async searchAfiliadoIdentidad (context, identidad) {
    if (identidad) {
      const afiliado = await covid.afiliados
        .where('numero_documento_identidad').equals(identidad).first()
      const erps = await context.dispatch('getERPSAfiliado', identidad)
      return { afiliado: afiliado, erps: erps }
    } else {
      return null
    }
  },
  async descargasIPSS (context) {
    context.commit('SET_TEXT_LOADING', 'Resolviendo descarga de prestadores')
    return await new Promise(resolve => {
      Vue.axios.get('prestadores')
        .then(async response => {
          context.commit('SET_TEXT_LOADING', 'Asignando prestadores')
          await covid.ipss[covid.ipss.count() ? 'bulkPut' : 'bulkAdd'](response.data, { allKeys: true })
          resolve(true)
        })
        .catch(error => {
          resolve(false)
          context.commit('SET_SNACKBAR', {
            color: 'error',
            message: 'Error al recuperar los registros de las IPS.',
            error: error
          })
        })
    })
  },
  async getPrestadores (context, data) {
    // const prestadores = await covid.ipss
    // .filter(function (x) {
    //   const hasValue = val => val != null ? val : ''
    //   const text = hasValue(x.nombre)
    //   const query = hasValue(data.search)
    //   return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    // })
    // .toArray()
    // return prestadores
    if (data.seleccionado || data.search) {
      if (data.seleccionado) {
        if (data.search) {
          const prestadores = await covid.ipss
            .where('codigohabilitacion').equals(data.seleccionado)
            .or('codigohabilitacion').startsWithAnyOfIgnoreCase(data.search)
            .or('nombre').startsWithAnyOfIgnoreCase(data.search)
            .toArray()
          return prestadores
        } else {
          const prestadores = await covid.ipss
            .where('codigohabilitacion').startsWithAnyOfIgnoreCase(data.seleccionado)
            .toArray()
          return prestadores
        }
      } else {
        const prestadores = await covid.ipss
          .where('codigohabilitacion').startsWithAnyOfIgnoreCase(data.search)
          .or('nombre').startsWithAnyOfIgnoreCase(data.search)
          .toArray()
        return prestadores
      }
    } else {
      return []
    }
  }
}

// mutations
const mutations = {
  async SET_ASSIGN_DB_COMPLEMENTOS (state, vista) {
    state.departamentos = await covid.departamentos.toArray()
    state.tamizadores = await covid.tamizadores.toArray()
    state.tiposIdentificacion = await covid.tiposIdentificacion.toArray()
    state.causalesVisitaFallida = await covid.causalesVisitaFallida.toArray()
    state.epss = await covid.epss.toArray()
    state.gruposAtencionEspecial = await covid.gruposAtencionEspecial.toArray()
    state.sintomas = await covid.sintomas.toArray()
    state.parentescos = await covid.parentescos.toArray()
    state.comorbilidades = await covid.comorbilidades.toArray()
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
