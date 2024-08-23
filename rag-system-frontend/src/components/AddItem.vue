<template>
    <div>
      <h2>Add Item</h2>
      <form @submit.prevent="addItem">
        <input v-model="text" placeholder="Text" />
        <input v-model="embedding" placeholder="Embedding (comma separated)" />
        <input v-model="vector" placeholder="Vector (comma separated)" />
        <button type="submit">Add Item</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        text: '',
        embedding: '',
        vector: ''
      };
    },
    methods: {
      async addItem() {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://127.0.0.1:5000/items', {
            text: this.text,
            embedding: this.embedding.split(',').map(Number),
            vector: this.vector.split(',').map(Number)
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          alert('Item added!');
        } catch (error) {
          console.error('Error adding item:', error);
          alert('Failed to add item.');
        }
      }
    }
  };
  </script>
  