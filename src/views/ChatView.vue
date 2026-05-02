<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- 对话历史抽屉 -->
      <el-drawer
        v-model="drawerVisible"
        title="对话历史"
        direction="ltr"
        size="320px"
        :with-header="true"
      >
        <template #header>
          <div class="drawer-header">
            <span class="drawer-title">对话历史</span>
            <el-button text type="primary" :icon="Delete" @click="clearAllHistory" size="small">
              清空
            </el-button>
          </div>
        </template>
        <div class="history-list">
          <div
            v-for="(item, index) in historyList"
            :key="index"
            class="history-item"
            :class="{ active: index === activeHistoryIndex }"
            @click="loadHistory(index)"
          >
            <el-icon class="history-icon"><ChatDotRound /></el-icon>
            <div class="history-content">
              <div class="history-title">{{ item.title }}</div>
              <div class="history-time">{{ item.time }}</div>
            </div>
            <el-button
              text
              :icon="Close"
              size="small"
              class="history-delete"
              @click.stop="deleteHistory(index)"
            />
          </div>
          <el-empty v-if="historyList.length === 0" description="暂无历史记录" />
        </div>
      </el-drawer>

      <!-- 主聊天区域 -->
      <div class="chat-main">
        <!-- 顶部栏 -->
        <div class="chat-header">
          <div class="chat-header-left">
            <el-button text :icon="Operation" @click="drawerVisible = true">
              历史
            </el-button>
            <el-divider direction="vertical" />
            <span class="chat-title">AI智能对话</span>
          </div>
          <div class="chat-header-right">
            <el-button text :icon="Refresh" @click="resetChat" :disabled="messages.length <= 1">
              新对话
            </el-button>
          </div>
        </div>

        <!-- 消息区域 -->
        <div class="chat-messages" ref="messagesRef">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message-item"
            :class="[msg.role === 'user' ? 'user-msg' : 'assistant-msg', { 'welcome-msg': msg.isWelcome }]"
          >
            <el-avatar
              :size="36"
              :icon="msg.role === 'user' ? UserFilled : Promotion"
              :class="msg.role === 'user' ? 'user-avatar' : 'assistant-avatar'"
              :style="{ background: msg.role === 'user' ? '#7CA364' : '#409eff' }"
            />
            <div class="message-content">
              <div class="message-text" v-html="renderMessage(msg.content)" />
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="2"
            placeholder="请输入您的问题..."
            :disabled="isLoading"
            resize="none"
            class="chat-input"
            @keydown.enter.prevent="sendMessage"
          />
          <div class="input-actions">
            <div class="input-tips">
              <el-tag size="small" effect="plain" round>Enter 发送</el-tag>
              <el-tag size="small" effect="plain" round>Shift+Enter 换行</el-tag>
            </div>
            <el-button
              type="primary"
              :icon="Promotion"
              :loading="isLoading"
              :disabled="!inputText.trim()"
              @click="sendMessage"
              class="send-btn"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import {
  Operation, Refresh, Delete, Close, ChatDotRound,
  UserFilled, Promotion
} from '@element-plus/icons-vue'
import { sendQuestion } from '@/api/aiApi'

const drawerVisible = ref(false)
const messagesRef = ref(null)
const inputText = ref('')
const isLoading = ref(false)
const activeHistoryIndex = ref(-1)

// 消息列表
const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是校园AI助手，可以帮你解答校园相关的问题。请告诉我你想了解什么？',
    time: getCurrentTime(),
    isWelcome: true
  }
])

// 历史记录
const historyList = ref(JSON.parse(localStorage.getItem('campus_ai_history') || '[]'))

function getCurrentTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function getFullTime() {
  const now = new Date()
  const M = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${M}-${d} ${h}:${m}`
}

function renderMessage(text) {
  if (!text) return ''
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:#f4f4f5;padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>')
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

watch(messages, scrollToBottom, { deep: true })

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  inputText.value = ''
  isLoading.value = true

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text,
    time: getCurrentTime()
  })

  try {
    const res = await sendQuestion(text)
    messages.value.push({
      role: 'assistant',
      content: res.answer,
      time: getCurrentTime()
    })
  } catch {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，AI暂时无法回答，请稍后再试。',
      time: getCurrentTime()
    })
  } finally {
    isLoading.value = false
    activeHistoryIndex.value = -1
  }
}

function resetChat() {
  messages.value = [messages.value[0]]
  activeHistoryIndex.value = -1
  localStorage.setItem('campus_ai_messages', '[]')
}

function loadHistory(index) {
  const item = historyList.value[index]
  if (item?.messages) {
    messages.value = item.messages
    activeHistoryIndex.value = index
    drawerVisible.value = false
  }
}

function deleteHistory(index) {
  historyList.value.splice(index, 1)
  localStorage.setItem('campus_ai_history', JSON.stringify(historyList.value))
  if (activeHistoryIndex.value === index) {
    activeHistoryIndex.value = -1
  } else if (activeHistoryIndex.value > index) {
    activeHistoryIndex.value--
  }
}

function clearAllHistory() {
  historyList.value = []
  localStorage.setItem('campus_ai_history', '[]')
  activeHistoryIndex.value = -1
}

// 保存历史
function saveHistory() {
  if (messages.value.length <= 1) return
  const history = JSON.parse(localStorage.getItem('campus_ai_history') || '[]')
  const firstUserMsg = messages.value.find(m => m.role === 'user')
  if (!firstUserMsg) return
  history.unshift({
    title: firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : ''),
    time: getFullTime(),
    messages: JSON.parse(JSON.stringify(messages.value))
  })
  localStorage.setItem('campus_ai_history', JSON.stringify(history))
  historyList.value = history
}

// 定期保存
watch(() => messages.value.length, (newLen, oldLen) => {
  if (newLen > oldLen && newLen > 2) {
    saveHistory()
  }
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  height: 100%;
  background: #f0f2f5;
  display: flex;
  justify-content: center;
}

.chat-container {
  width: 100%;
  max-width: 900px;
  height: 100%;
  display: flex;
  position: relative;
}

/* ===== 主聊天区 ===== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.04);
}

/* 顶部 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 消息区 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  max-width: 85%;
  animation: msgIn 0.3s ease;
}

@keyframes msgIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-msg {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.assistant-msg {
  align-self: flex-start;
}

.welcome-msg {
  align-self: center;
  max-width: 100%;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 20px;
}

.welcome-msg .message-content {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.welcome-msg .message-text {
  font-size: 18px;
  color: #606266;
  line-height: 1.6;
}

.user-avatar,
.assistant-avatar {
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.user-msg .message-text {
  background: linear-gradient(135deg, #7CA364 0%, #6a8c55 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant-msg .message-text {
  background: #f0f2f5;
  color: #303133;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
  padding: 0 4px;
}

.user-msg .message-time {
  text-align: right;
}

/* 输入区 */
.chat-input-area {
  border-top: 1px solid #f0f0f0;
  padding: 12px 20px 16px;
  background: #fafafa;
}

.chat-input {
  --el-input-bg-color: #fff;
  --el-input-border-color: #e4e7ed;
  --el-input-hover-border-color: #7CA364;
  --el-input-focus-border-color: #7CA364;
}

.chat-input :deep(.el-textarea__inner) {
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.input-tips {
  display: flex;
  gap: 6px;
}

.send-btn {
  border-radius: 8px;
  --el-button-bg-color: #7CA364;
  --el-button-border-color: #7CA364;
  --el-button-hover-bg-color: #6a8c55;
  --el-button-hover-border-color: #6a8c55;
  --el-button-active-bg-color: #5a7d48;
  --el-button-active-border-color: #5a7d48;
}

/* ===== 历史抽屉 ===== */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.history-item:hover {
  background: #f5f7fa;
}

.history-item.active {
  background: #f0f7e8;
  border: 1px solid rgba(124, 163, 100, 0.3);
}

.history-icon {
  font-size: 20px;
  color: #7CA364;
  flex-shrink: 0;
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-title {
  font-size: 13px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.history-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 2px;
}

.history-delete {
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .history-delete {
  opacity: 1;
}

@media (max-width: 768px) {
  .message-item {
    max-width: 95%;
  }
  .chat-messages {
    padding: 12px;
  }
  .chat-input-area {
    padding: 8px 12px 12px;
  }
  .input-tips {
    display: none;
  }
}
</style>
