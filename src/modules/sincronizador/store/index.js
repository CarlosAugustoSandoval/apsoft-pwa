import Vue from 'vue'
import erp from '@/db/Erp'
import domicilioSinEncuesta from '@/db/domicilioSinEncuesta'

// const { forEach } = require('p-iteration')
// state
const state = {}

// getters
const getters = {}

// actions
const actions = {
  async sincronizarEDIS (context) {
    const registrosFallidos = 0
    context.commit('SET_SNACKBAR', {
      color: registrosFallidos ? 'orange' : 'success',
      message: `El proceso de sincronización ha terminado${registrosFallidos === 0 ? '' : ` con ${registrosFallidos} ${registrosFallidos === 1 ? 'error' : 'errores'}`}`
    })
  },
  async sincronizarDomicilios (context) {
    let registrosFallidos = 0
    const domicilios = await domicilioSinEncuesta.domicilios.filter(x => x.uuid !== null).toArray()
    if (domicilios.length) {
      context.commit('SET_TEXT_LOADING', 'Resolviendo sincronización de domicilios.')
      for (var i = 0; i <= domicilios.length - 1; i++) {
        const domicilio = domicilios[i]
        const count = await new Promise(resolve => {
          const domicilioCopia = JSON.parse(JSON.stringify(domicilio))
          Vue.axios.post('sin-encuesta', domicilioCopia)
            .then(async response => {
              context.commit('SET_TEXT_LOADING', `Sincronizando domicilio ${i} de ${domicilios.length}`)
              context.commit('SET_PERCENT_LOADING', ((i + 1) / domicilios.length) * 100)
              domicilio.id = response.data.data.id
              domicilio.uuid = null
              await domicilioSinEncuesta.domicilios.put(domicilio)
              resolve(0)
            })
            .catch(error => {
              context.commit('SET_SNACKBAR', {
                color: 'error',
                message: `Error al sincronizar un domicilio  ${domicilioCopia.nombreMunicipio}, ${domicilioCopia.nombreDepartamento}.`,
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
    } else {
      context.commit('SET_SNACKBAR', {
        color: 'success',
        message: 'No hay registros para sincronizar.'
      })
    }
  },
  async sincronizarERPS (context) {
    let registrosFallidos = 0
    const encuestas = await erp.encuestas.filter(x => (x.localiza_persona !== null && x.uuid !== null) || (x.nexos.length && x.nexos.find(z => z.uuid !== null || (z.tamizaje && z.tamizaje.uuid !== null)))).toArray()
    if (encuestas.length) {
      context.commit('SET_TEXT_LOADING', 'Resolviendo sincronización de ERPS.')
      const encuestasFor1 = encuestas.filter(h => h.uuid)
      for (var i = 0; i <= encuestasFor1.length - 1; i++) {
        const encuesta = encuestasFor1[i]
        const count = await new Promise(resolve => {
          const encuestaCopia = JSON.parse(JSON.stringify(encuesta))
          if (encuestaCopia.signos_alarma && encuestaCopia.signos_alarma.length) encuestaCopia.sintomas = encuestaCopia.sintomas.concat(encuestaCopia.signos_alarma)
          const request = encuestaCopia.id
            ? Vue.axios.put(`tamizajes/${encuestaCopia.id}`, encuestaCopia)
            : Vue.axios.post('tamizajes', encuestaCopia)
          request
            .then(async response => {
              context.commit('SET_TEXT_LOADING', `Sincronizando ERP ${i} de ${encuestasFor1.length}`)
              context.commit('SET_PERCENT_LOADING', ((i + 1) / encuestasFor1.length) * 100)
              encuesta.id = response.data.id
              encuesta.uuid = null
              await erp.encuestas.put(encuesta)
              resolve(0)
            })
            .catch(error => {
              context.commit('SET_SNACKBAR', {
                color: 'error',
                message: `Error al sincronizar el ERP de ${encuestaCopia.nombre}.`,
                error: error
              })
              resolve(1)
            })
        })
        registrosFallidos = registrosFallidos + count
      }
      // await forEach(encuestas.filter(h => h.uuid), async encuesta => {
      //   const count = await new Promise(resolve => {
      //     const encuestaCopia = JSON.parse(JSON.stringify(encuesta))
      //     if (encuestaCopia.signos_alarma && encuestaCopia.signos_alarma.length) encuestaCopia.sintomas = encuestaCopia.sintomas.concat(encuestaCopia.signos_alarma)
      //     // const request = encuestaCopia.id
      //     //   ? Vue.axios.put(`tamizajes/${encuestaCopia.id}`, encuestaCopia)
      //     //   : Vue.axios.post('tamizajes', encuestaCopia)
      //     // request
      //     Vue.axios.post('tamizajes', encuestaCopia)
      //       .then(async response => {
      //         encuesta.id = response.data.id
      //         encuesta.uuid = null
      //         await erp.encuestas.put(encuesta)
      //         resolve(0)
      //       })
      //       .catch(error => {
      //         context.commit('SET_SNACKBAR', {
      //           color: 'error',
      //           message: `Error al sincronizar el ERP de ${encuestaCopia.nombre}.`,
      //           error: error
      //         })
      //         resolve(1)
      //       })
      //   })
      //   registrosFallidos = registrosFallidos + count
      // })
      // la termina
      const lasEncuestas = encuestas.filter(j => j.id && j.nexos.find(h => h.uuid || (h.tamizaje && h.tamizaje.uuid)))
      if (lasEncuestas.length) {
        for (var j = 0; j <= lasEncuestas.length - 1; j++) {
          const encuesta = lasEncuestas[j]
          encuesta.nexos.forEach(l => {
            l.tamizaje_id = encuesta.id
          })
          context.commit('SET_TEXT_LOADING', `Sincronizando Nexos ERP ${j + 1} de ${lasEncuestas.length}`)
          const nexosFor = encuesta.nexos.filter(h => h.uuid || (h.tamizaje && h.tamizaje.uuid))
          for (var k = 0; k <= nexosFor.length - 1; k++) {
            const nexo = nexosFor[k]
            let cantidad = 0
            if (!nexo.id) {
              cantidad = await new Promise(resolve => {
                Vue.axios.post('reporte_covids', nexo)
                  .then(async response => {
                    context.commit('SET_PERCENT_LOADING', (((k + 1) / nexosFor.length) * 100))
                    nexo.id = response.data.id
                    nexo.uuid = null
                    await erp.encuestas.put(encuesta)
                    resolve(0)
                  })
                  .catch(() => {
                    resolve(1)
                  })
              })
            }
            if (nexo.id && nexo.tamizaje && nexo.tamizaje.uuid) {
              nexo.tamizaje.reporte_id = nexo.id
              const tamizajeCopia = JSON.parse(JSON.stringify(nexo.tamizaje))
              if (tamizajeCopia.signos_alarma && tamizajeCopia.signos_alarma.length) tamizajeCopia.sintomas = tamizajeCopia.sintomas.concat(tamizajeCopia.signos_alarma)
              cantidad = await new Promise(resolve => {
                Vue.axios.post('tamizajes', tamizajeCopia)
                  .then(async response => {
                    nexo.tamizaje.id = response.data.id
                    nexo.tamizaje.uuid = null
                    await erp.encuestas.put(encuesta)
                    resolve(0)
                  })
                  .catch(() => {
                    resolve(1)
                  })
              })
            }
            registrosFallidos = registrosFallidos + cantidad
          }
          // await forEach(encuesta.nexos.filter(h => h.uuid && h.tamizaje_id), async nexo => {
          //   const cantidad = await new Promise(resolve => {
          //     // const request = nexo.id
          //     //   ? Vue.axios.put(`reporte_covids/${nexo.id}`, nexo)
          //     //   : Vue.axios.post('reporte_covids', nexo)
          //     // request
          //     Vue.axios.post('reporte_covids', nexo)
          //       .then(async response => {
          //         nexo.id = response.data.id
          //         nexo.uuid = null
          //         await erp.encuestas.put(encuesta)
          //         resolve(0)
          //       })
          //       .catch(() => {
          //         resolve(1)
          //       })
          //   })
          //   registrosFallidos = registrosFallidos + cantidad
          // })
        }
        // await forEach(lasEncuestas, async encuesta => {
        //   encuesta.nexos.forEach(l => {
        //     l.tamizaje_id = encuesta.id
        //   })
        //   await forEach(encuesta.nexos.filter(h => h.uuid && h.tamizaje_id), async nexo => {
        //     const cantidad = await new Promise(resolve => {
        //       // const request = nexo.id
        //       //   ? Vue.axios.put(`reporte_covids/${nexo.id}`, nexo)
        //       //   : Vue.axios.post('reporte_covids', nexo)
        //       // request
        //       Vue.axios.post('reporte_covids', nexo)
        //         .then(async response => {
        //           nexo.id = response.data.id
        //           nexo.uuid = null
        //           await erp.encuestas.put(encuesta)
        //           resolve(0)
        //         })
        //         .catch(() => {
        //           resolve(1)
        //         })
        //     })
        //     registrosFallidos = registrosFallidos + cantidad
        //   })
        // })
      }
      context.commit('SET_SNACKBAR', {
        color: registrosFallidos ? 'orange' : 'success',
        message: `El proceso de sincronización ha terminado${registrosFallidos === 0 ? '' : ` con ${registrosFallidos} ${registrosFallidos === 1 ? 'error' : 'errores'}`}`
      })
    } else {
      context.commit('SET_SNACKBAR', {
        color: 'success',
        message: 'No hay registros para sincronizar.'
      })
    }
  }
}

// mutations
const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
