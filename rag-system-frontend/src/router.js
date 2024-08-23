import { createRouter, createWebHistory } from 'vue-router';

import AddItem from './components/AddItem.vue';
import GetItems from './components/GetItems.vue';
import UpdateItem from './components/UpdateItem.vue';
import DeleteItem from './components/DeleteItem.vue';
import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';
import UserProtected from './components/UserProtected.vue';

const routes = [
  { path: '/register', component: UserRegister },
  { path: '/login', component: UserLogin },
  { path: '/protected', component: UserProtected },
  { path: '/add-item', component: AddItem },
  { path: '/get-items', component: GetItems },
  { path: '/update-item', component: UpdateItem },
  { path: '/delete-item', component: DeleteItem }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
