<template>
  <div class="channel-section">
    <h3>{{ t('monitor.channelStatus') }}</h3>
    
    <!-- 渠道列表 -->
    <div class="channel-list">
      <div v-for="(channel, index) in channels" :key="index" class="channel-item">
        <div class="channel-info">
          <span class="channel-name">{{ getChannelName(channel.name) }}</span>
          <el-tag :type="getStatusType(channel.status)" size="small">
            {{ getStatusText(channel.status) }}
          </el-tag>
        </div>
        <div class="channel-stats">
          <span class="stat-label">{{ t('monitor.messageColon') }}</span>
          <span class="stat-value">{{ formatNumber(channel.messageCount || 0) }}</span>
          <span class="stat-label" style="margin-left: 12px;">{{ t('monitor.activeColon') }}</span>
          <span class="stat-value">{{ formatDate(channel.lastActiveAt) }}</span>
        </div>
      </div>
      
      <div v-if="!channels || channels.length === 0" class="empty-message">
        {{ t('monitor.noChannelData') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

defineProps({
  channels: {
    type: Array,
    default: () => []
  }
})

const getStatusType = (status) => {
  switch (status) {
    case 'connected': return 'success'
    case 'disconnected': return 'danger'
    case 'error': return 'warning'
    case 'not_configured': return 'info'
    default: return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'connected': return t('monitor.connected')
    case 'disconnected': return t('monitor.disconnected')
    case 'error': return t('monitor.abnormal')
    case 'not_configured': return t('monitor.notConfigured')
    default: return t('common.unknown')
  }
}

const getChannelName = (name) => {
  if (name === 'unknown') {
    return t('monitor.mainSession')
  }
  return name
}

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (date) => {
  if (!date) return '-'
  const loc = locale.value === 'zh-CN' ? 'zh-CN' : 'en-US'
  return new Date(date).toLocaleString(loc, { 
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.channel-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.channel-section h3 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.channel-list {
  flex: 1;
  overflow: hidden;
}

.channel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.channel-item:last-child {
  border-bottom: none;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 80px;
}

.channel-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.stat-label {
  color: #999;
}

.stat-value {
  color: #666;
  font-weight: 500;
}

.empty-message {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 40px 0;
}
</style>
