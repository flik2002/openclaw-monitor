import { all, get, run } from '../database/init.js'

class GatewayConfigRepository {
  // 创建Gateway配置
  async create(config) {
    const sql = `INSERT INTO gateway_configs (id, user_id, agent_name, gateway_url, token_encrypted, connection_status, bound_at, last_connected_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    run(sql, [config.id, config.user_id, config.agent_name, config.gateway_url, config.token_encrypted, config.connection_status, config.bound_at, config.last_connected_at])
    return { id: config.id, ...config }
  }

  // 根据ID查找
  async findById(id) {
    const sql = `SELECT * FROM gateway_configs WHERE id = ?`
    return get(sql, [id])
  }

  // 根据用户ID查找所有Gateway
  async findByUserId(userId) {
    const sql = `SELECT * FROM gateway_configs WHERE user_id = ?`
    return all(sql, [userId])
  }

  // 更新Gateway配置
  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    const sql = `UPDATE gateway_configs SET ${fields} WHERE id = ?`
    const result = run(sql, [...values, id])
    return result.changes > 0
  }

  // 删除Gateway配置
  async delete(id) {
    const sql = `DELETE FROM gateway_configs WHERE id = ?`
    const result = run(sql, [id])
    return result.changes > 0
  }

  // 获取所有Gateway配置
  async findAll() {
    const sql = `SELECT * FROM gateway_configs`
    return all(sql, [])
  }
}

export default new GatewayConfigRepository()
