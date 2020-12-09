export default {
  path: '/',
  component: () => import('@/layouts/full-layout/Layout'),
  children: [
    {
      path: 'covid/erp',
      name: 'ERP',
      component: () => import('@/modules/covid/views/erp/Encuestas'),
      meta: {
        requiresAuth: true,
        requiresOnLine: false,
        requiresPermission: 'covid-tamizajeVer',
        avatar: {
          icon: 'mdi-clipboard-plus-outline',
          color: 'red'
        }
      }
    },
    {
      path: 'covid/domicilio-sin-encuesta',
      name: 'DomicilioSinEncuesta',
      component: () => import('@/modules/covid/views/domicilioSinEncuesta/Domicilios'),
      meta: {
        requiresAuth: true,
        requiresOnLine: false,
        requiresPermission: 'covid-DomicilioSinEncuestaIndex',
        avatar: {
          icon: 'mdi-home-alert',
          color: 'purple'
        }
      }
    },
    {
      path: 'covid/erp/detalle/:idd/step/:step',
      name: 'DetalleERP',
      props: true,
      component: () => import('@/modules/covid/views/erp/DetalleEncuesta'),
      meta: {
        requiresAuth: true,
        requiresOnLine: false,
        requiresPermission: 'covid-tamizajeVer',
        avatar: {
          icon: 'mdi-clipboard-text',
          color: 'green'
        }
      }
    },
    {
      path: 'covid/erp/:idd/nexo/:index/step/:step',
      name: 'DetalleNexo',
      props: true,
      component: () => import('@/modules/covid/views/nexo/DetalleNexo'),
      meta: {
        requiresAuth: true,
        requiresOnLine: false,
        requiresPermission: 'covid-tamizajeVer',
        avatar: {
          icon: 'mdi-clipboard-text',
          color: 'green'
        }
      }
    }
  ]
}
