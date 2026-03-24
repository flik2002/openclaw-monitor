import { all, get, run } from '../database/init.js'

class AdvertisementRepository {
  // 创建广告
  async create(ad) {
    const sql = `INSERT INTO advertisements (id, position, content_type, content, link, width, height, effective_at, expiry_at, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    run(sql, [ad.id, ad.position, ad.content_type, ad.content, ad.link, ad.width, ad.height, ad.effective_at, ad.expiry_at, ad.created_at])
    return { id: ad.id, ...ad }
  }

  // 根据ID查找
  async findById(id) {
    const sql = `SELECT * FROM advertisements WHERE id = ?`
    return get(sql, [id])
  }

  // 根据位置获取有效广告
  async findByPosition(position) {
    const now = new Date().toISOString()
    const sql = `SELECT * FROM advertisements WHERE position = ? AND effective_at <= ? AND expiry_at >= ?`
    return all(sql, [position, now, now])
  }

  // 获取所有有效广告
  async findActive() {
    const now = new Date().toISOString()
    const sql = `SELECT * FROM advertisements WHERE effective_at <= ? AND expiry_at >= ?`
    return all(sql, [now, now])
  }

  // 获取所有广告
  async findAll() {
    const sql = `SELECT * FROM advertisements ORDER BY created_at DESC`
    return all(sql, [])
  }

  // 更新广告
  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    const sql = `UPDATE advertisements SET ${fields} WHERE id = ?`
    const result = run(sql, [...values, id])
    return result.changes > 0
  }

  // 删除广告
  async delete(id) {
    const sql = `DELETE FROM advertisements WHERE id = ?`
    const result = run(sql, [id])
    return result.changes > 0
  }
}

export default new AdvertisementRepository()
