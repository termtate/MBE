<template>
    <div class="main-layout">
      <ChatHistory @load-history="loadChatHistory" />
      <ChatWindow ref="chatWindow" />
    </div>
  </template>
  
  <script>
  import ChatWindow from './ChatWindow.vue';
  import ChatHistory from './ChatHistory.vue';
  
  export default {
    components: { ChatWindow, ChatHistory },
    methods: {
      loadChatHistory(historyId) {
        this.$refs.chatWindow.loadHistory(historyId);
      }
    }
  };
  </script>
  
  <style scoped>
  .main-layout {
    display: flex;
    height: 100vh;
  }
  </style>
  