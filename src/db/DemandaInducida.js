import Dexie from 'dexie'

const di = new Dexie('demandaInducida')
di.version(1).stores({
  encuestados: 'id,numero_identificacion,primer_nombre,segundo_nombre,primer_apellido,segundo_apellido,diagnostico_febrero,cronico,maternoperinatal,alto_costo'
})

di.version(4).stores({
  encuestados: 'id,numero_identificacion,primer_nombre,segundo_nombre,primer_apellido,segundo_apellido,nombre,diagnostico_febrero,cronico,maternoperinatal,alto_costo'
}).upgrade(tx => {
  return tx.encuestados.toCollection().modify(encuestado => {
    encuestado.nombre = [encuestado.primer_nombre, encuestado.segundo_nombre, encuestado.primer_apellido, encuestado.segundo_apellido].filter(x => x).join(' ')
  })
})

export default di
