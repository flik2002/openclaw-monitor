import { useAgentStore } from '@/stores/agentStore'
import { useGatewayStore } from '@/stores/gatewayStore'
import http from '@/utils/http'

class PollingService {
  constructor() {
    this.intervalId = null
    this.pollingInterval = 30000 // V14: 30秒轮询
    this.isPolling = false
  }

  /**
   * 启动轮询服务
   */
  start() {
    if (this.isPolling) {
      console.warn('轮询服务已在运行')
      return
    }

    this.isPolling = true
    console.log(`启动状态轮询服务,间隔: ${this.pollingInterval}ms`)

    // 立即执行一次
    this.poll()

    // 设置定时轮询
    this.intervalId = setInterval(() => {
      this.poll()
    }, this.pollingInterval)
  }

  /**
   * 停止轮询服务
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isPolling = false
    console.log('停止状态轮询服务')
  }

  /**
   * 执行轮询
   */
  async poll() {
    const agentStore = useAgentStore()
    const gatewayStore = useGatewayStore()

    // 获取所有已绑定的Gateway
    const gateways = gatewayStore.gateways

    if (gateways.length === 0) {
      console.log('没有已绑定的Gateway,跳过轮询')
      return
    }

    // 并行请求所有Gateway的状态
    const promises = gateways.map(gateway => this.fetchAgentStatus(gateway))

    try {
      const results = await Promise.allSettled(promises)

      // 更新智能体状态
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const agentId = gateways[index].agentId
          agentStore.updateAgentStatus(agentId, result.value)
        }
      })
    } catch (error) {
      console.error('轮询失败:', error)
    }
  }

  /**
   * 获取单个智能体状态
   */
  async fetchAgentStatus(gateway) {
    try {
      const response = await http.post('/api/gateway/status', {
        gatewayId: gateway.id
      })

      if (response.success) {
        return response.data
      }
    } catch (error) {
      console.error(`获取智能体状态失败 [${gateway.agentName}]:`, error)
      return null
    }
  }

  /**
   * 更新轮询间隔
   */
  setInterval(interval) {
    this.pollingInterval = interval
    if (this.isPolling) {
      this.stop()
      this.start()
    }
  }
}

// 导出单例
export const pollingService = new PollingService()
