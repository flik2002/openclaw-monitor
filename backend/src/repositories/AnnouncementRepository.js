import { all, get, run } from '../database/init.js'

class AnnouncementRepository {
  // 创建公告
  async create(announcement) {
    const sql = `INSERT INTO announcements (id, content, priority, scroll_speed, effective_at, expiry_at, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
    run(sql, [announcement.id, announcement.content, announcement.priority, announcement.scroll_speed, announcement.effective_at, announcement.expiry_at, announcement.created_at])
    return { id: announcement.id, ...announcement }
  }

  // 根据ID查找
  async findById(id) {
    const sql = `SELECT * FROM announcements WHERE id = ?`
    return get(sql, [id])
  }

  // 获取所有有效公告
  async findActive() {
    const now = new Date().toISOString()
    const sql = `SELECT * FROM announcements WHERE effective_at <= ? AND expiry_at >= ? ORDER BY priority DESC, created_at DESC`
    return all(sql, [now, now])
  }

  // 获取所有公告
  async findAll() {
    const sql = `SELECT * FROM announcements ORDER BY created_at DESC`
    return all(sql, [])
  }

  // 更新公告
  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    const sql = `UPDATE announcements SET ${fields} WHERE id = ?`
    const result = run(sql, [...values, id])
    return result.changes > 0
  }

  // 删除公告
  async delete(id) {
    const sql = `DELETE FROM announcements WHERE id = ?`
    const result = run(sql, [id])
    return result.changes > 0
  }
}

export default new AnnouncementRepository()
