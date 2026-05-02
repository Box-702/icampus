<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <el-button text :icon="ArrowLeft" @click="goBack">返回</el-button>
        <span class="page-title">个人设置</span>
      </div>

      <el-row :gutter="20">
        <el-col :span="24" :lg="8">
          <!-- 头像卡片 -->
          <el-card class="profile-card" shadow="never">
            <template #header>
              <span class="card-title">用户头像</span>
            </template>
            <div class="avatar-section">
              <el-avatar :size="100" shape="square" :src="formData.avatar" class="profile-avatar" />
              <el-upload
                action="#"
                :show-file-list="false"
                :before-upload="handleAvatarChange"
                accept="image/*"
              >
                <el-button type="primary" :icon="Upload" size="small">更换头像</el-button>
              </el-upload>
              <p class="avatar-tip">支持 JPG / PNG，建议 200x200 以上</p>
            </div>
          </el-card>

          <!-- 账号信息 -->
          <el-card class="profile-card" shadow="never" style="margin-top: 16px;">
            <template #header>
              <span class="card-title">账号信息</span>
            </template>
            <div class="account-info">
              <div class="info-item">
                <span class="info-label">用户名</span>
                <span class="info-value">{{ cachedUsername }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">角色</span>
                <el-tag size="small" type="success">学生</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="24" :lg="16">
          <!-- 基本信息 -->
          <el-card class="profile-card" shadow="never">
            <template #header>
              <span class="card-title">基本信息</span>
            </template>
            <el-form :model="formData" label-width="100px" size="large">
              <el-form-item label="用户昵称">
                <el-input v-model="formData.username" placeholder="请输入用户昵称" />
              </el-form-item>
              <el-form-item label="邮箱地址">
                <el-input v-model="formData.email" placeholder="请输入邮箱地址" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 修改密码 -->
          <el-card class="profile-card" shadow="never" style="margin-top: 16px;">
            <template #header>
              <span class="card-title">修改密码</span>
            </template>
            <el-form :model="formData" label-width="100px" size="large">
              <el-form-item label="当前密码">
                <el-input
                  v-model="formData.currentPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="新密码">
                <el-input
                  v-model="formData.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认新密码">
                <el-input
                  v-model="formData.confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  show-password
                />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 操作 -->
          <div class="action-buttons">
            <el-button type="danger" :icon="SwitchButton" @click="logout" plain>
              退出登录
            </el-button>
            <el-button
              type="primary"
              :icon="Check"
              :loading="isSaving"
              @click="saveProfile"
            >
              保存设置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Upload, SwitchButton, Check
} from '@element-plus/icons-vue'

const router = useRouter()

const cachedUsername = computed(() => localStorage.getItem('campus_ai_username') || '用户')

const goBack = () => {
  router.push('/chat')
}

const formData = ref({
  username: '',
  email: '',
  avatar: '/images/user-avatar.png',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isSaving = ref(false)

const handleAvatarChange = (file) => {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
  return false // 阻止默认上传
}

const saveProfile = async () => {
  if (isSaving.value) return

  // 验证密码修改
  if (formData.value.newPassword) {
    if (formData.value.newPassword !== formData.value.confirmPassword) {
      ElMessage.warning('新密码和确认密码不一致')
      return
    }
    if (!formData.value.currentPassword) {
      ElMessage.warning('请输入当前密码')
      return
    }
    if (formData.value.newPassword.length < 6) {
      ElMessage.warning('新密码长度至少6位')
      return
    }
  }

  isSaving.value = true
  try {
    const userData = {
      name: formData.value.username,
      email: formData.value.email,
      avatar: formData.value.avatar,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem('user', JSON.stringify(userData))

    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 800))

    formData.value.currentPassword = ''
    formData.value.newPassword = ''
    formData.value.confirmPassword = ''

    ElMessage.success('设置保存成功！')
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

const logout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.clear()
    router.push('/login')
  }).catch(() => {})
}

const loadUserProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  formData.value.username = user.name || cachedUsername.value
  formData.value.email = user.email || 'user@example.com'
  formData.value.avatar = user.avatar || '/images/user-avatar.png'
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100%;
  background: #f0f2f5;
  padding: 24px;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.profile-card {
  border-radius: 12px;
}

.profile-card :deep(.el-card__header) {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

/* 头像 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.profile-avatar {
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.avatar-tip {
  font-size: 12px;
  color: #c0c4cc;
  margin: 0;
}

/* 账号信息 */
.account-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-label {
  font-size: 14px;
  color: #909399;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }
  .action-buttons {
    flex-direction: column;
  }
  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
