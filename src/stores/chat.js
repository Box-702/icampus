import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendQuestion } from '@/api/aiApi'

function getTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function getFullTime() {
  const now = new Date()
  const M = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${M}-${d} ${h}:${m}`
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref([
    {
      role: 'assistant',
      content: '你好！我是校园AI助手，可以帮你解答校园相关的问题。请告诉我你想了解什么？',
      time: getTime(),
      isWelcome: true
    }
  ])

  const isLoading = ref(false)
  const activeHistoryIndex = ref(-1)
  const historyList = ref(JSON.parse(localStorage.getItem('campus_ai_history') || '[]'))
  const streamingAbort = ref(null)

  const hasMessages = computed(() => messages.value.length > 1)

  async function sendMessage(text) {
    if (!text || isLoading.value) return
    isLoading.value = true

    // Add user message
    messages.value.push({ role: 'user', content: text, time: getTime() })

    // Add empty assistant placeholder for streaming
    const assistantMsg = { role: 'assistant', content: '', time: getTime(), isStreaming: true }
    messages.value.push(assistantMsg)

    const controller = sendQuestion(text, {
      onToken(token) {
        assistantMsg.content += token
      },
      onDone() {
        assistantMsg.isStreaming = false
        isLoading.value = false
        activeHistoryIndex.value = -1
        autoSave()
      },
      onError(err) {
        assistantMsg.content = `抱歉，AI暂时无法回答，请稍后再试。(${err})`
        assistantMsg.isStreaming = false
        isLoading.value = false
        activeHistoryIndex.value = -1
        autoSave()
      }
    })

    // For mock mode, controller has .abort method
    if (controller?.abort) {
      streamingAbort.value = controller
    }
  }

  function cancelStreaming() {
    streamingAbort.value?.abort()
    streamingAbort.value = null
    isLoading.value = false
  }

  function resetChat() {
    cancelStreaming()
    messages.value = [messages.value[0]]
    activeHistoryIndex.value = -1
  }

  function loadHistory(index) {
    const item = historyList.value[index]
    if (item?.messages) {
      messages.value = item.messages
      activeHistoryIndex.value = index
    }
  }

  function deleteHistory(index) {
    historyList.value.splice(index, 1)
    localStorage.setItem('campus_ai_history', JSON.stringify(historyList.value))
    if (activeHistoryIndex.value === index) activeHistoryIndex.value = -1
    else if (activeHistoryIndex.value > index) activeHistoryIndex.value--
  }

  function clearAllHistory() {
    historyList.value = []
    localStorage.setItem('campus_ai_history', '[]')
    activeHistoryIndex.value = -1
  }

  function autoSave() {
    if (messages.value.length <= 1) return
    // Remove streaming flag before saving
    const cleaned = messages.value.map(({ isStreaming, ...m }) => m)
    const history = JSON.parse(localStorage.getItem('campus_ai_history') || '[]')
    const firstUserMsg = cleaned.find(m => m.role === 'user')
    if (!firstUserMsg) return
    history.unshift({
      title: firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : ''),
      time: getFullTime(),
      messages: JSON.parse(JSON.stringify(cleaned))
    })
    localStorage.setItem('campus_ai_history', JSON.stringify(history))
    historyList.value = history
  }

  return {
    messages, isLoading, activeHistoryIndex, historyList, hasMessages,
    sendMessage, cancelStreaming, resetChat, loadHistory, deleteHistory, clearAllHistory
  }
})
