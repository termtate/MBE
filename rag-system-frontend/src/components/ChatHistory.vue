<template>
    <div class="chat-history">
      <h3>Chat History</h3>
      <ul>
        <li v-for="(history, index) in chatHistories" :key="index">
          <button @click="loadHistory(history.id)">
            Chat {{ index + 1 }} - {{ history.timestamp }}
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        chatHistories: []
      };
    },
    created() {
      this.fetchChatHistories();
    },
    methods: {
      async fetchChatHistories() {
        try {
          const response = await axios.get('/chat-history');
          this.chatHistories = response.data;
        } catch (error) {
          console.error('Error fetching chat histories:', error);
        }
      },
      loadHistory(historyId) {
        this.$emit('load-history', historyId);
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-history {
    padding: 20px;
    border-right: 1px solid #ddd;
    height: 100%;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  button {
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
    border: none;
    background-color: #f1f1f1;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #ddd;
  }
  </style>
  