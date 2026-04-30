import { defineStore } from 'pinia'

export const useStorageStore = defineStore('storage', {
  state: () => ({
    retentionDays: 30, // 数据保留时长(天)
    currentUsage: 0, // 当前存储占用(MB)
    lastCleanup: null // 最后清理时间
  }),

  getters: {
    // 格式化存储占用
    formattedUsage: (state) => {
      return `${state.currentUsage.toFixed(1)} MB`
    },

    // 保留时长选项
    retentionOptions: () => {
      return [
        { value: 7, label: '7 Days' },
        { value: 30, label: '30 Days' },
        { value: 90, label: '90 Days' },
        { value: -1, label: 'Forever' }
      ]
    }
  },

  actions: {
    // 设置保留时长
    setRetentionDays(days) {
      this.retentionDays = days
      localStorage.setItem('retentionDays', days.toString())
    },

    // 更新存储占用
    updateUsage(usage) {
      this.currentUsage = usage
    },

    // 设置最后清理时间
    setLastCleanup(time) {
      this.lastCleanup = time
      localStorage.setItem('lastCleanup', time)
    },

    // 从LocalStorage加载配置
    loadConfig() {
      const retentionDays = localStorage.getItem('retentionDays')
      const lastCleanup = localStorage.getItem('lastCleanup')

      if (retentionDays) {
        this.retentionDays = parseInt(retentionDays)
      }

      if (lastCleanup) {
        this.lastCleanup = lastCleanup
      }
    },

    // 获取保留时长
    getRetention() {
      const retention = localStorage.getItem('retention')
      return retention || '30'
    },

    // 设置保留时长
    setRetention(value) {
      localStorage.setItem('retention', value)
    },

    // 获取存储使用量(字节)
    getStorageUsed() {
      let total = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      return total * 2 // UTF-16 每个字符2字节
    },

    // 获取存储总量(假设5MB限制)
    getStorageTotal() {
      return 5 * 1024 * 1024 // 5MB
    },

    // 导出数据
    async exportData() {
      const data = {}
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          data[key] = localStorage[key]
        }
      }
      return data
    },

    // 清除所有数据
    clearAll() {
      localStorage.clear()
      this.currentUsage = 0
      this.lastCleanup = new Date().toISOString()
    }
  }
})
