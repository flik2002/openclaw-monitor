import { all, get, run } from '../database/init.js'

class UserRepository {
  // 创建用户
  async create(user) {
    const sql = `INSERT INTO users (id, email, phone, password_hash, role, created_at, last_login_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
    run(sql, [user.id, user.email, user.phone, user.password_hash, user.role, user.created_at, user.last_login_at])
    return { id: user.id, ...user }
  }

  // 根据ID查找用户
  async findById(id) {
    const sql = `SELECT * FROM users WHERE id = ?`
    return get(sql, [id])
  }

  // 根据邮箱查找用户
  async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`
    return get(sql, [email])
  }

  // 更新用户
  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    const sql = `UPDATE users SET ${fields} WHERE id = ?`
    const result = run(sql, [...values, id])
    return result.changes > 0
  }

  // 删除用户
  async delete(id) {
    const sql = `DELETE FROM users WHERE id = ?`
    const result = run(sql, [id])
    return result.changes > 0
  }

  // 获取所有用户
  async findAll() {
    const sql = `SELECT * FROM users`
    return all(sql, [])
  }
}

export default new UserRepository()
