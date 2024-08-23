<template>
    <div>
      <h2>Protected Resource</h2>
      <button @click="fetchProtectedData">Fetch Protected Data</button>
      <div v-if="data">
        <pre>{{ data }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: null
      };
    },
    methods: {
      async fetchProtectedData() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://127.0.0.1:5000/protected', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.data = response.data;
        } catch (error) {
          console.error('Error fetching protected data:', error);
          alert('Failed to fetch protected data.');
        }
      }
    }
  };
  </script>
  