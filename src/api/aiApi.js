/**
 * Chat API — supports SSE streaming (real) and mock fallback.
 */
import { authAPI, conversationAPI, chatAPI } from '@/services/api'

// Re-export for convenience
export { authAPI, conversationAPI, chatAPI }

/**
 * Send question via Server-Sent Events (streaming).
 * @param {string} question
 * @param {{ onToken, onDone, onError }} callbacks
 * @returns {{ abort: Function }}
 */
function streamQuestion(question, { onToken, onDone, onError }) {
  const controller = new AbortController()
  const username = localStorage.getItem('campus_ai_username') || 'anonymous'

  fetch('http://localhost:8080/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, content: question }),
    signal: controller.signal
  }).then(async (response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === 'token') onToken?.(event.content)
            else if (event.type === 'error') onError?.(event.content || 'Unknown error')
          } catch { /* skip */ }
        }
      }
    }
    onDone?.()
  }).catch((err) => {
    if (err.name !== 'AbortError') onError?.(err.message || 'Network error')
  })

  return { abort: () => controller.abort() }
}

/** Mock fallback */
async function sendQuestionMock(question) {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 800))
  const answers = [
    `关于"${question}"，建议您前往教务处官网查询相关规定。`,
    `您好，"${question}"？请使用校园APP中的"办事大厅"提交申请。`,
    `根据《学生手册》，${question}需提前3个工作日预约办理。`,
    `AI提示：${question}相关服务已上线"一站式服务中心"线上平台。`
  ]
  return { answer: answers[Math.floor(Math.random() * answers.length)] }
}

/**
 * Unified send — auto-pick stream or mock.
 * Returns object with .abort() for cancellation.
 */
export function sendQuestion(question, callbacks) {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    let cancelled = false
    sendQuestionMock(question).then((res) => {
      if (!cancelled) {
        if (callbacks) {
          // Simulate streaming by sending character by character
          const chars = res.answer.split('')
          let i = 0
          const timer = setInterval(() => {
            if (cancelled) { clearInterval(timer); return }
            if (i < chars.length) {
              callbacks.onToken?.(chars[i])
              i++
            } else {
              clearInterval(timer)
              callbacks.onDone?.()
            }
          }, 30)
        }
      }
    })
    return { abort: () => { cancelled = true } }
  }
  return streamQuestion(question, callbacks)
}
