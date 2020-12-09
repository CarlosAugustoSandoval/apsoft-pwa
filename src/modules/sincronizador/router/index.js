export default {
  path: '/',
  component: () => import('@/layouts/full-layout/Layout'),
  children: [
    {
      path: 'sincronizador',
      name: 'Sincronizador',
      component: () => import('@/modules/sincronizador/views/Index'),
      meta: {
        requiresAuth: true,
        avatar: {
          icon: 'mdi-sync',
          color: 'blue'
        }
      }
    }
  ]
}
