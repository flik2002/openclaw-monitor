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
        { value: 7, label: '7天' },
        { value: 30, label: '30天' },
        { value: 90, label: '90天' },
        { value: -1, label: '永久' }
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
    }
  }
})
