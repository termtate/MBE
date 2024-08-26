<template>
  <div>
    <h2>Update Knowledge Base Entry</h2>
    <input v-model="id" placeholder="Enter ID..." />
    <input v-model="data" placeholder="Enter new data..." />
    <textarea v-model="embedding" placeholder="Enter new embedding (comma separated)..."></textarea>
    <button @click="updateItem">Update Entry</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      data: '',
      embedding: ''
    };
  },
  methods: {
    async updateItem() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/knowledge_base/${this.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            data: this.data,
            embedding: this.embedding.split(',').map(Number) // 转换为数组
          })
        });

        if (!response.ok) {
          console.error("Failed to update item:", response.statusText);
          return;
        }

        alert("Entry updated successfully!");
      } catch (error) {
        console.error("Error updating item:", error);
      }
    }
  }
};
</script>
