/**
 * Safe Markdown rendering with XSS protection.
 * Uses marked for parsing and DOMPurify for sanitization.
 */
import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ breaks: true, gfm: true })

/**
 * Render markdown text to safe HTML.
 * @param {string} text - Raw markdown or plain text
 * @returns {string} Sanitized HTML string
 */
export function renderMarkdown(text) {
  if (!text) return ''
  const rawHtml = marked.parse(text)
  return DOMPurify.sanitize(rawHtml)
}
