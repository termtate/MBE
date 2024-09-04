<template>
  <transition :name="transitionName">
    <el-card :class="messageClass" v-if="message">
      <div class="message-content">{{ message.content }}</div>
    </el-card>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    messageClass() {
      // 根据消息的角色动态设置样式类
      return this.message.role === 'user' ? 'user-message' : 'model-message';
    },
    transitionName() {
      // 根据消息的角色动态设置过渡动画
      return this.message.role === 'user' ? 'slide-up-right' : 'slide-up-left';
    }
  }
};
</script>


<style scoped>
.user-message {
  background-color: white;
  color: black;
  font-size: 15px;
  align-self: flex-end;
  border-radius: 10px;
  max-width: 100%;
  margin: 10px 0;
  box-shadow: -8px 8px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.model-message {
  background-color: #7cb6c3;
  color: rgb(0, 0, 0);
  font-size: 15px;
  align-self: flex-start;
  border-radius: 10px;
  max-width: 100%;
  margin: 10px 0;
  box-shadow: -8px 8px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.message-content {
  white-space: pre-wrap; /* 保留消息中的换行和空白 */
}

/* 用户消息从右侧滑入 */
.slide-up-right-enter-active {
  transition: all 1s ease;
}

.slide-up-right-enter {
  transform: translateX(100%);
  opacity: 0;
}

/* 模型消息从左侧滑入 */
.slide-up-left-enter-active {
  transition: all 1s ease;
}

.slide-up-left-enter {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
