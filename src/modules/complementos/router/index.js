export default {
  path: '/',
  component: () => import('@/layouts/full-layout/Layout'),
  children: [
    {
      path: 'complementos',
      name: 'Complementos',
      component: () => import('@/modules/complementos/views/Index'),
      meta: {
        requiresAuth: true,
        requiresOnLine: false,
        // requiresPermission: 'demandaInducida-index',
        avatar: {
          icon: 'mdi-cogs',
          color: 'teal darken-2'
        }
      }
    }
  ]
}
