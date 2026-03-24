import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDatabase } from './database/init.js'
import { authMiddleware } from './middlewares/auth.js'

// 路由导入
import authRoutes from './routes/auth.js'
import gatewayRoutes from './routes/gateway.js'
import announcementRoutes from './routes/announcement.js'
import adRoutes from './routes/ad.js'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/gateway', gatewayRoutes)
app.use('/api/announcement', announcementRoutes)
app.use('/api/ad', adRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 启动服务器
const startServer = async () => {
  try {
    // 初始化数据库
    await initDatabase()

    // 启动Express服务器
    app.listen(PORT, () => {
      console.log(`🚀 OpenClaw 监控系统后端服务已启动`)
      console.log(`📡 服务地址: http://localhost:${PORT}`)
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ 服务器启动失败:', error)
    process.exit(1)
  }
}

startServer()

export default app
