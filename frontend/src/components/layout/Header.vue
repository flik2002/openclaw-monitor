<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="OpenClaw" class="logo-img" />
        <span class="logo-text">OpenClaw 监控系统</span>
      </div>
    </div>

    <div class="header-center">
      <ScrollAnnouncement v-if="announcements.length > 0" :announcements="announcements" />
    </div>

    <div class="header-right">
      <!-- 中英文切换 -->
      <el-dropdown trigger="click" @command="handleLanguageChange" class="lang-dropdown">
        <span class="lang-switch">
          {{ currentLanguage === 'zh-CN' ? '中文' : 'English' }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :class="{ 'is-active': currentLanguage === 'zh-CN' }">
              中文
            </el-dropdown-item>
            <el-dropdown-item command="en-US" :class="{ 'is-active': currentLanguage === 'en-US' }">
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown v-if="userStore.isLoggedIn" trigger="hover" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" class="user-avatar">
            {{ userStore.email?.charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="user-email">{{ userStore.email }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item command="storage">
              <el-icon><Folder /></el-icon>
              数据存储设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div v-else class="auth-buttons">
        <el-button type="primary" @click="goToLogin">登录</el-button>
        <el-button @click="goToRegister">注册</el-button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore'
import { User, Folder, SwitchButton, ArrowDown } from '@element-plus/icons-vue'
import ScrollAnnouncement from '@/components/common/ScrollAnnouncement.vue'
import http from '@/utils/http'

const router = useRouter()
const userStore = useUserStore()
const { locale } = useI18n()

const currentLanguage = ref('zh-CN')
const announcements = ref([])

// 获取公告
const fetchAnnouncements = async () => {
  try {
    const response = await http.get('/api/announcement/list')
    if (response.success) {
      announcements.value = response.data
    }
  } catch (error) {
    console.error('获取公告失败:', error)
  }
}

const handleLanguageChange = (lang) => {
  currentLanguage.value = lang
  locale.value = lang
  localStorage.setItem('language', lang)
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      // TODO: 跳转到个人信息页面
      break
    case 'storage':
      // TODO: 打开数据存储设置对话框
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      break
  }
}

const goToLogin = () => {
  router.push('/auth/login')
}

const goToRegister = () => {
  router.push('/auth/register')
}

onMounted(() => {
  // 恢复语言设置
  const savedLang = localStorage.getItem('language')
  if (savedLang) {
    currentLanguage.value = savedLang
    locale.value = savedLang
  }

  // 获取公告
  fetchAnnouncements()
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #28C78E;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  overflow: hidden;
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 15px;
}

.lang-dropdown {
  margin-right: 10px;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.lang-switch:hover {
  background: #f5f7fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar {
  background: #28C78E;
  color: #fff;
}

.user-email {
  font-size: 14px;
  color: #333;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}
</style>
