<template>
    <div>
      <h2>Search Knowledge Base</h2>
      <input v-model="searchKeyword" placeholder="Enter keyword..." />
      <button @click="fetchItems">Search</button>
  
      <h3>Results</h3>
      <ul>
        <li v-for="item in items" :key="item.id">
          ID: {{ item.id }}, Data: {{ item.data }}, Embedding: {{ item.embedding ? item.embedding.join(', ') : 'N/A' }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        items: [],
        searchKeyword: ''  // 绑定到搜索输入框的关键字
      };
    },
    methods: {
      async fetchItems() {
        try {
          const token = localStorage.getItem('token');
          console.log("Searching for items with keyword:", this.searchKeyword);
  
          const response = await fetch(`/knowledge_base?keyword=${encodeURIComponent(this.searchKeyword)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            console.error(`Failed to fetch items: ${response.status} ${response.statusText}`);
            return;
          }
  
          // 尝试解析响应为 JSON
          const data = await response.json();
          this.items = data;
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      }
    }
  };
  </script>
  