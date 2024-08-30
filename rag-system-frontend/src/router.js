import { createRouter, createWebHistory } from 'vue-router';

import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';
import UserProtected from './components/UserProtected.vue';
import UserManagement from './components/UserManagement.vue';
import ChatWindow from './components/ChatWindow.vue';
import DataManagement from './components/DataManagement.vue';
import { ElMessage } from 'element-plus';

function requireAuth(to, from, next) {
  const token = localStorage.getItem('token');
  if (!token) {
    next('/login');
  } else {
    const user = JSON.parse(atob(token.split('.')[1]));
    if (to.meta.requiresAdmin && user.sub.role !== 'admin') {
      ElMessage.warning('You need admin privileges to access this section.');
      next('/chat');
    } else {
      next();
    }
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/register', component: UserRegister },
    { path: '/login', component: UserLogin },
    { path: '/protected', component: UserProtected, beforeEnter: requireAuth },
    { path: '/user-management', component: UserManagement, beforeEnter: requireAuth, meta: { requiresAdmin: true } },
    { path: '/data-management', component: DataManagement, beforeEnter: requireAuth, meta: { requiresAdmin: true } }, 
    { path: '/chat', component: ChatWindow, beforeEnter: requireAuth }
  ]
});

export default router;
