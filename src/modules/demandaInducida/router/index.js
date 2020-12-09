export default {
  path: '/',
  component: () => import('@/layouts/full-layout/Layout'),
  children: [
    {
      path: 'demanda-inducida',
      name: 'DemandaInducida',
      component: () => import('@/modules/demandaInducida/views/Encuestados'),
      meta: {
        requiresAuth: true,
        requiresOnLine: false,
        requiresPermission: 'demandaInducida-index',
        avatar: {
          icon: 'mdi-clipboard-plus-outline',
          color: 'indigo'
        }
      }
    }
  ]
}
