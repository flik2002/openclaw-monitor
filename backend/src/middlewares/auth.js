import { verifyToken } from '../utils/jwt.js'

// JWT 认证中间件
export const authMiddleware = (req, res, next) => {
  // 从请求头获取 Token
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未提供认证 Token'
    })
  }
  
  const token = authHeader.substring(7) // 移除 "Bearer " 前缀
  
  // 验证 Token
  const decoded = verifyToken(token)
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Token 无效或已过期'
    })
  }
  
  // 将用户信息附加到请求对象
  req.user = decoded
  next()
}

// 可选认证中间件(允许访客访问)
export const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (decoded) {
      req.user = decoded
    }
  }
  
  next()
}
