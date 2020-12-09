import Dexie from 'dexie'

const erp = new Dexie('erp')
erp.version(1).stores({
  encuestas: 'id,identificacion,nombre1,nombre2,apellido1,apellido2'
})

erp.version(5).stores({
  encuestas: 'idd++,id,uuid,identificacion,nombre1,nombre2,apellido1,apellido2,nombre'
}).upgrade(tx => {
  return tx.encuestas.toCollection().modify(x => {
    x.uuid = x.uuid || null
    x.nombre = [x.nombre1, x.nombre2, x.apellido1, x.apellido2].filter(x => x).join(' ')
  })
})

export default erp
