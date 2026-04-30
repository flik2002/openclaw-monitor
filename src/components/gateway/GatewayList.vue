<template>
  <div class="gateway-list">
    <div class="list-header">
      <h3>{{ t('monitor.boundAgents') }}</h3>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('gateway.bind') }}
      </el-button>
    </div>

    <el-table :data="gateways" style="width: 100%" v-loading="loading">
      <el-table-column prop="agentName" :label="t('gateway.agentName')" width="180" />
      <el-table-column prop="gatewayUrl" :label="t('gateway.gatewayUrl')" />
      <el-table-column prop="connectionStatus" :label="t('gateway.connectionStatus')" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.connectionStatus)">
            {{ getStatusText(row.connectionStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="boundAt" :label="t('monitor.boundTime')" width="180">
        <template #default="{ row }">
          {{ formatDate(row.boundAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('monitor.operation')" width="150">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleUnbind(row)">
            {{ t('gateway.unbind') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <BindWizard v-model="showBindWizard" @success="handleBindSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useGatewayStore } from '@/stores/gatewayStore'
import http from '@/utils/http'
import BindWizard from './BindWizard.vue'

const { t, locale } = useI18n()
const gatewayStore = useGatewayStore()

const gateways = ref([])
const loading = ref(false)
const showBindWizard = ref(false)

const fetchGateways = async () => {
  loading.value = true

  try {
    const response = await http.get('/api/gateway/list')

    if (response.success) {
      gateways.value = response.data
      gatewayStore.setGateways(response.data)

      // 将第一个 Gateway 的 Token 保存到 localStorage
      if (response.data.length > 0 && response.data[0].token) {
        localStorage.setItem('gatewayToken', response.data[0].token)
        console.log('Gateway Token loaded from backend and saved to localStorage')
      }
    }
  } catch (error) {
    console.error('Failed to fetch gateway list:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  showBindWizard.value = true
}

const handleBindSuccess = () => {
  fetchGateways()
}

const handleUnbind = async (gateway) => {
  try {
    await ElMessageBox.confirm(
      t('monitor.unbindConfirm', { name: gateway.agentName }),
      t('monitor.unbindTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    const response = await http.delete(`/api/gateway/unbind/${gateway.id}`)

    if (response.success) {
      ElMessage.success(t('monitor.unbindSuccess'))
      gatewayStore.removeGateway(gateway.id)
      fetchGateways()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Unbind failed:', error)
    }
  }
}

const getStatusType = (status) => {
  switch (status) {
    case 'running':
      return 'success'
    case 'offline':
      return 'danger'
    case 'busy':
      return 'warning'
    default:
      return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'running':
      return t('monitor.running')
    case 'offline':
      return t('monitor.offline')
    case 'busy':
      return t('monitor.busy')
    default:
      return t('common.unknown')
  }
}

const formatDate = (date) => {
  const loc = locale.value === 'zh-CN' ? 'zh-CN' : 'en-US'
  return new Date(date).toLocaleString(loc)
}

onMounted(() => {
  fetchGateways()
})
</script>

<style scoped>
.gateway-list {
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
</style>
