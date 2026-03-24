// 角色权限检查中间件
export const roleCheckMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // 检查用户是否已认证
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证'
      })
    }
    
    // 检查用户角色是否在允许的角色列表中
    const userRole = req.user.role
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      })
    }
    
    next()
  }
}

// 管理员权限检查中间件
export const adminOnlyMiddleware = roleCheckMiddleware('admin')

// 注册用户权限检查中间件(包括管理员)
export const userOnlyMiddleware = roleCheckMiddleware('registered_user', 'admin')
