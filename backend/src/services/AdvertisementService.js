import { v4 as uuidv4 } from 'uuid'
import AdvertisementRepository from '../repositories/AdvertisementRepository.js'

class AdvertisementService {
  // 创建广告
  async createAdvertisement(position, contentType, content, link, width, height, effectiveTime, expiryTime) {
    if (!position || !contentType || !content || !width || !height) {
      throw new Error('广告位置、内容类型、内容、宽度和高度不能为空')
    }
    
    const advertisement = {
      id: uuidv4(),
      position,
      content_type: contentType,
      content,
      link: link || null,
      width,
      height,
      effective_at: effectiveTime || new Date().toISOString(),
      expiry_at: expiryTime,
      created_at: new Date().toISOString()
    }
    
    await AdvertisementRepository.create(advertisement)
    
    return {
      success: true,
      message: '广告创建成功',
      data: advertisement
    }
  }

  // 获取有效广告列表(过滤过期广告)
  async getValidAdvertisements() {
    const advertisements = await AdvertisementRepository.findValid()
    
    return {
      success: true,
      data: advertisements
    }
  }

  // 获取所有广告列表
  async getAllAdvertisements() {
    const advertisements = await AdvertisementRepository.findAll()
    
    return {
      success: true,
      data: advertisements
    }
  }

  // 更新广告
  async updateAdvertisement(id, updates) {
    const advertisement = await AdvertisementRepository.findById(id)
    
    if (!advertisement) {
      throw new Error('广告不存在')
    }
    
    const updated = await AdvertisementRepository.update(id, updates)
    
    if (!updated) {
      throw new Error('广告更新失败')
    }
    
    return {
      success: true,
      message: '广告更新成功'
    }
  }

  // 删除广告
  async deleteAdvertisement(id) {
    const advertisement = await AdvertisementRepository.findById(id)
    
    if (!advertisement) {
      throw new Error('广告不存在')
    }
    
    const deleted = await AdvertisementRepository.delete(id)
    
    if (!deleted) {
      throw new Error('广告删除失败')
    }
    
    return {
      success: true,
      message: '广告删除成功'
    }
  }
}

export default new AdvertisementService()
