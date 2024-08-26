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
export default {
  data() {
    return {
      data: null, // 用于存储获取到的受保护数据
    };
  },
  created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/login');
    }
  },
  methods: {
    async fetchProtectedData() {
      const token = localStorage.getItem('token');
      const response = await fetch('/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.data = await response.json();
      } else {
        alert('Failed to fetch protected data.');
      }
    },
  },
};
</script>
