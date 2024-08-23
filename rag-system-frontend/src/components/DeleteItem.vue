<template>
    <div>
      <h2>Delete Item</h2>
      <form @submit.prevent="deleteItem">
        <input v-model="id" placeholder="Item ID" />
        <button type="submit">Delete Item</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        id: ''
      };
    },
    methods: {
      async deleteItem() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://127.0.0.1:5000/items/${this.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          alert('Item deleted!');
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete item.');
        }
      }
    }
  };
  </script>
  