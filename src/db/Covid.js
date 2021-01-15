import Dexie from 'dexie'

const covid = new Dexie('covid')
covid.version(10).stores({
  departamentos: 'id,nombre',
  tamizadores: 'id,nombre',
  causalesVisitaFallida: 'id,causal',
  ipss: '&codigohabilitacion,nombre',
  epss: 'id,codigo,nombre',
  tiposIdentificacion: 'id',
  gruposAtencionEspecial: 'id',
  sintomas: 'id',
  afiliados: 'id,numero_documento_identidad,nombre1,nombre2,apellido1,apellido2',
  parentescos: 'id',
  comorbilidades: 'codigo',
  barrios: 'id,municipio_id'
})

export default covid
