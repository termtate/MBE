<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Register</button>
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
      async register() {
        try {
          await axios.post('http://127.0.0.1:5000/register', {
            username: this.username,
            password: this.password
          });
          alert('Registration successful!');
        } catch (error) {
          console.error('Registration error:', error);
          alert('Registration failed.');
        }
      }
    }
  };
  </script>
  