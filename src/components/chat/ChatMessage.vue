<template>
  <div
    class="message-item"
    :class="[
      msg.role === 'user' ? 'user-msg' : 'assistant-msg',
      { 'welcome-msg': msg.isWelcome }
    ]"
  >
    <el-avatar
      :size="36"
      :icon="msg.role === 'user' ? UserFilled : Promotion"
      :class="msg.role === 'user' ? 'user-avatar' : 'assistant-avatar'"
      :style="{ background: msg.role === 'user' ? '#7CA364' : '#409eff' }"
    />
    <div class="message-content">
      <div class="message-text" v-html="safeContent" />
      <span v-if="msg.isStreaming && !msg.content" class="typing-indicator">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </span>
      <span v-else-if="msg.isStreaming" class="streaming-cursor">▊</span>
      <div class="message-time">{{ msg.time }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { UserFilled, Promotion } from '@element-plus/icons-vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps({
  msg: { type: Object, required: true }
})

const safeContent = computed(() => renderMarkdown(props.msg.content))
</script>

<style scoped>
.message-item {
  display: flex; gap: 12px; max-width: 85%;
  animation: msgIn 0.3s ease;
}
@keyframes msgIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.user-msg { align-self: flex-end; flex-direction: row-reverse; }
.assistant-msg { align-self: flex-start; }
.welcome-msg {
  align-self: center; max-width: 100%; text-align: center;
  flex-direction: column; align-items: center; padding: 40px 20px 20px;
}
.welcome-msg .message-content { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
.welcome-msg .message-text { font-size: 18px; color: #606266; line-height: 1.6; }
.user-avatar, .assistant-avatar { flex-shrink: 0; }
.message-content { display: flex; flex-direction: column; gap: 4px; }
.message-text {
  padding: 12px 16px; border-radius: 12px;
  font-size: 14px; line-height: 1.6; word-break: break-word;
}
.user-msg .message-text {
  background: linear-gradient(135deg, #7CA364 0%, #6a8c55 100%);
  color: white; border-bottom-right-radius: 4px;
}
.assistant-msg .message-text {
  background: #f0f2f5; color: #303133; border-bottom-left-radius: 4px;
}
.message-time { font-size: 11px; color: #c0c4cc; padding: 0 4px; }
.user-msg .message-time { text-align: right; }

/* Streaming effects */
.streaming-cursor {
  color: #7CA364; font-size: 16px; animation: blink 0.8s infinite;
  margin-left: 2px;
}
@keyframes blink {
  0%, 100% { opacity: 1; } 50% { opacity: 0; }
}
.typing-indicator {
  display: inline-flex; gap: 4px; padding: 4px 8px;
}
.typing-indicator .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #c0c4cc;
  animation: bounce 1.2s infinite;
}
.typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}
</style>
