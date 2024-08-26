<template>
  <div id="app">
    <nav v-if="isLoggedIn">
      <ul>
        <li><router-link to="/protected">Protected</router-link></li>
        <li><router-link to="/add-item">Add Item</router-link></li>
        <li><router-link to="/get-items">Get Items</router-link></li>
        <li><router-link to="/update-item">Update Item</router-link></li>
        <li><router-link to="/delete-item">Delete Item</router-link></li>
        <li><a href="#" @click="logout">Logout</a></li>
      </ul>
    </nav>
    <nav v-else>
      <ul>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('token') // 初始登录状态
    };
  },
  watch: {
    // 监控路由变化并更新登录状态
    $route() {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  },
  methods: {
    logout() {
      // 移除 token 并重定向到登录页面
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  }
};
</script>

<style>
nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
  cursor: pointer;
}
</style>
