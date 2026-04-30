<template>
  <div class="agent-tab-manager">
    <div class="tabs-container">
      <AgentTab
        v-for="agent in agents"
        :key="agent.id"
        :agent="agent"
        :is-selected="agent.id === selectedTabId"
        :is-hovered="agent.id === hoveredTabId"
        @click="handleTabClick"
        @hover="handleTabHover"
        @delete="handleDelete"
      />

      <!-- 添加标签页 -->
      <div
        v-if="!isMaxReached"
        class="add-tab"
        @click="handleAdd"
      >
        <el-icon><Plus /></el-icon>
        <span>{{ t('common.add') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useAgentStore } from '@/stores/agentStore'
import AgentTab from './AgentTab.vue'
import axios from 'axios'

const { t } = useI18n()
const agentStore = useAgentStore()

const agents = computed(() => agentStore.agents)
const selectedTabId = computed(() => agentStore.selectedTabId)
const hoveredTabId = computed(() => agentStore.hoveredTabId)
const isMaxReached = computed(() => agentStore.isMaxReached)

const emit = defineEmits(['add', 'select'])

const handleTabClick = (agentId) => {
  agentStore.selectTab(agentId)
  emit('select', agentId)
}

const handleTabHover = (agentId) => {
  if (agentId) {
    agentStore.setHover(agentId)
  } else {
    agentStore.setHover(null)
  }
}

const handleAdd = () => {
  emit('add')
}

const handleDelete = async (agent) => {
  try {
    await ElMessageBox.confirm(
      t('monitor.deleteConfirm', { name: agent.name }),
      t('monitor.deleteTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    // 调用删除API
    await axios.delete(`/api/gateway/unbind/${agent.gatewayId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    ElMessage.success(t('monitor.deleteSuccess'))

    // 刷新列表
    emit('select', null)
    window.location.reload()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || t('monitor.deleteFailed'))
    }
  }
}
</script>

<style scoped>
.agent-tab-manager {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.tabs-container {
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 0 20px;
}

.tabs-container::-webkit-scrollbar {
  height: 4px;
}

.tabs-container::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.add-tab {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  color: #909399;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.add-tab:hover {
  color: #28C78E;
  background: #f0faf6;
}
</style>
