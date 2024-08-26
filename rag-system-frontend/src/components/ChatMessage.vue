<template>
    <div :class="messageClass">
      <div class="message-content">{{ message.content }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['message'],
    computed: {
      messageClass() {
        return this.message.role === 'user' ? 'message user-message' : 'message model-message';
      }
    }
  };
  </script>
  
  <style scoped>
  .message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%;
  }
  
  .user-message {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
  }
  
  .model-message {
    background-color: #f1f1f1;
    color: black;
    align-self: flex-start;
  }
  
  .message-content {
    white-space: pre-wrap;
  }
  </style>
  