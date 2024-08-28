<template>
  <div class="container">
    <form @submit.prevent="login">
      <h2>Login...</h2>
      <div>
        <label for="username">UserName</label>
        <input v-model="username" type="text" id="username" placeholder="Your username" />
      </div>
      <div>
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Your password" />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <footer>MBE@2024</footer>
  </div>
</template>


<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '' // 用于显示错误消息
    };
  },
  methods: {
    async login() {
      // 表单验证
      if (!this.username || !this.password) {
        this.errorMessage = 'Please enter both username and password.';
        return;
      }

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.access_token); // 存储 JWT token
          this.$router.push('/protected'); // 登录成功后重定向
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Login failed.';
        }
      } catch (error) {
        this.errorMessage = 'Network error or server unreachable.';
      }
    }
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: 'Arial', sans-serif; /* 使用通用的无衬线字体 */
}

.container {
  display: flex;
  justify-content: center;
  /* background-image: url('@/assets/background.png'); */
  background-color: #444444;
  background-size: cover; /* 让背景图片覆盖整个页面 */
  background-position: center; /* 居中显示背景图片 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  align-items: center;
  min-height: 99vh; 
  flex-direction: column;
  position: relative;
  /* width: 100%; */
  border-radius: 30px;
}

form {
  background-color: #ffffff;
  padding: 50px;
  border-radius: 30px;
  box-shadow: 8px 8px 30px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  text-align: center;
  opacity: 0.9; 
}

h2 {
  margin-bottom: 25px;
  font-size: 42px;
  color: #333;
  text-shadow: -8px 8px 5px rgba(108, 108, 108, 0.5);
}

form div {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
}

form label {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

form input {
  width: 100%;
  padding: 15px;
  border-radius: 20px;
  border: 1px solid #424242;
  background-color: #f5f5f5;
  box-shadow: -10px 15px 5px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  
}

button {
  padding: 15px;
  width: 100%;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 18px;
  box-shadow: -10px 15px 5px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: #003d80;
}

footer {
  margin-top: 20px;
  color: #333;
  font-weight: bold;
  font-size: 14px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #1c1c1c;
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
  box-shadow: -10px 8px 5px rgba(0, 0, 0, 0.2);
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

</style>
