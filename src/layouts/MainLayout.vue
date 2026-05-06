<template>
  <el-container class="main-layout">
    <el-header class="app-header">
      <div class="header-left">
        <router-link to="/chat" class="brand-link">
          <el-avatar :size="32" shape="square" src="/images/ligon-icon.jpg" class="nav-logo" />
          <span class="brand-title">校园AI助手</span>
        </router-link>
      </div>
      <div class="header-center">
        <el-menu
          :default-active="currentRoute"
          mode="horizontal"
          :ellipsis="false"
          router
          class="nav-menu"
        >
          <el-menu-item index="/chat">
            <el-icon><ChatDotRound /></el-icon>
            <span>AI对话</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>个人</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" src="/images/ligon-icon.jpg" />
            <span class="username">{{ username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>个人中心
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-main class="app-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  ChatDotRound, User, ArrowDown, SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.path)
const username = computed(() => localStorage.getItem('campus_ai_username') || '用户')

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      localStorage.removeItem('campus_ai_token')
      localStorage.removeItem('campus_ai_username')
      router.push('/login')
    }).catch(() => {})
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  height: 60px !important;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.nav-logo {
  border: 1.5px solid rgba(124, 163, 100, 0.3);
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  letter-spacing: 0.5px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-menu {
  border-bottom: none !important;
}

.nav-menu :deep(.el-menu-item) {
  height: 60px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  transition: all 0.25s;
}

.nav-menu :deep(.el-menu-item:hover) {
  background: #f0f7e8;
  color: #7CA364;
}

.nav-menu :deep(.el-menu-item.is-active) {
  color: #7CA364;
  border-bottom-color: #7CA364;
}

.nav-menu :deep(.el-menu-item .el-icon) {
  font-size: 18px;
  margin-right: 4px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.app-main {
  padding: 0;
  height: calc(100vh - 60px);
  overflow: auto;
  background: #f0f2f5;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
  }
  .brand-title {
    display: none;
  }
  .nav-menu :deep(.el-menu-item) {
    padding: 0 12px;
  }
  .nav-menu :deep(.el-menu-item span) {
    display: none;
  }
  .nav-menu :deep(.el-menu-item .el-icon) {
    margin-right: 0;
    font-size: 20px;
  }
  .username {
    display: none;
  }
}
</style>
