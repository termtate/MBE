import { createRouter, createWebHistory } from 'vue-router';

import AddItem from './components/AddItem.vue';
import GetItems from './components/GetItems.vue';
import UpdateItem from './components/UpdateItem.vue';
import DeleteItem from './components/DeleteItem.vue';
import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';
import UserProtected from './components/UserProtected.vue';

function requireAuth(to, from, next) {
  if (!localStorage.getItem('token')) {
    next('/login');
  } else {
    next();
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
    { path: '/delete-item', component: DeleteItem, beforeEnter: requireAuth }
  ]
});

export default router;
