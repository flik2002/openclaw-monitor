<template>
  <div class="status-cards">
    <!-- 运行状态卡片 -->
    <StatusCard title="运行状态">
      <div class="status-indicator">
        <span class="status-dot" :class="`status-${status.gateway?.status}`"></span>
        <span class="status-text">{{ getStatusText(status.gateway?.status) }}</span>
      </div>
    </StatusCard>

    <!-- 会话数卡片 -->
    <StatusCard title="会话数">
      <div class="metric-value">
        {{ status.metrics?.sessions || 0 }}
        <span v-if="status.metrics?.sessionsTrend" class="trend" :class="status.metrics.sessionsTrend > 0 ? 'trend-up' : 'trend-down'">
          {{ status.metrics.sessionsTrend > 0 ? '↑' : '↓' }}{{ Math.abs(status.metrics.sessionsTrend) }}%
        </span>
      </div>
    </StatusCard>

    <!-- Token使用卡片 -->
    <StatusCard title="Token使用">
      <div class="token-usage">
        <el-progress
          :percentage="tokenPercentage"
          :color="tokenColor"
          :stroke-width="10"
        />
        <div class="token-text">
          {{ formatNumber(status.metrics?.tokenUsed || 0) }} / {{ formatNumber(status.metrics?.tokenTotal || 0) }}
        </div>
      </div>
    </StatusCard>

    <!-- 在线时长卡片 -->
    <StatusCard title="在线时长">
      <div class="online-time">
        {{ status.metrics?.onlineTime || '0h 0m' }}
      </div>
    </StatusCard>

    <!-- 内存占用卡片 -->
    <StatusCard title="内存占用">
      <div class="memory-usage">
        {{ status.metrics?.memoryUsed || 0 }} MB
        <el-tag :type="getMemoryStatus(status.metrics?.memoryStatus)" size="small">
          {{ status.metrics?.memoryStatus || '正常' }}
        </el-tag>
      </div>
    </StatusCard>

    <!-- 消息统计卡片 -->
    <StatusCard title="消息统计">
      <div class="message-count">
        {{ formatNumber(status.metrics?.messageCount || 0) }}
        <span v-if="status.metrics?.messageNew" class="new-messages">
          (+{{ status.metrics.messageNew }})
        </span>
      </div>
    </StatusCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusCard from './StatusCard.vue'

const props = defineProps({
  status: {
    type: Object,
    default: () => ({})
  }
})

const tokenPercentage = computed(() => {
  const used = props.status.metrics?.tokenUsed || 0
  const total = props.status.metrics?.tokenTotal || 1
  return Math.round((used / total) * 100)
})

const tokenColor = computed(() => {
  const percentage = tokenPercentage.value
  if (percentage < 60) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
})

const getStatusText = (status) => {
  switch (status) {
    case 'running': return '运行中'
    case 'offline': return '离线'
    case 'busy': return '忙碌'
    default: return '未知'
  }
}

const getMemoryStatus = (status) => {
  switch (status) {
    case 'normal': return 'success'
    case 'warning': return 'warning'
    case 'critical': return 'danger'
    default: return 'info'
  }
}

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style scoped>
.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-running {
  background: #67c23a;
}

.status-offline {
  background: #909399;
}

.status-busy {
  background: #e6a23c;
}

.status-text {
  font-size: 16px;
}

.metric-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trend {
  font-size: 14px;
  font-weight: normal;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.token-usage {
  width: 100%;
}

.token-text {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.online-time {
  font-size: 20px;
}

.memory-usage {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
}

.message-count {
  display: flex;
  align-items: center;
  gap: 10px;
}

.new-messages {
  font-size: 14px;
  color: #67c23a;
  font-weight: normal;
}
</style>
