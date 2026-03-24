import express from 'express'
import AuthService from '../services/AuthService.js'

const router = express.Router()

// POST /api/auth/send-verification - 发送验证码
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱不能为空'
      })
    }
    
    const result = await AuthService.sendVerificationCode(email)
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// POST /api/auth/register - 用户注册
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, verificationCode } = req.body
    
    if (!email || !password || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: '邮箱、密码和验证码不能为空'
      })
    }
    
    const result = await AuthService.register(email, phone, password, verificationCode)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// POST /api/auth/login - 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      })
    }
    
    const result = await AuthService.login(email, password)
    res.json(result)
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
})

// GET /api/auth/verify - 验证Token
router.get('/verify', async (req, res) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未认证'
      })
    }
    
    const result = await AuthService.verifyToken(userId)
    res.json(result)
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
})

export default router
