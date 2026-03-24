import { all, get, run } from '../database/init.js'

class AgentRepository {
  // 创建智能体
  async create(agent) {
    const sql = `INSERT INTO agents (id, gateway_config_id, name, responsibility, model, type, parent_id, status, ui_state) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    run(sql, [agent.id, agent.gateway_config_id, agent.name, agent.responsibility, agent.model, agent.type, agent.parent_id, agent.status, agent.ui_state])
    return { id: agent.id, ...agent }
  }

  // 根据ID查找
  async findById(id) {
    const sql = `SELECT * FROM agents WHERE id = ?`
    return get(sql, [id])
  }

  // 根据Gateway配置ID查找所有智能体
  async findByGatewayConfigId(gatewayConfigId) {
    const sql = `SELECT * FROM agents WHERE gateway_config_id = ?`
    return all(sql, [gatewayConfigId])
  }

  // 更新智能体
  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    const sql = `UPDATE agents SET ${fields} WHERE id = ?`
    const result = run(sql, [...values, id])
    return result.changes > 0
  }

  // 删除智能体
  async delete(id) {
    const sql = `DELETE FROM agents WHERE id = ?`
    const result = run(sql, [id])
    return result.changes > 0
  }

  // 获取所有智能体
  async findAll() {
    const sql = `SELECT * FROM agents`
    return all(sql, [])
  }
}

export default new AgentRepository()
