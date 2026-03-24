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
      />

      <!-- 添加标签页 -->
      <div
        v-if="!isMaxReached"
        class="add-tab"
        @click="handleAdd"
      >
        <el-icon><Plus /></el-icon>
        <span>添加</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useAgentStore } from '@/stores/agentStore'
import AgentTab from './AgentTab.vue'

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
