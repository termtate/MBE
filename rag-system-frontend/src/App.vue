<template>
  <div id="app">
    <nav v-if="isLoggedIn">
      <ul>
        <!-- 根据用户角色显示不同的菜单 -->
        <li v-if="isAdmin"><router-link to="/user-management">User Management</router-link></li>
        <li v-if="isAdmin"><router-link to="/data-management">Data Management</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
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
      isLoggedIn: !!localStorage.getItem('token'), // 初始登录状态
      isAdmin: false, // 管理员状态
    };
  },
  watch: {
    // 监控路由变化并更新登录状态
    $route() {
      this.updateAuthStatus();
    }
  },
  methods: {
    updateAuthStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;

      if (this.isLoggedIn) {
        try {
          // 解析 JWT Token
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const user = JSON.parse(jsonPayload);

          // 调试信息：打印整个 JWT payload
          console.log('Parsed JWT Payload:', user);

          // 检查 role 字段是否在 sub 对象中
          if (user.sub && user.sub.role) {
            this.isAdmin = user.sub.role === 'admin';
          } else {
            this.isAdmin = false;
          }

          // 检查是否正确设置 isAdmin
          console.log('Is Admin:', this.isAdmin);
        } catch (error) {
          console.error('Error parsing JWT:', error);
          this.isAdmin = false;
        }
      } else {
        this.isAdmin = false;
      }
    },
    logout() {
      // 移除 token 并重定向到登录页面
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.$router.push('/login');
    }
  },
  mounted() {
    this.updateAuthStatus(); // 初始化时检查登录状态
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
