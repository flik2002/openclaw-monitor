<template>
  <div class="empty-state">
    <div class="empty-content">
      <el-icon class="empty-icon" :size="80">
        <Monitor />
      </el-icon>
      <h2 class="empty-title">欢迎使用 OpenClaw 监控系统</h2>
      <p class="empty-description">
        您还没有绑定任何 Gateway,请先绑定您的 OpenClaw Gateway 以开始监控智能体状态
      </p>
      <el-button type="primary" size="large" @click="handleBind">
        <el-icon><Plus /></el-icon>
        立即绑定 Gateway
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Monitor, Plus } from '@element-plus/icons-vue'

const emit = defineEmits(['bind'])

const handleBind = () => {
  emit('bind')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

.empty-content {
  text-align: center;
  max-width: 500px;
}

.empty-icon {
  color: #28C78E;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.empty-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}
</style>
