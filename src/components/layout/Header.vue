<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="OpenClaw" class="logo-img" />
        <span class="logo-text">OpenClaw {{ t('common.monitor') }}</span>
      </div>
    </div>

    <div class="header-center">
      <nav class="nav-links">
        <router-link to="/" class="nav-link">{{ t('common.monitorNav') }}</router-link>
      </nav>
      <ScrollAnnouncement :announcements="announcements" />
    </div>

    <div class="header-right">
      <!-- {{ t('common.languageSwitch') }} -->
      <el-dropdown trigger="click" @command="handleLanguageChange" class="lang-dropdown">
        <span class="lang-switch">
          {{ locale === 'zh-CN' ? t('common.chinese') : t('common.english') }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :class="{ 'is-active': locale === 'zh-CN' }">
              {{ t('common.chinese') }}
            </el-dropdown-item>
            <el-dropdown-item command="en-US" :class="{ 'is-active': locale === 'en-US' }">
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 绑定Gateway按钮 -->
      <el-button type="success" @click="handleBindGateway">
        <el-icon><Plus /></el-icon>
        {{ t('gateway.bind') }}
      </el-button>

      <el-dropdown v-if="userStore.isLoggedIn" trigger="hover" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" class="user-avatar">
            {{ userStore.email?.charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="user-email">{{ userStore.email }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="setToken">
              <el-icon><Setting /></el-icon>
              {{ t('common.setToken') }}
            </el-dropdown-item>
            <el-dropdown-item command="storage">
              <el-icon><Folder /></el-icon>
              {{ t('storage.settings') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              {{ t('common.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div v-else class="auth-buttons">
        <el-button type="primary" @click="goToLogin">{{ t('common.login') }}</el-button>
        <el-button @click="goToRegister">{{ t('common.register') }}</el-button>
      </div>
    </div>

    <!-- 数据存储设置对话框 -->
    <StorageSettings v-model="showStorageSettings" />

    <!-- Gateway绑定向导对话框 -->
    <BindWizard v-model="showBindWizard" @success="handleBindSuccess" />
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { Folder, SwitchButton, ArrowDown, Plus, Setting } from '@element-plus/icons-vue'
import ScrollAnnouncement from '@/components/common/ScrollAnnouncement.vue'
import StorageSettings from '@/components/common/StorageSettings.vue'
import BindWizard from '@/components/gateway/BindWizard.vue'
import http from '@/utils/http'

const router = useRouter()
const userStore = useUserStore()
const { locale, t } = useI18n()

const announcements = ref([])
const showStorageSettings = ref(false)
const showBindWizard = ref(false)
const showMultiAccountsManager = ref(false)
let hasFetchedAnnouncements = false // 标记是否已经获取过公告

// 获取公告（暂时禁用，云ECS不支持此接口）
const fetchAnnouncements = async () => {
  // 云ECS不支持 /api/announcement/list 接口，暂时禁用
  announcements.value = []
  console.log('Announcements feature disabled: cloud ECS does not support /api/announcement/list')
}

const handleLanguageChange = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  // Notify iframe (monitor-ui-v2.html) about language change
  const iframe = document.querySelector('.monitor-iframe')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ type: 'languageChange', lang }, '*')
  }
}

const handleCommand = (command) => {
  console.log('Header handleCommand called, command:', command)
  switch (command) {
    case 'setToken':
      ElMessage.info(t('common.setTokenDev'))
      break
    case 'storage':
      console.log('Storage settings button clicked, showStorageSettings.value:', showStorageSettings.value)
      showStorageSettings.value = true
      console.log('After setting, showStorageSettings.value:', showStorageSettings.value)
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      // 延迟刷新页面以确保登出状态更新
      setTimeout(() => {
        window.location.reload()
      }, 300)
      break
  }
}

// 添加全局方法，供iframe调用
onMounted(() => {
  window.openBindWizard = () => {
    console.log('Global method openBindWizard called')
    handleBindGateway()
  }

  // 监听自定义事件
  document.addEventListener('openBindWizard', () => {
    console.log('Received openBindWizard custom event')
    handleBindGateway()
  })
})

onUnmounted(() => {
  // 清理全局方法
  delete window.openBindWizard
})

const handleBindGateway = () => {
  showBindWizard.value = true
}

const handleBindSuccess = () => {
  showBindWizard.value = false
  ElMessage.success(t('common.bindSuccess'))
  // 刷新页面以更新数据
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

const handleAccountSwitch = (accountId) => {
  console.log('Switch to account:', accountId)
  ElMessage.success(t('common.accountSwitchOk'))
  // TODO: 实际切换账号逻辑
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
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  overflow: hidden;
  gap: 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #28C78E;
  background: #f0faf6;
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
