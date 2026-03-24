import initSqlJs from 'sql.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库文件路径
const dbPath = path.join(__dirname, '../../data.db')

let db = null
let SQL = null

// 初始化数据库
const initDatabase = async () => {
  try {
    // 初始化sql.js
    SQL = await initSqlJs()

    // 尝试加载现有数据库
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath)
      db = new SQL.Database(fileBuffer)
      console.log('✅ 数据库加载成功:', dbPath)
    } else {
      // 创建新数据库
      db = new SQL.Database()
      console.log('✅ 数据库创建成功:', dbPath)
    }

    // 创建表
    createTables()

    // 保存数据库
    saveDatabase()

    console.log('🎉 数据库初始化完成')
    return db
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err)
    throw err
  }
}

// 创建数据库表
const createTables = () => {
  // 1. 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'registered_user',
      created_at TEXT NOT NULL,
      last_login_at TEXT
    )
  `)
  console.log('✅ users 表创建成功')

  // 2. Gateway配置表
  db.run(`
    CREATE TABLE IF NOT EXISTS gateway_configs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      gateway_url TEXT NOT NULL,
      token_encrypted TEXT NOT NULL,
      connection_status TEXT NOT NULL DEFAULT 'offline',
      bound_at TEXT NOT NULL,
      last_connected_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)
  console.log('✅ gateway_configs 表创建成功')

  // 3. 智能体表
  db.run(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      gateway_config_id TEXT NOT NULL,
      name TEXT NOT NULL,
      responsibility TEXT,
      model TEXT NOT NULL,
      type TEXT NOT NULL,
      parent_id TEXT,
      status TEXT NOT NULL DEFAULT 'offline',
      ui_state TEXT DEFAULT 'normal',
      FOREIGN KEY (gateway_config_id) REFERENCES gateway_configs(id)
    )
  `)
  console.log('✅ agents 表创建成功')

  // 4. 滚动公告表
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      scroll_speed TEXT NOT NULL DEFAULT 'medium',
      effective_at TEXT NOT NULL,
      expiry_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)
  console.log('✅ announcements 表创建成功')

  // 5. 广告位表
  db.run(`
    CREATE TABLE IF NOT EXISTS advertisements (
      id TEXT PRIMARY KEY,
      position TEXT NOT NULL,
      content_type TEXT NOT NULL,
      content TEXT NOT NULL,
      link TEXT,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      effective_at TEXT NOT NULL,
      expiry_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)
  console.log('✅ advertisements 表创建成功')
}

// 保存数据库到文件
const saveDatabase = () => {
  try {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  } catch (err) {
    console.error('❌ 保存数据库失败:', err)
  }
}

// 获取数据库实例
const getDatabase = () => {
  if (!db) {
    throw new Error('数据库未初始化')
  }
  return db
}

// 执行查询(返回所有结果)
const all = (sql, params = []) => {
  const stmt = db.prepare(sql)
  stmt.bind(params)

  const results = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    results.push(row)
  }
  stmt.free()

  return results
}

// 执行查询(返回单个结果)
const get = (sql, params = []) => {
  const results = all(sql, params)
  return results.length > 0 ? results[0] : null
}

// 执行更新/插入/删除
const run = (sql, params = []) => {
  db.run(sql, params)
  saveDatabase()

  return {
    changes: db.getRowsModified(),
    lastInsertRowid: getLastInsertRowid()
  }
}

// 获取最后插入的ID
const getLastInsertRowid = () => {
  const result = get('SELECT last_insert_rowid() as id')
  return result.id
}

export {
  initDatabase,
  getDatabase,
  saveDatabase,
  all,
  get,
  run
}
