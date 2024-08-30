<template>
  <el-container class="chat-container">
    <el-header class="header">
      <el-button 
        type="primary" 
        @click="toggleHistory"
        :loading="loading"
        class="history-button"
      >
        Chat History
      </el-button>
    </el-header>

    <transition name="slide-left">
      <el-aside 
        v-if="showHistory" 
        class="history-container"
        @click.self="closeHistory"
        ref="historyContainer"
      >
        <ChatHistory 
          @load-history="loadHistory" 
          @new-chat="newChat" 
          @delete-chat="deleteChat"
          @delete-selected="deleteSelected"
          :chatHistories="chatHistories" 
        />
      </el-aside>
    </transition>

    <el-main class="chat-main" @click="closeHistoryIfOpen">
      <el-scrollbar class="chat-messages">
        <div class="chat-content">
          <transition-group name="message-transition">
            <Message 
              v-for="(message, index) in messages" 
              :key="index" 
              :message="message" 
            />
          </transition-group>
        </div>
      </el-scrollbar>
      <el-footer class="chat-input-container">
        <el-input
          v-model="userMessage"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
          class="chat-input"
          clearable
          :disabled="loading"
        />
        <el-button 
          @click="sendMessage" 
          type="primary" 
          class="send-button" 
          :loading="loading"
        >
          Send
        </el-button>
      </el-footer>
    </el-main>
  </el-container>
</template>

<script>
import ChatHistory from './ChatHistory.vue';
import Message from './ChatMessage.vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  components: { ChatHistory, Message },
  data() {
    return {
      userMessage: '',
      messages: [],
      loading: false,
      showHistory: false,
      chatHistories: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get('/api/chat-histories');
      this.chatHistories = response.data;
      console.log('Loaded chat histories:', this.chatHistories);
    } catch (error) {
      ElMessage.error('Error loading chat histories');
      console.error('Error loading chat histories:', error);
    }
  },
  methods: {
    async sendMessage() {
      if (this.userMessage.trim() === '' || this.loading) return;

      this.messages.push({ role: 'user', content: this.userMessage });
      const messageToSend = this.userMessage;
      this.userMessage = '';
      this.loading = true;

      try {
        const token = localStorage.getItem('token');

        const response = await axios.post('/chat', 
          { message: messageToSend }, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
          this.messages.push({ role: 'model', content: response.data.choices[0].message.content });
        } else {
          ElMessage.error('Unexpected response structure');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          ElMessage.error('Unauthorized. Please log in again.');
        } else {
          ElMessage.error('Error sending message');
        }
        console.error('Error sending message:', error);
      } finally {
        this.loading = false;
      }
    },
    toggleHistory() {
      if (!this.chatHistories.length) {
        this.loadChatHistories();
      }
      this.showHistory = !this.showHistory;
    },
    closeHistory() {
      this.showHistory = false;
    },
    closeHistoryIfOpen() {
      if (this.showHistory) {
        this.closeHistory();
      }
    },
      async loadHistory(historyId) {
      this.loading = true;
      this.showHistory = false;

    try {
      // 获取存储在 localStorage 中的 JWT 令牌
      const token = localStorage.getItem('token');
      
      if (!token) {
        ElMessage.error('Token not found. Please log in.');
        return;
      }

      // 发送请求时添加 Authorization 头
      const response = await axios.get(`/chat-history/${historyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Loaded history:', response.data);
      this.messages = response.data.messages;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        ElMessage.error('Unauthorized. Please log in again.');
      } else {
        ElMessage.error('Error loading chat history');
      }
      console.error('Error loading chat history:', error);
    } finally {
      this.loading = false;
    }
  },
    async loadChatHistories() {
      try {
        const response = await axios.get('/api/chat-histories');
        this.chatHistories = response.data;
        console.log('Loaded chat histories:', this.chatHistories);
      } catch (error) {
        ElMessage.error('Error loading chat histories');
        console.error('Error loading chat histories:', error);
      }
    },
    async newChat() {
      this.messages = [];
      this.closeHistory();

      this.messages.push({ role: 'model', content: 'You have started a new chat. How can I assist you?' });

      const newChat = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        messages: this.messages 
      };

      try {
        const response = await axios.post('/api/chat-histories', newChat);
        this.chatHistories.push(response.data);
      } catch (error) {
        ElMessage.error('Error creating new chat');
        console.error('Error creating new chat:', error);
      }
    },
    async deleteChat(chatId) {
      try {
        await axios.delete(`/api/chat-histories/${chatId}`);
        this.chatHistories = this.chatHistories.filter(chat => chat.id !== chatId);
        ElMessage.success('Chat deleted successfully');
      } catch (error) {
        ElMessage.error('Error deleting chat');
        console.error('Error deleting chat:', error);
      }
    },
    async deleteSelected(selectedIds) {
      try {
        await Promise.all(selectedIds.map(chatId => axios.delete(`/api/chat-histories/${chatId}`)));
        this.chatHistories = this.chatHistories.filter(chat => !selectedIds.includes(chat.id));
        ElMessage.success('Selected chats deleted successfully');
      } catch (error) {
        ElMessage.error('Error deleting selected chats');
        console.error('Error deleting selected chats:', error);
      }
    }
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.history-button, .send-button {
  background-color: #7cb6c3;
  border-color: #7cb6c3;
  color: white;
}

.history-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 35%;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.chat-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
  overflow: hidden;
  background-color: #ffffff;
  color: white;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.chat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 70%;
  margin-left: auto;
}

.chat-input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  align-items: center;
  width: 70%;
  margin-left: auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: -8px -8px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 20px;
}

.chat-input {
  flex: 1;
  height: 40px;
  border-radius: 5px;
}

.send-button {
  margin-left: 10px;
  height: 40px;
  border-radius: 5px;
  transition: all 0.2s ease;
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter, .slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.message-transition-enter-active, .message-transition-leave-active {
  transition: all 0.5s;
}

.message-transition-enter, .message-transition-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
