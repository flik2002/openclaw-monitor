import express from 'express'
import AnnouncementService from '../services/AnnouncementService.js'
import { authMiddleware } from '../middlewares/auth.js'
import { adminOnlyMiddleware } from '../middlewares/roleCheck.js'

const router = express.Router()

// GET /api/announcement/list - 获取公告列表(公开)
router.get('/list', async (req, res) => {
  try {
    const result = await AnnouncementService.getValidAnnouncements()
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

// POST /api/announcement/create - 创建公告(管理员)
router.post('/create', async (req, res) => {
  try {
    const { content, priority, scrollSpeed, effectiveTime, expiryTime } = req.body
    
    const result = await AnnouncementService.createAnnouncement(content, priority, scrollSpeed, effectiveTime, expiryTime)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// PUT /api/announcement/update/:id - 更新公告(管理员)
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    
    const result = await AnnouncementService.updateAnnouncement(id, updates)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// DELETE /api/announcement/delete/:id - 删除公告(管理员)
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await AnnouncementService.deleteAnnouncement(id)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

export default router
