<template>
    <div class="chat-container">
      <div class="chat-messages">
        <Message v-for="(message, index) in messages" :key="index" :message="message" />
      </div>
      <div class="chat-input-container">
        <input 
          v-model="userMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Type your message..." 
          class="chat-input" 
        />
        <button @click="sendMessage" class="send-button">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  import Message from './ChatMessage.vue';
  import axios from 'axios';
  
  export default {
    components: { Message },
    data() {
      return {
        userMessage: '',
        messages: []
      };
    },
        methods: {
    async sendMessage() {
        if (this.userMessage.trim() === '') return;
        
        // 添加用户消息到消息列表
        this.messages.push({ role: 'user', content: this.userMessage });
        
        try {
        // 获取存储在 localStorage 中的 token
        const token = localStorage.getItem('token');
        
        // 向后端发送用户消息，附带 Authorization 头
        const response = await axios.post('/chat', 
            { message: this.userMessage }, 
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        // 添加模型响应到消息列表
        this.messages.push({ role: 'model', content: response.data.choices[0].message.content });
        } catch (error) {
        console.error('Error sending message:', error);
        }
        
        // 清空输入框
        this.userMessage = '';
    }
    }

    };
   </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
  }
  
  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .chat-input-container {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  
  .chat-input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .send-button {
    padding: 10px 20px;
    margin-left: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .send-button:hover {
    background-color: #0056b3;
  }
  </style>
  