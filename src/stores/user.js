import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref(localStorage.getItem('campus_ai_username') || '')
  const token = ref(localStorage.getItem('campus_ai_token') || '')
  const nickname = ref('')
  const email = ref('')
  const phone = ref('')
  const avatar = ref('')

  const isLoggedIn = computed(() => !!token.value && !!username.value)

  function setAuth(user, tok) {
    username.value = user
    token.value = tok
    localStorage.setItem('campus_ai_username', user)
    localStorage.setItem('campus_ai_token', tok)
  }

  function setProfile(profile) {
    if (profile.nickname) nickname.value = profile.nickname
    if (profile.email) email.value = profile.email
    if (profile.phone) phone.value = profile.phone
    if (profile.avatar) avatar.value = profile.avatar
  }

  function logout() {
    username.value = ''
    token.value = ''
    localStorage.removeItem('campus_ai_username')
    localStorage.removeItem('campus_ai_token')
  }

  return { username, token, nickname, email, phone, avatar, isLoggedIn, setAuth, setProfile, logout }
})
