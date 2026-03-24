import express from 'express'
import GatewayService from '../services/GatewayService.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()

// 所有路由都需要认证
router.use(authMiddleware)

// POST /api/gateway/test - 测试Gateway连接
router.post('/test', async (req, res) => {
  try {
    const { gatewayUrl, token } = req.body
    
    if (!gatewayUrl || !token) {
      return res.status(400).json({
        success: false,
        message: 'Gateway地址和Token不能为空'
      })
    }
    
    const result = await GatewayService.testConnection(gatewayUrl, token)
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// POST /api/gateway/bind - 绑定Gateway
router.post('/bind', async (req, res) => {
  try {
    const { agentName, gatewayUrl, token } = req.body
    const userId = req.user.userId
    
    if (!agentName || !gatewayUrl || !token) {
      return res.status(400).json({
        success: false,
        message: '智能体名称、Gateway地址和Token不能为空'
      })
    }
    
    const result = await GatewayService.bindGateway(userId, agentName, gatewayUrl, token)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// GET /api/gateway/list - 获取Gateway列表
router.get('/list', async (req, res) => {
  try {
    const userId = req.user.userId
    const result = await GatewayService.getGatewayList(userId)
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// DELETE /api/gateway/unbind/:id - 解绑Gateway
router.delete('/unbind/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    
    const result = await GatewayService.unbindGateway(userId, id)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

export default router
