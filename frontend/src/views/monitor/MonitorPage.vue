<template>
  <div class="display-page">
    <!-- 头部 -->
    <Header />

    <!-- 主内容 -->
    <main class="main-content">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <el-icon class="is-loading" :size="40">
          <Loading />
        </el-icon>
        <p>{{ t('common.loading') }}</p>
      </div>

      <!-- 监控内容 -->
      <div v-else class="monitor-content">
        <!-- 有Agent时显示监控内容 -->
        <template v-if="hasGateways">
          <!-- Agent管理区域 (独立区域) -->
          <section class="agent-management-section">
            <h2>{{ t('monitor.boundAgents') }}</h2>
            <div class="agent-cards-container">
              <el-card
                v-for="gateway in gatewayStore.gateways"
                :key="gateway.id"
                class="agent-card"
                :class="{ 'agent-card-hovered': hoveredAgentId === gateway.id }"
                @click="handleAgentClick(gateway)"
                @mouseenter="hoveredAgentId = gateway.id"
                @mouseleave="hoveredAgentId = null"
              >
                <div class="agent-header">
                  <div class="agent-icon">
                    <el-icon :size="40" :color="getAgentIconColor(gateway.connectionStatus)">
                      <Tools />
                    </el-icon>
                  </div>
                  <div class="agent-name">
                    <h3>{{ gateway.agentName }}</h3>
                    <el-tag :type="gateway.connectionStatus === 'running' ? 'success' : 'info'" size="small">
                      {{ gateway.connectionStatus === 'running' ? t('common.online') : t('common.offline') }}
                    </el-tag>
                  </div>
                </div>
                <div class="agent-details">
                  <p><strong>{{ t('monitor.gatewayAddress') }}</strong> {{ gateway.gatewayUrl }}</p>
                  <p><strong>{{ t('monitor.type') }}</strong> {{ t('monitor.mainAgent') }}</p>
                  <p><strong>{{ t('monitor.boundAt') }}</strong> {{ new Date(gateway.boundAt).toLocaleString() }}</p>
                </div>
                <div class="agent-actions">
                  <el-button type="primary" size="small" @click.stop="handleViewAgent(gateway)">
                    <el-icon><Monitor /></el-icon>
                    {{ t('common.viewStatus') }}
                  </el-button>
                  <el-button type="danger" size="small" @click.stop="handleDeleteGateway(gateway)">
                    <el-icon><Delete /></el-icon>
                    {{ t('common.delete') }}
                  </el-button>
                </div>
              </el-card>
            </div>
          </section>
        </template>

        <!-- 空状态 -->
        <EmptyState v-else @bind="handleAddGateway" />
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Monitor, Tools, Loading } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore'
import { useAgentStore } from '@/stores/agentStore'
import { useGatewayStore } from '@/stores/gatewayStore'
import { pollingService } from '@/services/pollingService'
import http from '@/utils/http'
import axios from 'axios'
import { getAgentIcon, getAgentIconColor } from '@/config/agentIconMapping'

// 组件导入
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Advertisement from '@/components/common/Advertisement.vue'
import AgentTabManager from '@/components/monitor/AgentTabManager.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import BindWizard from '@/components/gateway/BindWizard.vue'

const { t } = useI18n()
const userStore = useUserStore()
const agentStore = useAgentStore()
const gatewayStore = useGatewayStore()

const showBindWizard = ref(false)
const ads = ref([])
const hoveredAgentId = ref(null)

const agents = computed(() => agentStore.agents)
const selectedAgentId = computed(() => agentStore.selectedTabId)
const hasGateways = computed(() => gatewayStore.gateways.length > 0)
const isLoading = ref(true) // 添加加载状态

// 获取广告（暂时禁用，云ECS不支持此接口）
const fetchAds = async () => {
  // 云ECS不支持 /api/ad/list 接口，暂时禁用
  ads.value = []
  console.log('Ads feature disabled: cloud ECS does not support /api/ad/list')
}

// 获取用户的Gateway列表
const fetchGateways = async () => {
  if (!userStore.isLoggedIn) return

  try {
    // 从本地存储获取已绑定的网关信息
    const boundGatewayStr = localStorage.getItem('bound_gateway')

    if (!boundGatewayStr) {
      console.log('No bound gateway found')
      gatewayStore.setGateways([])
      agentStore.setAgents([])
      return
    }

    const boundGateway = JSON.parse(boundGatewayStr)
    console.log('Found bound gateway:', boundGateway)

    // 构建网关列表（从本地存储）
    const gateways = [{
      id: boundGateway.gatewayId,
      gatewayUrl: boundGateway.gatewayUrl,
      agentName: boundGateway.name || '默认网关',
      connectionStatus: boundGateway.status || 'connected',
      boundAt: new Date().toISOString()
    }]

    console.log('Parsed gateways:', gateways)

    // 设置Gateway数据到store
    gatewayStore.setGateways(gateways)

    // 清空agents（网关状态不包含agents信息）
    agentStore.setAgents([])

    // 验证数据是否正确设置
    console.log('After set gatewayStore.gateways:', gatewayStore.gateways)
    console.log('After set hasGateways:', hasGateways.value)
    console.log('After set gatewayStore.gateways.length:', gatewayStore.gateways.length)

    // 检查每个gateway的详细信息
    gatewayStore.gateways.forEach((gw, index) => {
      console.log(`Gateway ${index}:`, {
        id: gw.id,
        agentName: gw.agentName,
        gatewayUrl: gw.gatewayUrl,
        connectionStatus: gw.connectionStatus
      })
    })
  } catch (error) {
    console.error('Failed to fetch gateway status:', error)
  }
}

const handleAddGateway = () => {
  console.log('handleAddGateway called')
  console.log('userStore.isLoggedIn:', userStore.isLoggedIn)
  console.log('userStore.email:', userStore.email)
  console.log('userStore.userId:', userStore.userId)

  // 检查是否登录
  if (!userStore.isLoggedIn) {
    console.log('User not logged in, redirect to login')
    // 未登录,跳转到登录页
    window.location.href = '/auth/login'
    return
  }

  console.log('User logged in, show bind wizard')
  // 已登录,显示绑定向导
  showBindWizard.value = true
  console.log('showBindWizard.value:', showBindWizard.value)
}

const handleDeleteGateway = async (gateway) => {
  try {
    await ElMessageBox.confirm(
      t('monitor.deleteConfirm', { name: gateway.agentName }),
      t('monitor.deleteTitle'),
      {
        confirmButtonText: t('common.confirmDelete'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    console.log('Delete gateway:', gateway.id)

    // 前端独立完成删除，不请求云ECS
    // 1. 从localStorage删除网关信息
    localStorage.removeItem('bound_gateway')
    localStorage.removeItem('gatewayToken')
    console.log('Gateway info removed from localStorage')

    // 2. 从store中移除该Gateway和对应的Agents
    gatewayStore.removeGateway(gateway.id)
    // 清理属于该Gateway的agents
    const remainingAgents = agentStore.agents.filter(a => a.gatewayId !== gateway.id)
    agentStore.setAgents(remainingAgents)

    ElMessage.success(t('monitor.deleteSuccess'))

  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete gateway:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleGatewayClick = (gateway) => {
  console.log('Click gateway:', gateway)

  // 获取该Gateway的智能体列表
  const gatewayAgents = agents.value.filter(a => a.gatewayId === gateway.id)

  if (gatewayAgents.length > 0) {
    // 如果有智能体，选择第一个智能体
    console.log('Gateway has agents, select first:', gatewayAgents[0])
    agentStore.selectTab(gatewayAgents[0].id)
    ElMessage.success(t('monitor.selectedAgent', { name: gatewayAgents[0].name }))
  } else {
    // 如果没有智能体，提示用户
    console.log('Gateway has no agents')
    ElMessage.info(t('monitor.noAgentMsg'))
  }
}

const handleAgentClick = (gateway) => {
  console.log('Click agent:', gateway)
  // 智能体卡片点击逻辑，可以添加更多交互
}

const handleViewAgent = (gateway) => {
  console.log('View agent status:', gateway)

  // 设置当前选中的Gateway ID到localStorage，供MonitorPageV2使用
  localStorage.setItem('selectedGatewayId', gateway.id)

  // 跳转到监控页面V2
  window.location.href = '/monitor-v2'
}

const handleSelectAgent = (agentId) => {
  console.log('Select agent:', agentId)
  agentStore.selectTab(agentId)

  // 获取选中的智能体详细信息
  const selectedAgent = agents.value.find(a => a.id === agentId)
  if (selectedAgent) {
    console.log('Selected agent details:', selectedAgent)
  }
}

const handleBindSuccess = () => {
  console.log('Gateway bind success')
  // 不需要重新获取数据，因为BindWizard已经将数据添加到store中
  // 只需要关闭对话框即可
  ElMessage.success(t('common.bindSuccessMsg'))
}

// 手动刷新智能体列表
const refreshAgents = async () => {
  console.log('Manually refresh agent list')
  await fetchGateways()
}

onMounted(async () => {
  try {
    // 首先检查认证状态，从localStorage恢复用户信息
    userStore.checkAuth()

    // 启动轮询服务（不阻塞页面渲染）
    if (userStore.isLoggedIn) {
      try {
        pollingService.start()
      } catch (error) {
        console.error('Failed to start polling service:', error)
      }
    }

    // 并行执行：获取广告和Gateway列表（如果已登录）
    const tasks = [fetchAds()]

    // 如果已登录,获取Gateway列表
    if (userStore.isLoggedIn) {
      tasks.push(fetchGateways())
    }

    // 并行执行所有任务
    Promise.all(tasks).then(() => {
      // 数据加载完成，设置加载状态为false
      isLoading.value = false
    }).catch(error => {
      console.error('Failed to load data:', error)
      isLoading.value = false
    })
  } catch (error) {
    console.error('Page initialization failed:', error)
    ElMessage.warning(t('common.pageInitFailed'))
    isLoading.value = false
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

/* Agent管理区域 */
.agent-management-section {
  margin-bottom: 30px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.agent-management-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #28C78E;
  padding-bottom: 10px;
}

.agent-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.loading-container .el-icon {
  color: #28C78E;
  margin-bottom: 16px;
}

.loading-container p {
  font-size: 16px;
  color: #666;
}

.no-agents-message {
  text-align: center;
  padding: 40px 20px;
}

.agent-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.agent-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.agent-card-hovered {
  border-color: #28C78E;
  background-color: #f0faf6;
}

.agent-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.agent-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.agent-name {
  flex: 1;
}

.agent-name h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.agent-details {
  margin-bottom: 16px;
}

.agent-details p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.agent-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

/* 广告位 - 右下角悬浮,不影响用户体验 */
.ad-float {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 50;
  max-width: 300px;
}

/* 状态卡片网格 */
.status-grid {
  width: 100%;
  margin-bottom: 20px;
}
</style>
