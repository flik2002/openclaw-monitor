import { v4 as uuidv4 } from 'uuid'
import AnnouncementRepository from '../repositories/AnnouncementRepository.js'

class AnnouncementService {
  // 创建公告
  async createAnnouncement(content, priority, scrollSpeed, effectiveTime, expiryTime) {
    if (!content) {
      throw new Error('公告内容不能为空')
    }
    
    const announcement = {
      id: uuidv4(),
      content,
      priority: priority || 'medium',
      scroll_speed: scrollSpeed || 'medium',
      effective_at: effectiveTime || new Date().toISOString(),
      expiry_at: expiryTime,
      created_at: new Date().toISOString()
    }
    
    await AnnouncementRepository.create(announcement)
    
    return {
      success: true,
      message: '公告创建成功',
      data: announcement
    }
  }

  // 获取有效公告列表(过滤过期公告)
  async getValidAnnouncements() {
    const announcements = await AnnouncementRepository.findValid()
    
    return {
      success: true,
      data: announcements
    }
  }

  // 获取所有公告列表
  async getAllAnnouncements() {
    const announcements = await AnnouncementRepository.findAll()
    
    return {
      success: true,
      data: announcements
    }
  }

  // 更新公告
  async updateAnnouncement(id, updates) {
    const announcement = await AnnouncementRepository.findById(id)
    
    if (!announcement) {
      throw new Error('公告不存在')
    }
    
    const updated = await AnnouncementRepository.update(id, updates)
    
    if (!updated) {
      throw new Error('公告更新失败')
    }
    
    return {
      success: true,
      message: '公告更新成功'
    }
  }

  // 删除公告
  async deleteAnnouncement(id) {
    const announcement = await AnnouncementRepository.findById(id)
    
    if (!announcement) {
      throw new Error('公告不存在')
    }
    
    const deleted = await AnnouncementRepository.delete(id)
    
    if (!deleted) {
      throw new Error('公告删除失败')
    }
    
    return {
      success: true,
      message: '公告删除成功'
    }
  }
}

export default new AnnouncementService()
