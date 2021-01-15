// import Vue from 'vue'
import ResponseTable from '@/class/ResponseTable'
import erp from '@/db/Erp'
import covid from '@/db/Covid'
import domicilioSinEncuesta from '@/db/domicilioSinEncuesta'
import { uuid } from 'vue-uuid'

// state
const state = {
  encuestas: []
}

// getters
const getters = {
  encuestasERP: state => {
    return state.encuestas
  }
}

// actions
const actions = {
  async guardarEncuestaERP (context, encuesta) {
    if (!encuesta.uuid) encuesta.uuid = `ERP-${uuid.v1()}`
    if (!encuesta.idd) context.commit('SET_DATOS_MEMORIA', encuesta)
    return await erp.encuestas[encuesta.idd ? 'put' : 'add'](encuesta)
      .then(() => {
        context.commit('SET_SNACKBAR', { color: 'success', message: 'La Encuesta se ha guardado correctamente.' })
        return true
      })
      .catch(() => {
        context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al guardar la encuesta.' })
        return false
      })
  },
  async guardarEncuestaERPNexo (context, data) {
    if (data.indexNexo !== null) {
      const encuesta = await erp.encuestas.get(parseInt(data.encuestaIdd))
      if (!data.encuesta.uuid) data.encuesta.uuid = `ERPNexo-${uuid.v1()}`
      if (!data.encuesta.idd) context.commit('SET_DATOS_MEMORIA', data.encuesta)
      encuesta.nexos[data.indexNexo].tamizaje = data.encuesta
      return await erp.encuestas[encuesta.idd ? 'put' : 'add'](encuesta)
        .then(() => {
          context.commit('SET_SNACKBAR', { color: 'success', message: 'La Encuesta se ha guardado correctamente.' })
          return true
        })
        .catch(() => {
          context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al guardar la encuesta.' })
          return false
        })
    } else {
      context.commit('SET_SNACKBAR', { color: 'error', message: 'No hay un contacto seleccionado.' })
      return false
    }
  },
  async obtenerERP (context, idd) {
    if (idd) {
      return await erp.encuestas.get(parseInt(idd))
        .then(async erp => {
          if (erp.codIpsBai) {
            erp.ips_bai = await covid.ipss.get(erp.codIpsBai)
          }
          if (erp.grupo_atencion_especial_id) {
            erp.grupo_atencion_especial = await covid.gruposAtencionEspecial.get(erp.grupo_atencion_especial_id)
          }
          return erp
        })
        .catch(() => {
          context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al obtener el registro de la encuesta.' })
          return null
        })
    }
  },
  async eliminarERP (context, idd) {
    if (idd) {
      return await erp.encuestas.delete(idd)
        .then(() => {
          context.commit('SET_SNACKBAR', { color: 'success', message: 'La Encuesta se eliminó correctamente.' })
          return true
        })
        .catch(() => {
          context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al eliminar la encuesta.' })
          return false
        })
    }
  },
  async eliminarNexo (context, encuesta) {
    if (encuesta) {
      return await erp.encuestas.put(encuesta)
        .then(() => {
          context.commit('SET_SNACKBAR', { color: 'success', message: 'El contacto se eliminó correctamente.' })
          return true
        })
        .catch(() => {
          context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al eliminar el contacto.' })
          return false
        })
    }
  },
  async guardarNexo (context, data) {
    if (data.encuestaIdd) {
      const encuesta = await erp.encuestas.get(parseInt(data.encuestaIdd))
      if (encuesta) {
        if (!data.nexo.uuid) data.nexo.uuid = `Nexo-${uuid.v1()}`
        if (data.indexNexo !== null) {
          encuesta.nexos.splice(data.indexNexo, 1, data.nexo)
        } else {
          encuesta.nexos.push(data.nexo)
        }
        return await erp.encuestas.put(encuesta).then(function (updated) {
          if (!updated) {
            context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al acualizar la encuesta.' })
            return false
          } else {
            context.commit('SET_SNACKBAR', { color: 'success', message: 'contacto guardado correctamente.' })
            return true
          }
        })
      } else {
        context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al obtener el registro de la encuesta.' })
        return false
      }
    } else {
      context.commit('SET_SNACKBAR', { color: 'error', message: 'No hay una encuesta a la cual asignar el contacto.' })
      return false
    }
  },
  async getERPTabla (context, datos) {
    const response = new ResponseTable()
    response.currentPage = datos.changeSearch ? 1 : datos.currentPage
    const offset = ((response.currentPage - 1) * datos.itemsPerPage)
    response.from = offset + 1
    let encuestas = erp.encuestas
    if (datos.search) {
      datos.options.sortBy = []
      encuestas = await encuestas.where('identificacion').startsWithAnyOfIgnoreCase(datos.search)
        .or('nombre').startsWithAnyOfIgnoreCase(datos.search)
        .or('nombre1').startsWithAnyOfIgnoreCase(datos.search)
        .or('nombre2').startsWithAnyOfIgnoreCase(datos.search)
        .or('apellido1').startsWithAnyOfIgnoreCase(datos.search)
        .or('apellido2').startsWithAnyOfIgnoreCase(datos.search)
        .reverse()
    } else {
      encuestas = await encuestas.toCollection().reverse()
    }
    response.total = await encuestas.count()
    if (datos.options.sortBy && datos.options.sortBy.length && datos.options.sortBy[0]) {
      const ORDER_BY = datos.options.sortBy[0]
      const primaryKeySet = new Set(await encuestas.primaryKeys())
      const pageKeys = []
      if (datos.options.sortDesc[0]) {
        await erp.erps
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
        await erp.erps
          .orderBy(ORDER_BY)
          .offset(offset)
          .until(() => pageKeys.length === datos.itemsPerPage)
          .eachPrimaryKey(id => {
            if (primaryKeySet.has(id)) {
              pageKeys.push(id)
            }
          })
      }
      response.items = await Promise.all(pageKeys.map(id => erp.erps.get(id)))
    } else {
      response.items = await encuestas.offset(offset).limit(datos.itemsPerPage).toArray()
    }
    response.to = offset + response.items.length
    response.totalPage = response.total ? Math.ceil(response.total / datos.itemsPerPage) : 1
    return response
  },
  async getERPSAfiliado (context, identificacion) {
    let encuestas = []
    if (identificacion) {
      encuestas = await erp.encuestas
        .where('identificacion')
        .equals(identificacion)
        .reverse()
        .toArray()
    }
    return encuestas
  },
  // Domicilios sin Encuestas
  async getDomiciliosTabla (context, datos) {
    const response = new ResponseTable()
    response.currentPage = datos.changeSearch ? 1 : datos.currentPage
    const offset = ((response.currentPage - 1) * datos.itemsPerPage)
    response.from = offset + 1
    let domicilios = domicilioSinEncuesta.domicilios
    if (datos.search) {
      domicilios = await domicilios.where('nombreDepartamento').startsWithAnyOfIgnoreCase(datos.search)
        .or('nombreMunicipio').startsWithAnyOfIgnoreCase(datos.search)
        .or('nombreBarrio').startsWithAnyOfIgnoreCase(datos.search)
        .or('tipificacion').startsWithAnyOfIgnoreCase(datos.search)
        .reverse()
    } else {
      domicilios = await domicilios.toCollection().reverse()
    }
    response.total = await domicilios.count()
    response.items = await domicilios.offset(offset).limit(datos.itemsPerPage).toArray()
    response.to = offset + response.items.length
    response.totalPage = response.total ? Math.ceil(response.total / datos.itemsPerPage) : 1
    return response
  },
  async obtenerDomicilio (context, idd) {
    if (idd) {
      return await domicilioSinEncuesta.domicilios.get(parseInt(idd))
        .then(async domicilio => {
          return domicilio
        })
        .catch(() => {
          context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al obtener el registro del domicilio.' })
          return null
        })
    }
  },
  async guardarDomicilio (context, domicilio) {
    if (!domicilio.uuid) domicilio.uuid = `Domicilio-${uuid.v1()}`
    return await domicilioSinEncuesta.domicilios[domicilio.idd ? 'put' : 'add'](domicilio)
      .then(() => {
        context.commit('SET_SNACKBAR', { color: 'success', message: 'El domicilio se ha guardado correctamente.' })
        return true
      })
      .catch(() => {
        context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al guardar el domicilio.' })
        return false
      })
  },
  async eliminarDomicilio (context, idd) {
    if (idd) {
      return await domicilioSinEncuesta.domicilios.delete(idd)
        .then(() => {
          context.commit('SET_SNACKBAR', { color: 'success', message: 'El domicilio se eliminó correctamente.' })
          return true
        })
        .catch(() => {
          context.commit('SET_SNACKBAR', { color: 'error', message: 'Error al eliminar el domicilio.' })
          return false
        })
    }
  }
}

// mutations
const mutations = {
  // SET_ENCUESTADOS_DI (state, encuestados) {
  //   console.log('entra a poner', di.encuestados.count())
  //   di.encuestados[di.encuestados.count() ? 'bulkPut' : 'bulkAdd'](encuestados, { allKeys: true })
  // }
}

export default {
  state,
  getters,
  actions,
  mutations
}
