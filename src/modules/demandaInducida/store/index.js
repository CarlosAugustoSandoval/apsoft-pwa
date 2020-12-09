import Vue from 'vue'
import ResponseTable from '@/class/ResponseTable'
import di from '@/db/DemandaInducida'

// state
const state = {
  encuestas: []
}

// getters
const getters = {
  encuestasDI: state => {
    return state.encuestas
  }
}

// actions
const actions = {
  async downloadDataDemandaInducida (context) {
    console.log('esperando')
    return await new Promise(resolve => {
      Vue.axios.get('demanda-inducida?per_page=5000')
        .then(async response => {
          console.log('response denamda 1', response.data)
          await context.commit('SET_ENCUESTADOS_DI', response.data.data)
          const lengPage = response.data.last_page
          console.log('lengPage', lengPage)
          for (var i = 2; i <= lengPage; i++) {
            await new Promise(resolve => {
              Vue.axios.get(`demanda-inducida?per_page=5000&page=${i}`)
                .then(async response => {
                  console.log('response denamda ' + i, response.data)
                  await context.commit('SET_ENCUESTADOS_DI', response.data.data)
                  resolve(true)
                })
                .catch(error => {
                  resolve(false)
                  context.commit('SET_SNACKBAR', {
                    color: 'error',
                    message: 'al recuperar los registros de encuestados en demanda inducida.',
                    error: error
                  })
                })
            })
          }
          resolve(true)
        })
        .catch(error => {
          resolve(false)
          context.commit('SET_SNACKBAR', {
            color: 'error',
            message: 'al recuperar los registros de encuestados en demanda inducida.',
            error: error
          })
        })
    })
  },
  async getDatosTabla (context, datos) {
    const response = new ResponseTable()
    response.currentPage = datos.changeSearch ? 1 : datos.currentPage
    const offset = ((response.currentPage - 1) * datos.itemsPerPage)
    response.from = offset + 1
    let encuestadosList = di.encuestados
    if (datos.search) {
      datos.options.sortBy = []
      encuestadosList = await encuestadosList
        .where('numero_identificacion').startsWithAnyOfIgnoreCase(datos.search)
        .or('nombre').startsWithAnyOfIgnoreCase(datos.search)
        .or('primer_nombre').startsWithAnyOfIgnoreCase(datos.search)
        .or('segundo_nombre').startsWithAnyOfIgnoreCase(datos.search)
        .or('primer_apellido').startsWithAnyOfIgnoreCase(datos.search)
        .or('segundo_apellido').startsWithAnyOfIgnoreCase(datos.search)
    } else {
      encuestadosList = await encuestadosList.toCollection()
    }
    response.total = await encuestadosList.count()
    if (datos.options.sortBy && datos.options.sortBy.length && datos.options.sortBy[0]) {
      const ORDER_BY = datos.options.sortBy[0]
      const primaryKeySet = new Set(await encuestadosList.primaryKeys())
      const pageKeys = []
      if (datos.options.sortDesc[0]) {
        await di.encuestados
          .orderBy(ORDER_BY)
          .reverse()
          .offset(offset)
          .until(() => pageKeys.length === datos.itemsPerPage)
          .eachPrimaryKey(id => {
            if (primaryKeySet.has(id)) {
              pageKeys.push(id)
            }
          })
      } else {
        await di.encuestados
          .orderBy(ORDER_BY)
          .offset(offset)
          .until(() => pageKeys.length === datos.itemsPerPage)
          .eachPrimaryKey(id => {
            if (primaryKeySet.has(id)) {
              pageKeys.push(id)
            }
          })
      }
      response.items = await Promise.all(pageKeys.map(id => di.encuestados.get(id)))
    } else {
      response.items = await encuestadosList.offset(offset).limit(datos.itemsPerPage).toArray()
    }
    response.to = offset + response.items.length
    response.totalPage = response.total ? Math.ceil(response.total / datos.itemsPerPage) : 1
    return response
  }
}

// mutations
const mutations = {
  SET_ENCUESTADOS_DI (state, encuestados) {
    console.log('entra a poner', di.encuestados.count())
    di.encuestados[di.encuestados.count() ? 'bulkPut' : 'bulkAdd'](encuestados, { allKeys: true })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
