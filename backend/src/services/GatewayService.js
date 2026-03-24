import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import GatewayConfigRepository from '../repositories/GatewayConfigRepository.js'
import AgentRepository from '../repositories/AgentRepository.js'
import { encrypt, decrypt } from '../utils/encryption.js'

const MAX_AGENTS = 8 // V14: 最多8个智能体

class GatewayService {
  // 测试Gateway连接
  async testConnection(gatewayUrl, token) {
    try {
      const startTime = Date.now()
      
      const response = await axios.get(`${gatewayUrl}/health`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      })
      
      const latency = Date.now() - startTime
      
      return {
        connected: true,
        latency,
        message: '连接成功'
      }
    } catch (error) {
      return {
        connected: false,
        latency: 0,
        message: '连接失败: ' + (error.message || '未知错误')
      }
    }
  }

  // 动态发现智能体和渠道(V14新增)
  async discoverAgents(gatewayUrl, token) {
    try {
      const response = await axios.post(`${gatewayUrl}/tools/invoke`, {
        tool: 'sessions_list',
        args: {}
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000
      })
      
      const sessions = response.data.result?.sessions || []
      const agents = []
      const channels = new Set()
      
      sessions.forEach(session => {
        // 从sessions[].key提取agentId
        const agentId = this.extractAgentId(session.key)
        
        if (!agents.find(a => a.id === agentId)) {
          agents.push({
            id: agentId,
            name: agentId,
            type: 'main',
            status: 'idle',
            model: session.model || 'unknown'
          })
        }
        
        // 从sessions[].channel提取channel
        if (session.channel) {
          channels.add(session.channel)
        }
      })
      
      return { agents, channels: Array.from(channels) }
    } catch (error) {
      console.error('动态发现智能体失败:', error)
      return { agents: [], channels: [] }
    }
  }

  // 从session.key提取agentId
  extractAgentId(key) {
    // key格式: "agent:main:main" 或 "agent:sub:agent1"
    const parts = key.split(':')
    return parts.length >= 3 ? parts[2] : key
  }

  // 绑定Gateway
  async bindGateway(userId, agentName, gatewayUrl, token) {
    // 检查绑定数量限制
    const count = await GatewayConfigRepository.countByUserId(userId)
    
    if (count >= MAX_AGENTS) {
      throw new Error(`已达到绑定上限(最多${MAX_AGENTS}个智能体)`)
    }
    
    // 测试连接
    const testResult = await this.testConnection(gatewayUrl, token)
    
    if (!testResult.connected) {
      throw new Error('Gateway连接失败')
    }
    
    // 动态发现智能体和渠道
    const { agents, channels } = await this.discoverAgents(gatewayUrl, token)
    
    // 加密Token
    const tokenEncrypted = encrypt(token)
    
    // 创建Gateway配置
    const gatewayId = uuidv4()
    const now = new Date().toISOString()
    
    const gatewayConfig = {
      id: gatewayId,
      user_id: userId,
      agent_name: agentName,
      gateway_url: gatewayUrl,
      token_encrypted: tokenEncrypted,
      connection_status: 'running',
      bound_at: now,
      last_connected_at: now
    }
    
    await GatewayConfigRepository.create(gatewayConfig)
    
    // 创建智能体记录
    for (const agent of agents) {
      const agentRecord = {
        id: uuidv4(),
        gateway_config_id: gatewayId,
        name: agent.name,
        responsibility: null,
        model: agent.model,
        type: agent.type,
        parent_id: null,
        status: agent.status,
        ui_state: 'normal'
      }
      
      await AgentRepository.create(agentRecord)
    }
    
    return {
      success: true,
      message: '绑定成功',
      data: {
        gatewayId,
        agents,
        channels
      }
    }
  }

  // 获取用户的Gateway列表
  async getGatewayList(userId) {
    const configs = await GatewayConfigRepository.findByUserId(userId)
    
    // 为每个Gateway获取智能体列表
    const result = []
    
    for (const config of configs) {
      const agents = await AgentRepository.findByGatewayConfigId(config.id)
      
      result.push({
        id: config.id,
        agentName: config.agent_name,
        gatewayUrl: config.gateway_url,
        connectionStatus: config.connection_status,
        boundAt: config.bound_at,
        lastConnectedAt: config.last_connected_at,
        agents
      })
    }
    
    return {
      success: true,
      data: result
    }
  }

  // 解绑Gateway
  async unbindGateway(userId, gatewayId) {
    // 检查Gateway是否属于该用户
    const config = await GatewayConfigRepository.findById(gatewayId)
    
    if (!config || config.user_id !== userId) {
      throw new Error('Gateway不存在或无权访问')
    }
    
    // 删除智能体记录
    await AgentRepository.deleteByGatewayConfigId(gatewayId)
    
    // 删除Gateway配置
    await GatewayConfigRepository.delete(gatewayId)
    
    return {
      success: true,
      message: '解绑成功'
    }
  }
}

export default new GatewayService()
