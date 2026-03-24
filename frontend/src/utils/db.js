import Dexie from 'dexie'

// 创建IndexedDB数据库
const db = new Dexie('OpenClawMonitorDB')

// 定义数据库结构
db.version(1).stores({
  // 状态历史记录
  statusHistory: '++id, agentId, timestamp, status',

  // KBI趋势数据
  kbiHistory: '++id, agentId, timestamp, taskCompletionRate, responseSpeed, tokenUsage, memoryUsage, cpuUsage',

  // 查看历史
  viewHistory: '++id, agentId, timestamp',

  // 用户配置
  userConfig: 'key, value'
})

// 状态历史相关操作
export const statusHistoryDB = {
  // 添加状态历史
  async add(agentId, status) {
    return await db.statusHistory.add({
      agentId,
      timestamp: new Date().toISOString(),
      status
    })
  },

  // 获取指定智能体的状态历史
  async getByAgentId(agentId, limit = 100) {
    return await db.statusHistory
      .where('agentId')
      .equals(agentId)
      .reverse()
      .sortBy('timestamp')
      .then(items => items.slice(0, limit))
  },

  // 删除过期数据
  async deleteBefore(timestamp) {
    return await db.statusHistory
      .where('timestamp')
      .below(timestamp)
      .delete()
  },

  // 清除所有数据
  async clear() {
    return await db.statusHistory.clear()
  }
}

// KBI历史相关操作
export const kbiHistoryDB = {
  // 添加KBI历史
  async add(agentId, kbiData) {
    return await db.kbiHistory.add({
      agentId,
      timestamp: new Date().toISOString(),
      ...kbiData
    })
  },

  // 获取指定智能体的KBI历史
  async getByAgentId(agentId, limit = 100) {
    return await db.kbiHistory
      .where('agentId')
      .equals(agentId)
      .reverse()
      .sortBy('timestamp')
      .then(items => items.slice(0, limit))
  },

  // 删除过期数据
  async deleteBefore(timestamp) {
    return await db.kbiHistory
      .where('timestamp')
      .below(timestamp)
      .delete()
  },

  // 清除所有数据
  async clear() {
    return await db.kbiHistory.clear()
  }
}

// 查看历史相关操作
export const viewHistoryDB = {
  // 添加查看历史
  async add(agentId) {
    return await db.viewHistory.add({
      agentId,
      timestamp: new Date().toISOString()
    })
  },

  // 获取查看历史
  async getRecent(limit = 10) {
    return await db.viewHistory
      .reverse()
      .sortBy('timestamp')
      .then(items => items.slice(0, limit))
  },

  // 删除过期数据
  async deleteBefore(timestamp) {
    return await db.viewHistory
      .where('timestamp')
      .below(timestamp)
      .delete()
  },

  // 清除所有数据
  async clear() {
    return await db.viewHistory.clear()
  }
}

// 用户配置相关操作
export const userConfigDB = {
  // 设置配置
  async set(key, value) {
    return await db.userConfig.put({ key, value })
  },

  // 获取配置
  async get(key) {
    const config = await db.userConfig.get(key)
    return config?.value
  },

  // 删除配置
  async delete(key) {
    return await db.userConfig.delete(key)
  },

  // 清除所有配置
  async clear() {
    return await db.userConfig.clear()
  }
}

// 获取数据库占用空间(估算)
export const getStorageUsage = async () => {
  try {
    const statusCount = await db.statusHistory.count()
    const kbiCount = await db.kbiHistory.count()
    const viewCount = await db.viewHistory.count()

    // 粗略估算:每条记录约1KB
    const totalKB = (statusCount + kbiCount + viewCount) * 1
    return totalKB / 1024 // 转換為MB
  } catch (error) {
    console.error('获取存储占用失败:', error)
    return 0
  }
}

// 清除所有数据
export const clearAllData = async () => {
  try {
    await statusHistoryDB.clear()
    await kbiHistoryDB.clear()
    await viewHistoryDB.clear()
    return true
  } catch (error) {
    console.error('清除数据失败:', error)
    return false
  }
}

export default db
