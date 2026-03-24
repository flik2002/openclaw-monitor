<template>
  <div class="task-list">
    <h3>任务列表</h3>
    <el-table :data="tasks" style="width: 100%">
      <el-table-column prop="id" label="任务ID" width="120" />
      <el-table-column prop="name" label="任务名称" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="进度" width="150">
        <template #default="{ row }">
          <el-progress :percentage="row.progress" :stroke-width="6" />
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template #default="{ row }">
          {{ formatDate(row.endTime) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
defineProps({
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
    case 'running': return '运行中'
    case 'completed': return '已完成'
    case 'failed': return '失败'
    case 'pending': return '等待中'
    default: return '未知'
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<style scoped>
.task-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.task-list h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}
</style>
