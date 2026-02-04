import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isLogin = !!token

  // ยังไม่ login แต่จะเข้า dashboard
  if (to.meta.requiresAuth && !isLogin) {
    next('/')
    return
  }

  // login แล้ว แต่จะกลับ login / register
  if (to.meta.guestOnly && isLogin) {
    next('/dashboard')
    return
  }

  next()
})

export default router
