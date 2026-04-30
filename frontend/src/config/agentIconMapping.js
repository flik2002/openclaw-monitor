/**
 * 智能体类型与图标映射配置
 * 根据需求文档中的状态监控页面要求，为不同类型的智能体配置对应的图标
 */

import {
  // 通用图标
  Monitor,
  Tools,
  User,
  Document,
  Setting,
  ChatDotRound,
  DataAnalysis,
  VideoCamera,
  Picture,
  Files,
  DocumentCopy,
  Notification
} from '@element-plus/icons-vue'

/**
 * 智能体类型图标映射表
 * key: 智能体类型或名称
 * value: 对应的图标组件
 */
export const AGENT_ICON_MAP = {
  // 主智能体类型
  main: Monitor,
  master: Tools,
  primary: User,

  // 子智能体类型
  sub: ChatDotRound,
  worker: Tools,
  assistant: User,

  // 功能类型
  monitor: Monitor,
  data: DataAnalysis,
  chat: ChatDotRound,
  document: Document,
  setting: Setting,
  video: VideoCamera,
  image: Picture,
  file: Files,
  documentCopy: DocumentCopy,
  notification: Notification,

  // 特殊智能体名称映射
  '铁匠': Tools,
  '木匠': Tools,
  '石匠': Tools,
  '金匠': Tools,
  '织工': Files,
  '陶工': Setting,
  '厨师': User,
  '医生': Monitor,
  '老师': Document,
  '农民': Monitor,
  '商人': DataAnalysis,
  '士兵': VideoCamera
}

/**
 * 根据智能体类型或名称获取对应的图标组件
 * @param {string} agentType - 智能体类型
 * @param {string} agentName - 智能体名称
 * @returns {Component} 图标组件
 */
export function getAgentIcon(agentType, agentName) {
  // 优先使用智能体名称映射
  if (agentName && AGENT_ICON_MAP[agentName]) {
    return AGENT_ICON_MAP[agentName]
  }

  // 其次使用智能体类型映射
  if (agentType && AGENT_ICON_MAP[agentType]) {
    return AGENT_ICON_MAP[agentType]
  }

  // 默认使用监控图标
  return Monitor
}

/**
 * 获取智能体图标的颜色
 * @param {string} status - 智能体状态
 * @returns {string} 颜色值
 */
export function getAgentIconColor(status) {
  const colorMap = {
    idle: '#67c23a',      // 绿色 - 空闲
    working: '#e6a23c',   // 橙色 - 工作中
    offline: '#909399',   // 灰色 - 离线
    error: '#f56c6c',     // 红色 - 错误
    busy: '#e6a23c'       // 橙色 - 忙碌
  }

  return colorMap[status] || '#909399'
}

/**
 * 智能体类型显示名称映射
 */
export const AGENT_TYPE_NAMES = {
  main: '主智能体',
  sub: '子智能体',
  worker: '工作智能体',
  monitor: '监控智能体',
  data: '数据智能体',
  chat: '对话智能体',
  document: '文档智能体',
  setting: '配置智能体',
  video: '视频智能体',
  image: '图像智能体',
  file: '文件智能体',
  code: '代码智能体',
  notification: '通知智能体'
}

/**
 * 获取智能体类型的显示名称
 * @param {string} agentType - 智能体类型
 * @returns {string} 显示名称
 */
export function getAgentTypeName(agentType) {
  return AGENT_TYPE_NAMES[agentType] || '智能体'
}