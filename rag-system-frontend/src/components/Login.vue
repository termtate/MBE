<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://127.0.0.1:5000/login', {
            username: this.username,
            password: this.password
          });
          localStorage.setItem('token', response.data.access_token);
          alert('Login successful!');
        } catch (error) {
          console.error('Login error:', error);
          alert('Login failed.');
        }
      }
    }
  };
  </script>
  