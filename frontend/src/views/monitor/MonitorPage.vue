<template>
  <div class="display-page">
    <!-- 顶部导航栏 -->
    <Header />

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 智能体标签页管理器 -->
      <AgentTabManager
        v-if="hasGateways"
        @add="handleAddGateway"
        @select="handleSelectAgent"
      />

      <!-- 空状态提示 -->
      <EmptyState v-if="!hasGateways" @bind="handleAddGateway" />

      <!-- 监控内容 -->
      <div v-if="hasGateways && agents.length > 0" class="monitor-content">
        <!-- 状态卡片 -->
        <StatusCards :status="currentAgentStatus" />

        <!-- 渠道状态列表 -->
        <ChannelList :channels="currentAgentChannels" />

        <!-- 任务列表 -->
        <TaskList :tasks="currentAgentTasks" />
      </div>

      <!-- 广告位 - 右下角悬浮,不影响用户体验 -->
      <div v-if="ads.length > 0" class="ad-float">
        <Advertisement :ads="ads" position="float" />
      </div>
    </main>

    <!-- 底部 -->
    <Footer />

    <!-- Gateway绑定向导 -->
    <BindWizard v-model="showBindWizard" @success="handleBindSuccess" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAgentStore } from '@/stores/agentStore'
import { useGatewayStore } from '@/stores/gatewayStore'
import { pollingService } from '@/services/pollingService'
import http from '@/utils/http'

// 组件导入
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Advertisement from '@/components/common/Advertisement.vue'
import AgentTabManager from '@/components/monitor/AgentTabManager.vue'
import StatusCards from '@/components/monitor/StatusCards.vue'
import ChannelList from '@/components/monitor/ChannelList.vue'
import TaskList from '@/components/monitor/TaskList.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import BindWizard from '@/components/gateway/BindWizard.vue'

const userStore = useUserStore()
const agentStore = useAgentStore()
const gatewayStore = useGatewayStore()

const showBindWizard = ref(false)
const ads = ref([])

const agents = computed(() => agentStore.agents)
const selectedAgentId = computed(() => agentStore.selectedTabId)
const hasGateways = computed(() => gatewayStore.gateways.length > 0)

const currentAgent = computed(() => {
  return agents.value.find(a => a.id === selectedAgentId.value) || agents.value[0]
})

const currentAgentStatus = computed(() => {
  return currentAgent.value?.status || {}
})

const currentAgentChannels = computed(() => {
  return currentAgent.value?.channels || []
})

const currentAgentTasks = computed(() => {
  return currentAgent.value?.tasks || []
})

// 获取广告
const fetchAds = async () => {
  try {
    const response = await http.get('/api/ad/list')
    if (response.success) {
      ads.value = response.data
    }
  } catch (error) {
    console.error('获取广告失败:', error)
  }
}

// 获取用户的Gateway列表
const fetchGateways = async () => {
  if (!userStore.isLoggedIn) return

  try {
    const response = await http.get('/api/gateway/list')
    if (response.success) {
      gatewayStore.setGateways(response.data)
    }
  } catch (error) {
    console.error('获取Gateway列表失败:', error)
  }
}

const handleAddGateway = () => {
  // 检查是否登录
  if (!userStore.isLoggedIn) {
    // 未登录,跳转到登录页
    window.location.href = '/auth/login'
    return
  }

  // 已登录,显示绑定向导
  showBindWizard.value = true
}

const handleSelectAgent = (agentId) => {
  console.log('选中智能体:', agentId)
}

const handleBindSuccess = () => {
  console.log('Gateway绑定成功')
  fetchGateways()
}

onMounted(() => {
  // 获取广告(访客也可查看)
  fetchAds()

  // 如果已登录,获取Gateway列表
  if (userStore.isLoggedIn) {
    fetchGateways()
    // 启动轮询服务
    pollingService.start()
  }
})

onUnmounted(() => {
  // 停止轮询服务
  pollingService.stop()
})
</script>

<style scoped>
.display-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.monitor-content {
  margin-top: 20px;
}

/* 广告位 - 右下角悬浮,不影响用户体验 */
.ad-float {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 50;
  max-width: 300px;
}
</style>
