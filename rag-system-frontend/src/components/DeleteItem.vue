<template>
    <div>
      <h2>Delete Knowledge Base Entry</h2>
      <input v-model="id" placeholder="Enter ID..." />
      <button @click="deleteItem">Delete Entry</button>
    </div>
  </template>
  
  <script>
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
          const response = await fetch(`/knowledge_base/${this.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            console.error("Failed to delete item:", response.statusText);
            return;
          }
  
          alert("Entry deleted successfully!");
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      }
    }
  };
  </script>
  