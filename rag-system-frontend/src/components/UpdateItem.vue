<template>
  <div>
    <h2>Update Item</h2>
    <form @submit.prevent="updateItem">
      <input v-model="id" placeholder="Item ID" />
      <input v-model="text" placeholder="Text" />
      <input v-model="embedding" placeholder="Embedding (comma separated)" />
      <input v-model="vector" placeholder="Vector (comma separated)" />
      <button type="submit">Update Item</button>
    </form>
  </div>
</template>
  
<script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        id: '',
        text: '',
        embedding: '',
        vector: ''
      };
    },
    methods: {
      async updateItem() {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://127.0.0.1:5000/items/${this.id}`, {
            text: this.text,
            embedding: this.embedding.split(',').map(Number),
            vector: this.vector.split(',').map(Number)
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          alert('Item updated!');
        } catch (error) {
          console.error('Error updating item:', error);
          alert('Failed to update item.');
        }
      }
    }
  };
</script>
  