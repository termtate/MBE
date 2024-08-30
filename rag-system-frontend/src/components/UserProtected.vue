<template>
  <el-container class="protected-container" v-if="isVisible">
    <el-header class="title">
      <transition name="slide-fade">
        <h2>Protected Resource</h2>
      </transition>
    </el-header>
    <el-main>
      <el-button 
        type="primary" 
        @click="fetchProtectedData" 
        :loading="loading" 
        class="fetch-button"
      >
        Fetch Protected Data
      </el-button>
      <transition name="fade">
        <el-card v-if="data" class="data-container">
          <pre>{{ data }}</pre>
        </el-card>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      data: null, // 用于存储获取到的受保护数据
      loading: false, // 控制按钮加载状态
      isVisible: false, // 控制整个页面内容的显示状态
    };
  },
  created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/login');
    } else {
      setTimeout(() => {
        this.isVisible = true; // 页面加载时显示内容
      }, 200);
    }
  },
  methods: {
    async fetchProtectedData() {
      this.loading = true; // 开始加载
      const token = localStorage.getItem('token');
      const response = await fetch('/protected', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.loading = false; // 结束加载
      if (response.ok) {
        this.data = await response.json();
      } else {
        this.$message.error('Failed to fetch protected data.');
      }
    },
  },
};
</script>

<style scoped>
/* 页面整体动效 */
.protected-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 使内容在页面中上下居中 */
  background-color: #444444; /* 背景颜色 */
  color: white; /* 文字颜色 */
  text-align: center; /* 居中文本 */
  padding: 20px;
  box-sizing: border-box;
  opacity: 0;
  animation: fadeIn 1s forwards ease-in-out;
}

/* 标题动效 */
.title h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: white;
}

/* 按钮动效 */
.fetch-button {
  background-color: #7cb6c3; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fetch-button:hover {
  background-color: #68a4b2; /* 按钮悬停时的颜色 */
  transform: scale(1.05); /* 按钮悬停时放大 */
}

.fetch-button:active {
  transform: scale(0.95); /* 按钮点击时缩小 */
}

/* 卡片动效 */
.data-container {
  margin-top: 20px;
  background-color: #555555; /* 数据容器背景颜色 */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 80%;
  overflow-x: auto;
  color: #e0e0e0; /* 数据内容的颜色 */
}

/* 动效样式 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
