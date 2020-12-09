export default {
  path: '/auth',
  redirect: { name: 'Login' },
  component: () => import('@/layouts/blank-layout/Blanklayout'),
  children: [
    {
      path: 'login',
      name: 'Login',
      component: () => import('@/modules/auth/views/Login'),
      meta: {
        requiresAuth: false
      }
    }
  ]
}
