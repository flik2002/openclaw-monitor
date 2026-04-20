import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Monitor',
    component: () => import('@/views/monitor/MonitorPage.vue'),
    meta: { requiresAuth: false } // 访客可访问
  },
  {
    path: '/monitor-v2',
    name: 'MonitorV2',
    component: () => import('@/views/monitor/MonitorPageV2.vue'),
    meta: { requiresAuth: false } // 访客可访问
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/auth/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue')
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/auth/ResetPassword.vue')
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/legal',
    name: 'Legal',
    children: [
      {
        path: 'privacy',
        name: 'PrivacyPolicy',
        component: () => import('@/views/legal/PrivacyPolicy.vue')
      },
      {
        path: 'terms',
        name: 'TermsOfService',
        component: () => import('@/views/legal/TermsOfService.vue')
      },
      {
        path: 'disclaimer',
        name: 'Disclaimer',
        component: () => import('@/views/legal/Disclaimer.vue')
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/legal/Contact.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 需要认证的路由
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
    return
  }

  // 需要管理员权限的路由
  if (to.meta.requiresAdmin) {
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      next({ name: 'Monitor' })
      return
    }
  }

  next()
})

export default router
