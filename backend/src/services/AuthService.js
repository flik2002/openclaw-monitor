import { v4 as uuidv4 } from 'uuid'
import UserRepository from '../repositories/UserRepository.js'
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'
import { sendVerificationCode } from '../utils/email.js'

// 验证码缓存(生产环境应使用Redis)
const verificationCodes = new Map()

class AuthService {
  // 发送验证码
  async sendVerificationCode(email) {
    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 缓存验证码(5分钟有效期)
    verificationCodes.set(email, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000
    })
    
    // 发送邮件
    const result = await sendVerificationCode(email, code)
    
    if (!result.success) {
      throw new Error('验证码发送失败: ' + result.error)
    }
    
    return { success: true, message: '验证码已发送' }
  }

  // 用户注册
  async register(email, phone, password, verificationCode) {
    // 验证验证码
    const cachedCode = verificationCodes.get(email)
    
    if (!cachedCode) {
      throw new Error('验证码未发送或已过期')
    }
    
    if (Date.now() > cachedCode.expiresAt) {
      verificationCodes.delete(email)
      throw new Error('验证码已过期')
    }
    
    if (cachedCode.code !== verificationCode) {
      throw new Error('验证码错误')
    }
    
    // 验证密码强度
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message)
    }
    
    // 检查邮箱是否已注册
    const existingUser = await UserRepository.findByEmail(email)
    if (existingUser) {
      throw new Error('该邮箱已注册')
    }
    
    // 哈希密码
    const passwordHash = await hashPassword(password)
    
    // 创建用户
    const userId = uuidv4()
    const now = new Date().toISOString()
    
    const user = {
      id: userId,
      email,
      phone: phone || null,
      password_hash: passwordHash,
      role: 'registered_user',
      created_at: now,
      last_login_at: now
    }
    
    await UserRepository.create(user)
    
    // 删除验证码
    verificationCodes.delete(email)
    
    // 生成JWT Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })
    
    return {
      success: true,
      message: '注册成功',
      data: {
        userId: user.id,
        token
      }
    }
  }

  // 用户登录
  async login(email, password) {
    // 查找用户
    const user = await UserRepository.findByEmail(email)
    
    if (!user) {
      throw new Error('邮箱或密码错误')
    }
    
    // 验证密码
    const isValid = await verifyPassword(password, user.password_hash)
    
    if (!isValid) {
      throw new Error('邮箱或密码错误')
    }
    
    // 更新最后登录时间
    const now = new Date().toISOString()
    await UserRepository.update(user.id, { last_login_at: now })
    
    // 生成JWT Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })
    
    return {
      success: true,
      message: '登录成功',
      data: {
        userId: user.id,
        token,
        role: user.role
      }
    }
  }

  // 验证Token
  async verifyToken(userId) {
    const user = await UserRepository.findById(userId)
    
    if (!user) {
      throw new Error('用户不存在')
    }
    
    return {
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        role: user.role
      }
    }
  }
}

export default new AuthService()
