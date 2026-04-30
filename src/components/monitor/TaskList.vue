<template>
  <div class="task-section">
    <h3>{{ t('monitor.taskList') }}</h3>
    
    <!-- 任务列表 -->
    <div class="task-list">
      <div v-for="(task, index) in tasks" :key="index" class="task-item">
        <div class="task-header">
          <span class="task-name">{{ task.name || t('monitor.unknownTask') }}</span>
          <el-tag :type="getStatusType(task.status)" size="small">
            {{ getStatusText(task.status) }}
          </el-tag>
        </div>
        <div class="task-time">
          <span class="time-label">{{ t('monitor.startTime') }}</span>
          <span class="time-value">{{ formatDate(task.startedAt) }}</span>
          <span class="time-label" style="margin-left: 12px;">{{ t('monitor.endTime') }}</span>
          <span class="time-value">{{ task.finishedAt ? formatDate(task.finishedAt) : t('monitor.inProgress') }}</span>
        </div>
      </div>
      
      <div v-if="!tasks || tasks.length === 0" class="empty-message">
        {{ t('monitor.noTasks') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const getStatusType = (status) => {
  switch (status) {
    case 'running': return 'warning'
    case 'completed': return 'success'
    case 'failed': return 'danger'
    case 'pending': return 'info'
    default: return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'running': return t('monitor.running')
    case 'completed': return t('monitor.completed')
    case 'failed': return t('monitor.failed')
    case 'pending': return t('monitor.pending')
    default: return t('common.unknown')
  }
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
.task-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.task-section h3 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.task-list {
  flex: 1;
  overflow: hidden;
}

.task-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.task-item:last-child {
  border-bottom: none;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.task-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
}

.time-label {
  color: #999;
}

.time-value {
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
