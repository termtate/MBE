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
    this.loadChatHistories();
  },
  methods: {
    async sendMessage() {
          if (this.userMessage.trim() === '' || this.loading) return;

          // 用户消息推送到 messages 数组
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

            // 处理响应并显示模型回复
            this.processResponse(response.data);
            console.log("API response data:", response.data);
          } catch (error) {
            console.log(error)
            this.handleError(error, 'Error sending message');
          } finally {
            this.loading = false;
          }
        },

        processResponse(responseData) {
              console.log("Processing response:", responseData);
              if (responseData?.response) {
                console.log("Adding assistant message:", responseData.response);
                this.addMessage('assistant', responseData.response);
              } else if (responseData?.choices?.[0]?.message) {
                const message = responseData.choices[0].message;
                this.addMessage(message.role || 'assistant', message.content);
                console.log("Adding assistant message:", message.content);
              } else {
                ElMessage.error('Unexpected response structure');
                console.error('Unexpected response structure:', responseData);
              }
            },


        addMessage(role, content) {
          this.messages.push({ role, content });
          console.log("Messages array:", this.messages);
          this.$nextTick(() => {
            // 滚动到底部以显示最新消息
            const chatMessages = this.$el.querySelector('.chat-messages .el-scrollbar__wrap');
            chatMessages.scrollTop = chatMessages.scrollHeight;
          });
          console.log(`${role} message added:`, content);
        },


    async loadChatHistories() {
      try {
        const response = await this.authenticatedRequest('get', '/api/chat-histories');
        this.chatHistories = response.data;
      } catch (error) {
        this.handleError(error, 'Error loading chat histories');
      }
    },

    async newChat() {
      this.messages = [];
      this.closeHistory();

      this.addMessage('model', 'You have started a new chat. How can I assist you?');

      const newChat = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        messages: this.messages 
      };

      try {
        const response = await this.authenticatedRequest('post', '/api/chat-histories', newChat);
        this.chatHistories.push(response.data);
      } catch (error) {
        this.handleError(error, 'Error creating new chat');
      }
    },

    async deleteChat(chatId) {
      try {
        await this.authenticatedRequest('delete', `/api/chat-histories/${chatId}`);
        this.chatHistories = this.chatHistories.filter(chat => chat.id !== chatId);
        ElMessage.success('Chat deleted successfully');
      } catch (error) {
        this.handleError(error, 'Error deleting chat');
      }
    },

    async deleteSelected(selectedIds) {
      try {
        await Promise.all(selectedIds.map(chatId => this.authenticatedRequest('delete', `/api/chat-histories/${chatId}`)));
        this.chatHistories = this.chatHistories.filter(chat => !selectedIds.includes(chat.id));
        ElMessage.success('Selected chats deleted successfully');
      } catch (error) {
        this.handleError(error, 'Error deleting selected chats');
      }
    },

    async authenticatedRequest(method, url, data = null) {
      const token = localStorage.getItem('token');
      if (!token) {
        ElMessage.error('Token not found. Please log in.');
        throw new Error('Token not found');
      }

      return axios({ method, url, data, headers: { Authorization: `Bearer ${token}` } });
    },

    handleError(error, defaultMessage) {
      if (error.response && error.response.status === 401) {
        ElMessage.error('Unauthorized. Please log in again.');
        localStorage.removeItem('token');
      } else {
        ElMessage.error(defaultMessage);
      }
      console.error(defaultMessage, error);
    }
  }
};
</script>

<style scoped>
/* 样式与之前相同 */
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
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.chat-content {
  display: flex;
  flex-direction: column;
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
