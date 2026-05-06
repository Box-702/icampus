<template>
  <div class="chat-page">
    <div class="chat-container">
      <el-drawer v-model="drawerVisible" direction="ltr" size="320px" :with-header="true">
        <template #header>
          <div class="drawer-header">
            <span class="drawer-title">对话历史</span>
            <el-button text type="primary" :icon="Delete" @click="chatStore.clearAllHistory()" size="small">清空</el-button>
          </div>
        </template>
        <div class="history-list">
          <div
            v-for="(item, index) in chatStore.historyList"
            :key="index"
            class="history-item"
            :class="{ active: index === chatStore.activeHistoryIndex }"
            @click="openHistory(index)"
          >
            <el-icon class="history-icon"><ChatDotRound /></el-icon>
            <div class="history-content">
              <div class="history-title">{{ item.title }}</div>
              <div class="history-time">{{ item.time }}</div>
            </div>
            <el-button text :icon="Close" size="small" class="history-delete" @click.stop="chatStore.deleteHistory(index)" />
          </div>
          <el-empty v-if="chatStore.historyList.length === 0" description="暂无历史记录" />
        </div>
      </el-drawer>

      <div class="chat-main">
        <div class="chat-header">
          <div class="chat-header-left">
            <el-button text :icon="Operation" @click="drawerVisible = true">历史</el-button>
            <el-divider direction="vertical" />
            <span class="chat-title">AI智能对话</span>
          </div>
          <div class="chat-header-right">
            <el-button text :icon="Refresh" @click="chatStore.resetChat()" :disabled="!chatStore.hasMessages">新对话</el-button>
          </div>
        </div>

        <div class="chat-messages" ref="messagesRef">
          <ChatMessage v-for="(msg, index) in chatStore.messages" :key="index" :msg="msg" />
        </div>

        <ChatInput
          v-model="inputText"
          :loading="chatStore.isLoading"
          @send="chatStore.sendMessage($event)"
          @stop="chatStore.cancelStreaming()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { Operation, Refresh, Delete, Close, ChatDotRound } from '@element-plus/icons-vue'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
const drawerVisible = ref(false)
const messagesRef = ref(null)
const inputText = ref('')

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

function openHistory(index) {
  chatStore.loadHistory(index)
  drawerVisible.value = false
}

watch(() => chatStore.messages.length, scrollToBottom)
// Also scroll on content change (streaming)
watch(() => chatStore.messages, scrollToBottom, { deep: true })
onMounted(() => scrollToBottom())
</script>

<style scoped>
.chat-page { height: 100%; background: #f0f2f5; display: flex; justify-content: center; }
.chat-container { width: 100%; max-width: 900px; height: 100%; display: flex; position: relative; }
.chat-main { flex: 1; display: flex; flex-direction: column; height: 100%; background: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.04); }
.chat-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid #f0f0f0; background: #fafafa; }
.chat-header-left { display: flex; align-items: center; gap: 8px; }
.chat-title { font-size: 16px; font-weight: 600; color: #303133; }
.chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.drawer-header { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.drawer-title { font-size: 16px; font-weight: 600; }
.history-list { display: flex; flex-direction: column; gap: 4px; }
.history-item { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; position: relative; }
.history-item:hover { background: #f5f7fa; }
.history-item.active { background: #f0f7e8; border: 1px solid rgba(124,163,100,0.3); }
.history-icon { font-size: 20px; color: #7CA364; flex-shrink: 0; }
.history-content { flex: 1; min-width: 0; }
.history-title { font-size: 13px; color: #303133; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.history-time { font-size: 11px; color: #c0c4cc; margin-top: 2px; }
.history-delete { opacity: 0; transition: opacity 0.2s; }
.history-item:hover .history-delete { opacity: 1; }
@media (max-width: 768px) { .chat-messages { padding: 12px; } }
</style>
