import { createRouter, createWebHistory } from 'vue-router';

import AddItem from './components/AddItem.vue';
import GetItems from './components/GetItems.vue';
import UpdateItem from './components/UpdateItem.vue';
import DeleteItem from './components/DeleteItem.vue';
import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';
import UserProtected from './components/UserProtected.vue';
import UserManagement from './components/UserManagement.vue';
import ChatWindow from './components/ChatWindow.vue'; // 新增聊天页面组件
import DataManagement from './components/DataManagement.vue'; 

function requireAuth(to, from, next) {
  const token = localStorage.getItem('token');
  if (!token) {
    next('/login');
  } else {
    const user = JSON.parse(atob(token.split('.')[1]));
    if (to.meta.requiresAdmin && user.sub.role !== 'admin') {
      next('/chat'); // 如果不是管理员，重定向到聊天页面
    } else {
      next();
    }
  }
}

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes: [
    { path: '/', redirect: '/login' }, // 默认跳转到登录页面
    { path: '/register', component: UserRegister },
    { path: '/login', component: UserLogin },
    { path: '/protected', component: UserProtected, beforeEnter: requireAuth },
    { path: '/add-item', component: AddItem, beforeEnter: requireAuth },
    { path: '/get-items', component: GetItems, beforeEnter: requireAuth },
    { path: '/update-item', component: UpdateItem, beforeEnter: requireAuth },
    { path: '/delete-item', component: DeleteItem, beforeEnter: requireAuth },
    { path: '/user-management', component: UserManagement, beforeEnter: requireAuth, meta: { requiresAdmin: true } },
    { path: '/data-management', component: DataManagement, beforeEnter: requireAuth, meta: { requiresAdmin: true } }, 
    { path: '/chat', component: ChatWindow, beforeEnter: requireAuth } // 聊天页面
  ]
});

export default router;
