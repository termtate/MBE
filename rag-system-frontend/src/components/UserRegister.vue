<template>
  <div class="container">
    <he2>MBE</he2>
    <el-form @submit.prevent="register" ref="registerForm">
      <h2>Register</h2>
      <el-form-item label="Username" :error="usernameError">
        <el-input v-model="username" placeholder="Your username"></el-input>
      </el-form-item>
      <el-form-item label="Password" :error="passwordError">
        <el-input v-model="password" type="password" placeholder="Your password"></el-input>
      </el-form-item>
      <el-button type="primary" @click="register" class="register-button">Register</el-button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p> <!-- 显示错误消息 -->
    </el-form>
    <footer>MBE@2024</footer>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const usernameError = ref('');
    const passwordError = ref('');

    const validateForm = () => {
      let valid = true;
      usernameError.value = '';
      passwordError.value = '';
      
      if (!username.value) {
        usernameError.value = 'Please enter your username.';
        valid = false;
      }
      
      if (!password.value) {
        passwordError.value = 'Please enter your password.';
        valid = false;
      }

      return valid;
    };

    const register = async () => {
      if (!validateForm()) {
        return;
      }

      try {
        await axios.post('http://127.0.0.1:5000/register', {
          username: username.value,
          password: password.value
        });
        alert('Registration successful!');
        errorMessage.value = ''; // 清除错误消息
      } catch (error) {
        console.error('Registration error:', error);
        errorMessage.value = 'Registration failed. Please try again.'; // 设置错误消息
      }
    };

    return {
      username,
      password,
      errorMessage,
      usernameError,
      passwordError,
      register
    };
  }
};
</script>

<style scoped>
/* 基础样式保持不变 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Arial', sans-serif;
}

.container {
  display: flex;
  justify-content: center;
  background-color: #444444;
  align-items: center;
  min-height: 98vh; 
  flex-direction: column;
  position: relative;
  border-radius: 30px;
  animation: fadeIn 1s ease-in-out; /* 添加淡入动画 */
}

.el-form {
  background-color: #ffffff;
  padding: 50px;
  border-radius: 40px;
  border-style: double;
  border-width: 10px;
  box-shadow: -20px 30px 20px rgba(0, 0, 0, 0.412);
  max-width: 500px;
  width: 100%;
  text-align: center;
  opacity: 0.9; 
  transform: translateY(-30px);
  animation: slideUp 1s ease-in-out forwards; /* 添加上滑动画 */
}

h2 {
  margin-top: 10px;
  margin-bottom: 60px;
  font-size: 42px;
  color: #333;
  text-shadow: -8px 8px 5px rgba(108, 108, 108, 0.5);
  animation: textFocusIn 1.5s ease-in-out; /* 添加文本聚焦动画 */
}

he2 {
  color: #ffffff;
  font-size: 62px;
  margin-top: -130px; 
  margin-bottom: 90px;
  text-align: center;
  font-style: oblique;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  text-shadow: 
    0px 0px 20px #eaeaea,
    -30px 30px 5px #1c1c1c,
    30px -30px 5px #838383;
  border: #ffffff;
  animation: glowText 2s infinite alternate; /* 添加光晕闪烁效果 */
}

footer {
  margin-top: 20px;
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #1c1c1c;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: -10px 8px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(50px);
  animation: slideInFooter 1s ease-in-out 1.5s forwards; /* 添加底部滑入动画，带延迟 */
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* 新增输入框样式 */
.input-field .el-input__inner {
  border: 2px solid #ccc;
  border-radius: 20px;
  padding: 10px 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
  width: 100%;
}

.input-field .el-input__inner:hover {
  border-color: #999;
}

.input-field .el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

/* 添加图标样式调整 */
.input-field .el-input__prefix {
  color: #409EFF;
  transition: color 0.3s;
}

.input-field:hover .el-input__prefix,
.input-field .el-input__inner:focus + .el-input__prefix {
  color: #66b1ff;
}

/* 表单项动画 */
.form-item {
  margin-bottom: 30px;
  transition: transform 0.3s;
  display: flex;
  flex-direction: row;
  width: 100%; /* 确保表单项容器宽度一致 */
}

.form-item:hover {
  transform: scale(1.02);
}

/* 登录按钮样式 */
.register-button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  transition: background-color 0.3s, transform 0.3s;
  font-size: 16px;
  background-color: #16b3b0;
}

.register-button:hover {
  background-color: #3f9f9d;
  transform: translateY(-2px);
}

/* 动画部分 */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes textFocusIn {
  0% {
    letter-spacing: 1em;
    transform: translateZ(300px) translateX(60px);
    opacity: 0;
  }
  100% {
    transform: translateZ(12px) translateX(0);
    opacity: 1;
  }
}

@keyframes glowText {
  0% { text-shadow: 0px 0px 20px #ffffff, -30px 30px 5px #1c1c1c, 30px -30px 5px #838383; }
  100% { text-shadow: 0px 0px 30px #1afffb, -30px 30px 10px #23d7ff, 30px -30px 10px #838383; }
}

@keyframes slideInFooter {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
</style>
