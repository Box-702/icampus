import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import ChatView from '@/views/ChatView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  { path: '/login', component: LoginView },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: 'chat' },
      { path: 'chat', component: ChatView },
      { path: 'profile', component: ProfileView }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  // Pinia must be used inside the guard (after app initialization)
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)

  if (requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
