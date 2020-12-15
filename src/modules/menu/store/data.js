// char data
export const itemsMenu = [
  {
    id: 1,
    title: 'Inicio',
    icon: 'mdi-home',
    color: 'primary',
    routeName: 'Home',
    typeRoute: 'general'
  },
  {
    id: 2,
    title: 'Complementos',
    icon: 'mdi-cogs',
    color: 'teal darken-2',
    routeName: 'Complementos',
    typeRoute: 'general'
  },
  {
    id: 35,
    title: 'Sincronizadores',
    icon: 'mdi-sync',
    color: 'blue',
    routeName: 'Sincronizador',
    typeRoute: 'general'
  },
  {
    id: 6,
    title: 'Fuentes de Datos',
    icon: 'mdi-database-cog',
    color: 'indigo',
    routeName: 'FuentesDatos',
    typeRoute: 'general'
  },
  {
    id: 18,
    title: 'ERP',
    subtitle: 'Encuestas de Riesgo Poblacional',
    icon: 'mdi-clipboard-plus-outline',
    color: 'error',
    routeName: 'ERP',
    typeRoute: 'covid'
  },
  {
    id: 36,
    title: 'Domicilios sin Encuestas',
    subtitle: 'Domicilios donde no se realizarón ERP',
    icon: 'mdi-home-alert',
    color: 'purple',
    routeName: 'DomicilioSinEncuesta',
    typeRoute: 'covid'
  },
  // RCV
  {
    id: 27,
    title: 'ERCV',
    subtitle: 'Encuestas de Riesgo Cardiovascular',
    icon: 'mdi-clipboard-plus-outline',
    color: 'purple',
    routeName: 'EncuestasRCV',
    typeRoute: 'aps'
  },
  // DI
  {
    id: 30,
    title: 'EDI',
    subtitle: 'Encuestas de Demanda Inducida',
    icon: 'mdi-clipboard-plus-outline',
    color: 'indigo',
    routeName: 'DemandaInducida',
    typeRoute: 'demandaInducida'
  }
]
