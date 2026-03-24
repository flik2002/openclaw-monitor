<template>
  <div class="gateway-list">
    <div class="list-header">
      <h3>已绑定的 Gateway</h3>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加 Gateway
      </el-button>
    </div>

    <el-table :data="gateways" style="width: 100%" v-loading="loading">
      <el-table-column prop="agentName" label="智能体名称" width="180" />
      <el-table-column prop="gatewayUrl" label="Gateway地址" />
      <el-table-column prop="connectionStatus" label="连接状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.connectionStatus)">
            {{ getStatusText(row.connectionStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="boundAt" label="绑定时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.boundAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleUnbind(row)">
            解绑
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
import { useGatewayStore } from '@/stores/gatewayStore'
import http from '@/utils/http'
import BindWizard from './BindWizard.vue'

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
    }
  } catch (error) {
    console.error('获取Gateway列表失败:', error)
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
      `确定要解绑 "${gateway.agentName}" 吗?`,
      '确认解绑',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await http.delete(`/api/gateway/unbind/${gateway.id}`)

    if (response.success) {
      ElMessage.success('解绑成功')
      gatewayStore.removeGateway(gateway.id)
      fetchGateways()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('解绑失败:', error)
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
      return '运行中'
    case 'offline':
      return '离线'
    case 'busy':
      return '忙碌'
    default:
      return '未知'
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
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
