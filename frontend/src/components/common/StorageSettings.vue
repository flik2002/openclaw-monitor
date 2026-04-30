<template>
  <el-dialog
    v-model="visible"
    :title="t('storage.settings')"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form :model="settings" label-width="120px">
      <el-form-item :label="t('storage.retention')">
        <el-radio-group v-model="settings.retention">
          <el-radio label="7">{{ t('storage.days7') }}</el-radio>
          <el-radio label="30">{{ t('storage.days30') }}</el-radio>
          <el-radio label="90">{{ t('storage.days90') }}</el-radio>
          <el-radio label="forever">{{ t('storage.forever') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('storage.currentUsage')">
        <div class="storage-info">
          <el-progress :percentage="storageUsage.percentage" :color="storageUsage.color" />
          <div class="storage-details">
            <span>{{ storageUsage.used }} / {{ storageUsage.total }}</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item :label="t('storage.dataOperation')">
        <div class="action-buttons">
          <el-button type="primary" @click="handleExport">
            <el-icon><Download /></el-icon>
            {{ t('storage.exportData') }}
          </el-button>
          <el-button type="danger" @click="handleClear">
            <el-icon><Delete /></el-icon>
            {{ t('storage.clearAll') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ t('common.save') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Download, Delete } from '@element-plus/icons-vue'
import { useStorageStore } from '@/stores/storageStore'

const { t } = useI18n()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
const storageStore = useStorageStore()

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  console.log('StorageSettings props.modelValue changed:', newValue)
  visible.value = newValue
})

// 监听visible变化
watch(visible, (newValue) => {
  console.log('StorageSettings visible changed:', newValue)
  emit('update:modelValue', newValue)
})

const settings = reactive({
  retention: '30'
})

// 计算存储使用情况
const storageUsage = computed(() => {
  const used = storageStore.getStorageUsed()
  const total = storageStore.getStorageTotal()
  const percentage = used > 0 ? Math.round((used / total) * 100) : 0

  let color = '#67C23A'
  if (percentage > 50) color = '#E6A23C'
  if (percentage > 80) color = '#F56C6C'

  return {
    used: formatBytes(used),
    total: formatBytes(total),
    percentage,
    color
  }
})

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleExport = async () => {
  try {
    const data = await storageStore.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `openclaw-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success(t('storage.exportSuccessMsg'))
  } catch (error) {
    ElMessage.error(t('storage.exportFailedMsg'))
  }
}

const handleClear = async () => {
  try {
    await ElMessageBox.confirm(
      t('storage.clearConfirmMsg'),
      t('storage.clearTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    storageStore.clearAll()
    ElMessage.success(t('storage.clearSuccessMsg'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('storage.clearFailedMsg'))
    }
  }
}

const handleSave = () => {
  storageStore.setRetention(settings.retention)
  ElMessage.success(t('storage.saveSuccessMsg'))
  handleClose()
}

const handleClose = () => {
  visible.value = false
}

onMounted(() => {
  settings.retention = storageStore.getRetention()
})
</script>

<style scoped>
.storage-info {
  width: 100%;
}

.storage-details {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-buttons .el-button {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
