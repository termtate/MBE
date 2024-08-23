import Vue from 'vue';
import Router from 'vue-router';

import AddItem from './components/AddItem.vue';
import GetItems from './components/GetItems.vue';
import UpdateItem from './components/UpdateItem.vue';
import DeleteItem from './components/DeleteItem.vue';
import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';
import UserProtected from './components/UserProtected.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/register', component: UserRegister },
    { path: '/login', component: UserLogin },
    { path: '/protected', component: UserProtected },
    { path: '/add-item', component: AddItem },
    { path: '/get-items', component: GetItems },
    { path: '/update-item', component: UpdateItem },
    { path: '/delete-item', component: DeleteItem }
  ]
});
