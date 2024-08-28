<template>
  <div id="app">
    <!-- 热点区域，用于检测鼠标进入/离开 -->
    <div class="hotspot"
         @mouseenter="showNav"
         @mouseleave="delayedHideNav"></div>

    <!-- 登录后的导航栏 -->
    <nav v-if="isLoggedIn" @mouseenter="cancelHideNav" @mouseleave="delayedHideNav" :class="{ visible: navVisible }">
      <ul>
        <!-- 如果是管理员，显示“用户管理”、“数据管理”和“聊天” -->
        <li v-if="isAdmin"><router-link to="/user-management">User Management</router-link></li>
        <li v-if="isAdmin"><router-link to="/data-management">Data Management</router-link></li>
        <!-- 如果是普通用户或管理员，显示“聊天” -->
        <li><router-link to="/chat">Chat</router-link></li>
        <li><a href="#" @click="logout">Logout</a></li>
      </ul>
    </nav>
    
    <!-- 未登录时显示“注册”和“登录” -->
    <nav v-else @mouseenter="cancelHideNav" @mouseleave="delayedHideNav" :class="{ visible: navVisible }">
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
  data() {
    return {
      navVisible: false, // 控制导航栏的显示与隐藏
      isLoggedIn: !!localStorage.getItem('token'), // 初始登录状态
      isAdmin: false, // 管理员状态
      hideTimeout: null, // 延迟隐藏的定时器
    };
  },
  watch: {
    // 监控路由变化并更新登录状态
    $route() {
      this.updateAuthStatus();
    }
  },
  methods: {
    showNav() {
      this.navVisible = true;
      // 取消任何隐藏的定时器
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    },
    delayedHideNav() {
      // 延迟隐藏导航栏，确保用户有足够时间将鼠标移到导航栏上
      this.hideTimeout = setTimeout(() => {
        this.navVisible = false;
      }, 300); // 300ms延迟
    },
    cancelHideNav() {
      // 当鼠标进入导航栏时，取消隐藏的定时器
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    },
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

          // 判断用户角色是否为管理员
          this.isAdmin = user.sub && user.sub.role === 'admin';
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

<style scoped>
/* 热点区域样式，宽度和高度决定鼠标触发的范围 */
.hotspot {
  position: fixed;
  top: 50%;
  left: 0;
  width: 300px; /* 设置为1厘米左右 */
  height: 500px; /* 根据需要调整高度 */
  transform: translateY(-50%);
  z-index: 999; /* 确保热点区域在前 */
}

/* 导航栏初始状态为隐藏 */
nav {
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 1000;
  pointer-events: none; /* 默认情况下，导航栏不接受鼠标事件 */
}

/* 当导航栏可见时，设置透明度为1，并允许鼠标交互 */
nav.visible {
  opacity: 1;
  pointer-events: auto; /* 导航栏可见时允许鼠标事件 */
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 设置按钮之间的间距 */
}

nav ul li {
  display: block;
  cursor: pointer;
}

nav ul li a {
  display: block;
  padding: 15px 30px;
  background-color: #666666;
  color: white;
  text-decoration: none;
  border-radius: 20px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 18px;
  text-align: center;
  width: 150px; /* 设置按钮的固定宽度 */
  box-shadow: -10px 8px 30px rgba(0, 0, 0, 0.3);
}

nav ul li a:hover {
  background-color: #555555;
}
</style>
