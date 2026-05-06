<template>
  <div class="chat-input-area">
    <el-input
      v-model="text"
      type="textarea"
      :rows="2"
      placeholder="请输入您的问题..."
      :disabled="disabled"
      resize="none"
      class="chat-input"
      @keydown.enter.prevent="handleSend"
    />
    <div class="input-actions">
      <div class="input-tips">
        <template v-if="!loading">
          <el-tag size="small" effect="plain" round>Enter 发送</el-tag>
          <el-tag size="small" effect="plain" round>Shift+Enter 换行</el-tag>
        </template>
        <el-button v-else text size="small" type="warning" @click="$emit('stop')">
          ⏹ 停止生成
        </el-button>
      </div>
      <el-button
        type="primary"
        :icon="Promotion"
        :loading="loading"
        :disabled="!text.trim() || disabled"
        @click="handleSend"
        class="send-btn"
      >
        发送
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Promotion } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'send', 'stop'])

const text = ref(props.modelValue)

watch(() => props.modelValue, (v) => { text.value = v })
watch(text, (v) => emit('update:modelValue', v))

function handleSend() {
  if (!text.value.trim() || props.loading || props.disabled) return
  emit('send', text.value.trim())
}
</script>

<style scoped>
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
  border-radius: 10px; font-size: 14px; line-height: 1.5;
}
.input-actions {
  display: flex; align-items: center;
  justify-content: space-between; margin-top: 8px;
}
.input-tips { display: flex; gap: 6px; }
.send-btn {
  border-radius: 8px;
  --el-button-bg-color: #7CA364;
  --el-button-border-color: #7CA364;
  --el-button-hover-bg-color: #6a8c55;
  --el-button-hover-border-color: #6a8c55;
  --el-button-active-bg-color: #5a7d48;
  --el-button-active-border-color: #5a7d48;
}
@media (max-width: 768px) {
  .chat-input-area { padding: 8px 12px 12px; }
  .input-tips { display: none; }
}
</style>
