import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// 生成 JWT Token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// 验证 JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// 解码 JWT Token (不验证)
export const decodeToken = (token) => {
  return jwt.decode(token)
}
