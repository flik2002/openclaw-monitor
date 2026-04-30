import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', {
  state: () => ({
    agents: [], // 智能体列表(最多8个)
    selectedTabId: null, // 当前选中的标签页ID (V14)
    hoveredTabId: null, // 当前悬停的标签页ID (V14)
    maxAgents: 8, // 最大智能体数量 (V14: 从4个升级到8个)
    loading: false,
    error: null
  }),

  getters: {
    // 获取选中的智能体
    selectedAgent: (state) => {
      return state.agents.find(a => a.id === state.selectedTabId) || null
    },

    // 是否达到上限
    isMaxReached: (state) => {
      return state.agents.length >= state.maxAgents
    },

    // 智能体数量
    agentCount: (state) => {
      return state.agents.length
    }
  },

  actions: {
    // 设置智能体列表
    setAgents(agents) {
      this.agents = agents
      if (agents.length > 0) {
        // 如果当前选中的不在新列表中，选择第一个
        if (!agents.find(a => a.id === this.selectedTabId)) {
          this.selectedTabId = agents[0].id
        }
      } else {
        // 列表为空时，清空选中状态
        this.selectedTabId = null
      }
    },

    // 添加智能体
    addAgent(agent) {
      if (this.agents.length < this.maxAgents) {
        this.agents.push(agent)
        if (!this.selectedTabId) {
          this.selectedTabId = agent.id
        }
      }
    },

    // 移除智能体
    removeAgent(agentId) {
      this.agents = this.agents.filter(a => a.id !== agentId)
      if (this.selectedTabId === agentId) {
        this.selectedTabId = this.agents[0]?.id || null
      }
    },

    // 选择标签页 (V14)
    selectTab(agentId) {
      this.selectedTabId = agentId
    },

    // 设置悬停标签页 (V14)
    setHover(agentId) {
      this.hoveredTabId = agentId
    },

    // 更新智能体状态
    updateAgentStatus(agentId, status) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.status = status
      }
    },

    // 更新智能体UI状态 (V14)
    updateAgentUIState(agentId, uiState) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.uiState = uiState
      }
    },

    // 设置加载状态
    setLoading(loading) {
      this.loading = loading
    },

    // 设置错误
    setError(error) {
      this.error = error
    },

    // 清除错误
    clearError() {
      this.error = null
    }
  }
})
