<template>
  <div class="empty-state">
    <div class="empty-content">
      <el-icon class="empty-icon" :size="80">
        <Monitor />
      </el-icon>
      <h2 class="empty-title">{{ t('emptyState.welcome') }}</h2>
      <p class="empty-description">
        {{ t('emptyState.description') }}
      </p>
      <el-button type="primary" size="large" @click="handleBind">
        <el-icon><Plus /></el-icon>
        {{ t('emptyState.bindNow') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Monitor, Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['bind'])

const handleBind = () => {
  console.log('EmptyState handleBind called')
  emit('bind')
  console.log('bind event emitted')
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
