<template>
  <div class="chat-history">
    <h3>Chat History</h3>

    <!-- Chat history list -->
    <el-scrollbar class="history-list" v-if="chatHistories.length">
      <el-menu :default-active="activeIndex" class="el-menu-vertical-demo">
        <transition-group name="fade">
          <el-menu-item
            v-for="(history, index) in chatHistories"
            :key="history.id"
            @click="handleHistoryClick(history.id)"
            :class="{ active: history.id === activeIndex }"
          >
            <span>Chat {{ index + 1 }} - {{ history.timestamp }}</span>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click.stop="deleteSingle(history.id)"
              style="float: right; margin-right: 10px"
            ></el-button>
          </el-menu-item>
        </transition-group>
      </el-menu>
    </el-scrollbar>

    <!-- No Chat History Message -->
    <el-empty v-else description="No Chat History" />

    <!-- Chat selection for deletion -->
    <el-checkbox-group v-model="selectedIds" class="checkbox-group" v-if="chatHistories.length">
      <el-checkbox v-for="history in chatHistories" :key="history.id" :label="history.id">
        Select Chat {{ history.timestamp }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- Delete selected chats button -->
    <el-button
      type="danger"
      icon="el-icon-delete"
      @click="deleteSelectedChats"
      :disabled="!selectedIds.length"
      class="delete-selected-button"
      v-if="chatHistories.length"
    >
      Delete Selected
    </el-button>

    <!-- New chat button -->
    <el-button type="primary" @click="newChat" class="new-chat-button" icon="el-icon-plus">
      New Chat
    </el-button>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  props: {
    chatHistories: Array
  },
  data() {
    return {
      activeIndex: null, // 当前激活的聊天记录ID
      selectedIds: [] // 存储被选中的历史记录ID
    }
  },
  methods: {
    handleHistoryClick(historyId) {
      this.activeIndex = historyId // 更新当前激活的聊天记录ID
      this.$emit('load-history', historyId) // 触发加载历史记录的事件
    },
    newChat() {
      this.activeIndex = null // 清除激活的历史记录ID
      this.$emit('new-chat') // 触发新建聊天的事件
    },
    deleteSingle(chatId) {
      this.$emit('delete-chat', chatId) // 触发单个删除的事件
      if (this.activeIndex === chatId) {
        this.activeIndex = null // 如果删除的是当前激活的记录，清除激活状态
      }
      ElMessage.success('Chat deleted successfully')
    },
    deleteSelectedChats() {
      this.$emit('delete-selected', this.selectedIds) // 触发批量删除的事件
      this.selectedIds = [] // 清空选择的ID列表
      ElMessage.success('Selected chats deleted successfully')
    }
  }
}
</script>

<style scoped>
.chat-history {
  padding: 20px;
  background-color: #444444;
  border-bottom: 1px solid #ddd;
  height: 100%;
  color: white;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.el-menu-vertical-demo {
  background-color: transparent;
  border-right: none;
}

.el-menu-item.active {
  background-color: #e0f7fa; /* 激活项的背景颜色 */
}

.new-chat-button,
.delete-selected-button {
  margin-top: 15px;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
