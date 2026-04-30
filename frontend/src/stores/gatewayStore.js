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
    // 从本地存储加载Gateway列表
    loadFromLocalStorage() {
      try {
        const stored = localStorage.getItem('gateways')
        if (stored) {
          this.gateways = JSON.parse(stored)
          if (this.gateways.length > 0) {
            this.currentGateway = this.gateways[0]
          }
        }
      } catch (error) {
        console.error('加载本地Gateway数据失败:', error)
        this.gateways = []
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      try {
        localStorage.setItem('gateways', JSON.stringify(this.gateways))
      } catch (error) {
        console.error('保存Gateway数据失败:', error)
      }
    },

    // 设置Gateway列表
    setGateways(gateways) {
      this.gateways = gateways
      this.saveToLocalStorage()
    },

    // 设置当前Gateway
    setCurrentGateway(gateway) {
      this.currentGateway = gateway
    },

    // 添加Gateway（本地存储）
    addGateway(gateway) {
      this.gateways.push(gateway)
      this.saveToLocalStorage()
    },

    // 移除Gateway（本地存储）
    removeGateway(gatewayId) {
      this.gateways = this.gateways.filter(g => g.id !== gatewayId)
      if (this.currentGateway?.id === gatewayId) {
        this.currentGateway = this.gateways[0] || null
      }
      this.saveToLocalStorage()
    },

    // 更新Gateway（本地存储）
    updateGateway(gatewayId, updates) {
      const index = this.gateways.findIndex(g => g.id === gatewayId)
      if (index !== -1) {
        this.gateways[index] = { ...this.gateways[index], ...updates }
        this.saveToLocalStorage()
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
