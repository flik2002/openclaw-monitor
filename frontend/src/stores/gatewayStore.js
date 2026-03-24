import { defineStore } from 'pinia'

export const useGatewayStore = defineStore('gateway', {
  state: () => ({
    gateways: [],
    currentGateway: null,
    loading: false,
    error: null
  }),

  getters: {
    hasGateways: (state) => state.gateways.length > 0,
    gatewayCount: (state) => state.gateways.length
  },

  actions: {
    // 设置Gateway列表
    setGateways(gateways) {
      this.gateways = gateways
    },

    // 设置当前Gateway
    setCurrentGateway(gateway) {
      this.currentGateway = gateway
    },

    // 添加Gateway
    addGateway(gateway) {
      this.gateways.push(gateway)
    },

    // 移除Gateway
    removeGateway(gatewayId) {
      this.gateways = this.gateways.filter(g => g.id !== gatewayId)
      if (this.currentGateway?.id === gatewayId) {
        this.currentGateway = this.gateways[0] || null
      }
    },

    // 更新Gateway
    updateGateway(gatewayId, updates) {
      const index = this.gateways.findIndex(g => g.id === gatewayId)
      if (index !== -1) {
        this.gateways[index] = { ...this.gateways[index], ...updates }
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
