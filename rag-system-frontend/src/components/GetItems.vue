<template>
    <div>
      <h2>Items</h2>
      <button @click="fetchItems">Fetch Items</button>
      <div v-if="items">
        <pre>{{ items }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        items: null
      };
    },
    methods: {
      async fetchItems() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://127.0.0.1:5000/items', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.items = response.data;
        } catch (error) {
          console.error('Error fetching items:', error);
          alert('Failed to fetch items.');
        }
      }
    }
  };
  </script>
  