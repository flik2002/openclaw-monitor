import { useAgentStore } from '@/stores/agentStore'
import { useGatewayStore } from '@/stores/gatewayStore'
import { openclawGatewayService } from './openclawGatewayService'

class PollingService {
  constructor() {
    this.intervalId = null
    this.pollingInterval = 20000 // 20秒轮询
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
    console.log(`Polling service started, interval: ${this.pollingInterval}ms`)

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
    console.log('Polling service stopped')
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
      console.log('No bound gateways, skip polling')
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
      console.error('Polling failed:', error)
    }
  }

  /**
   * 获取单个智能体状态
   */
  async fetchAgentStatus(gateway) {
    try {
      // 从本地存储获取网关信息
      const boundGatewayStr = localStorage.getItem('bound_gateway')

      if (!boundGatewayStr) {
        console.log('No bound gateway found, skip fetching status')
        return null
      }

      const boundGateway = JSON.parse(boundGatewayStr)
      const gatewayUrl = boundGateway.gatewayUrl
      const token = boundGateway.token

      if (!gatewayUrl) {
        console.error('Gateway URL is null')
        return null
      }

      // 使用OpenClaw网关服务获取所有指标
      const metrics = await openclawGatewayService.getAllMetrics(gatewayUrl, token)

      return metrics
    } catch (error) {
      console.error(`Failed to get agent status [${gateway.agentName}]:`, error)
      return {
        online: false,
        status: 'offline'
      }
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
