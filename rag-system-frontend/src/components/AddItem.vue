<template>
    <div>
      <h2>Add Knowledge Base Entry</h2>
      <textarea v-model="data" placeholder="Enter data..."></textarea>
      <input v-model="embedding" placeholder="Enter embedding (optional, comma separated)"/>
      <button @click="addItem">Add Item</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: '',  // 知识库的数据
        embedding: ''  // 可选的嵌入向量
      };
    },
    methods: {
      async addItem() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/knowledge_base', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              data: this.data,
              embedding: this.embedding ? this.embedding.split(',').map(Number) : null
            })
          });
  
          if (response.ok) {
            alert('Item added successfully!');
            this.data = '';
            this.embedding = '';
          } else {
            alert('Failed to add item');
          }
        } catch (error) {
          console.error('Error adding item:', error);
        }
      }
    }
  };
  </script>
  