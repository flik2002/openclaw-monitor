<template>
  <div class="channel-list">
    <h3>渠道状态</h3>
    <el-table :data="channels" style="width: 100%">
      <el-table-column prop="name" label="渠道名称" width="120" />
      <el-table-column prop="status" label="连接状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息统计" width="120">
        <template #default="{ row }">
          {{ formatNumber(row.messageCount || 0) }}
        </template>
      </el-table-column>
      <el-table-column prop="lastActiveTime" label="最后活跃时间">
        <template #default="{ row }">
          {{ formatDate(row.lastActiveTime) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
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
    case 'connected': return '已连接'
    case 'disconnected': return '断开'
    case 'error': return '异常'
    case 'not_configured': return '未配置'
    default: return '未知'
  }
}

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<style scoped>
.channel-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.channel-list h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}
</style>
