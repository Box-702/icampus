<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-brand">
        <div class="brand-content">
          <el-avatar :size="80" shape="square" src="/images/ligon-icon.jpg" class="brand-logo" />
          <h1 class="brand-title">莞工校园AI助手</h1>
          <p class="brand-desc">智能解答 · 高效服务 · 便捷校园</p>
        </div>
      </div>

      <div class="login-form-area">
        <el-card class="login-card" :body-style="{ padding: '40px' }">
          <el-tabs v-model="activeTab" stretch class="login-tabs">
            <el-tab-pane label="登录" name="login">
              <el-form
                ref="formRef"
                :model="form"
                :rules="loginRules"
                size="large"
                class="auth-form"
                @submit.prevent="handleSubmit"
              >
                <el-form-item prop="username">
                  <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" native-type="submit" :loading="loading" class="submit-btn">登录</el-button>
                </el-form-item>
              </el-form>
              <div class="switch-tip">
                还没有账号？
                <el-button link type="primary" @click="switchToRegister">立即注册</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="注册" name="register">
              <el-form
                ref="formRef"
                :model="form"
                :rules="registerRules"
                size="large"
                class="auth-form"
                @submit.prevent="handleSubmit"
              >
                <el-form-item prop="username">
                  <el-input v-model="form.username" placeholder="请设置用户名" :prefix-icon="User" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="form.password" type="password" placeholder="请设置密码" :prefix-icon="Lock" show-password />
                </el-form-item>
                <el-form-item prop="confirmPassword">
                  <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" :prefix-icon="Lock" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" native-type="submit" :loading="loading" class="submit-btn">注册</el-button>
                </el-form-item>
              </el-form>
              <div class="switch-tip">
                已有账号？
                <el-button link type="primary" @click="switchToLogin">立即登录</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { authAPI } from '@/services/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const activeTab = ref('login')
const loading = ref(false)

const form = reactive({ username: '', password: '', confirmPassword: '' })
const isRegister = computed(() => activeTab.value === 'register')

const baseRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' }
  ]
}

const confirmRule = {
  required: true, message: '请确认密码', trigger: 'blur',
  validator: (_, value, callback) => {
    if (value !== form.password) callback(new Error('两次输入密码不一致'))
    else callback()
  }
}

const loginRules = { ...baseRules }
const registerRules = { ...baseRules, confirmPassword: [confirmRule] }

const rules = computed(() => isRegister.value ? registerRules : loginRules)

function switchToRegister() {
  activeTab.value = 'register'
  form.confirmPassword = ''
  formRef.value?.clearValidate()
}

function switchToLogin() {
  activeTab.value = 'login'
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }

  loading.value = true
  try {
    if (isRegister.value) {
      await authAPI.register(form.username, form.password)
      ElMessage.success('注册成功，请登录')
      switchToLogin()
      form.password = ''
    } else {
      await authAPI.login(form.username, form.password)
      userStore.setAuth(form.username, 'logged_in')
      ElMessage.success('登录成功')
      router.push('/chat')
    }
  } catch (error) {
    const message = error.response?.data?.error || error.message || '操作失败'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh; width: 100vw;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;
}
.login-page::before {
  content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 0%, transparent 50%);
  animation: bgFloat 20s ease-in-out infinite;
}
@keyframes bgFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(2%, -2%) rotate(1deg); }
  66% { transform: translate(-1%, 1%) rotate(-1deg); }
}
.login-container {
  display: flex; width: 900px; max-width: 95vw; min-height: 520px;
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15); position: relative; z-index: 1;
}
.login-brand {
  flex: 1; background: linear-gradient(135deg, #7CA364 0%, #5a7d48 100%);
  display: flex; align-items: center; justify-content: center;
  padding: 40px; position: relative; overflow: hidden;
}
.login-brand::after {
  content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%;
  background: rgba(255,255,255,0.06); top: -80px; right: -80px;
}
.login-brand::before {
  content: ''; position: absolute; width: 200px; height: 200px; border-radius: 50%;
  background: rgba(255,255,255,0.04); bottom: -50px; left: -50px;
}
.brand-content { text-align: center; position: relative; z-index: 1; }
.brand-logo { margin-bottom: 20px; border: 3px solid rgba(255,255,255,0.3); }
.brand-title { color: white; font-size: 28px; font-weight: 700; margin-bottom: 12px; letter-spacing: 1px; }
.brand-desc { color: rgba(255,255,255,0.8); font-size: 14px; }
.login-form-area { width: 440px; background: white; display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-card { width: 100%; border: none; box-shadow: none; }
.login-tabs :deep(.el-tabs__nav-wrap::after) { height: 1px; }
.login-tabs :deep(.el-tabs__item) { font-size: 16px; font-weight: 600; height: 48px; color: #909399; }
.login-tabs :deep(.el-tabs__item.is-active) { color: #7CA364; }
.login-tabs :deep(.el-tabs__active-bar) { background: #7CA364; height: 3px; border-radius: 2px; }
.auth-form { margin-top: 24px; }
.submit-btn {
  width: 100%; height: 44px; font-size: 16px; font-weight: 600;
  letter-spacing: 4px; border-radius: 10px; margin-top: 8px;
  --el-button-bg-color: #7CA364; --el-button-border-color: #7CA364;
  --el-button-hover-bg-color: #6a8c55; --el-button-hover-border-color: #6a8c55;
  --el-button-active-bg-color: #5a7d48; --el-button-active-border-color: #5a7d48;
}
.switch-tip { text-align: center; color: #909399; font-size: 14px; margin-top: 12px; }
@media (max-width: 768px) {
  .login-brand { display: none; }
  .login-form-area { width: 100%; }
  .login-container { max-width: 420px; }
}
</style>
