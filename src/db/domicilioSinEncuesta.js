import Dexie from 'dexie'

const domicilioSinEncuesta = new Dexie('domicilioSinEncuesta')
domicilioSinEncuesta.version(1).stores({
  domicilios: 'id,status,tipificacion'
})

domicilioSinEncuesta.version(2).stores({
  domicilios: 'idd++,id,status,tipificacion,nombreDepartamento,nombreMunicipio,nombreBarrio'
}).upgrade(tx => {
  return tx.encuestas.toCollection().modify(x => {
    x.uuid = x.uuid || null
    x.nombreDepartamento = x.departamento ? x.departamento.nombre : null
    x.nombreMunicipio = x.municipio ? x.municipio.nombre : null
    x.nombreBarrio = x.barrio ? x.barrio.nombre : null
  })
})

export default domicilioSinEncuesta
