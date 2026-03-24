import express from 'express'
import AdvertisementService from '../services/AdvertisementService.js'
import { authMiddleware } from '../middlewares/auth.js'
import { adminOnlyMiddleware } from '../middlewares/roleCheck.js'

const router = express.Router()

// GET /api/ad/list - 获取广告列表(公开)
router.get('/list', async (req, res) => {
  try {
    const result = await AdvertisementService.getValidAdvertisements()
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 以下路由需要管理员权限
router.use(authMiddleware)
router.use(adminOnlyMiddleware)

// POST /api/ad/create - 创建广告(管理员)
router.post('/create', async (req, res) => {
  try {
    const { position, contentType, content, link, width, height, effectiveTime, expiryTime } = req.body
    
    const result = await AdvertisementService.createAdvertisement(position, contentType, content, link, width, height, effectiveTime, expiryTime)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// PUT /api/ad/update/:id - 更新广告(管理员)
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    
    const result = await AdvertisementService.updateAdvertisement(id, updates)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// DELETE /api/ad/delete/:id - 删除广告(管理员)
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await AdvertisementService.deleteAdvertisement(id)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

export default router
