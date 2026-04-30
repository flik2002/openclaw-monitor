<template>
  <el-dialog
    v-model="visible"
    :title="t('agent.multiManage')"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="multi-agent-container">
      <!-- Agent标签页列表 -->
      <div class="agent-tabs">
        <div
          v-for="agent in agents"
          :key="agent.id"
          :class="['agent-tab', { 'active': agent.id === selectedAgentId }]"
          @click="selectAgent(agent.id)"
        >
          <span class="agent-name">{{ agent.name }}</span>
          <el-icon
            v-if="agent.id !== selectedAgentId && agents.length > 1"
            class="close-icon"
            @click.stop="removeAgent(agent.id)"
          >
            <Close />
          </el-icon>
        </div>

        <!-- 添加Agent按钮 -->
        <div class="add-agent-tab" @click="showAddAgent = true">
          <el-icon><Plus /></el-icon>
          <span>{{ t('monitor.addAgent') }}</span>
        </div>
      </div>

      <!-- Agent详情 -->
      <div class="agent-details" v-if="selectedAgent">
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="t('monitor.agentNameLabel')">
            {{ selectedAgent.name }}
          </el-descriptions-item>
          <el-descriptions-item label="Gateway URL">
            {{ selectedAgent.gatewayUrl }}
          </el-descriptions-item>
          <el-descriptions-item label="Token">
            {{ maskToken(selectedAgent.token) }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('monitor.boundTime')">
            {{ formatDate(selectedAgent.bindTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('monitor.status')">
            <el-tag :type="selectedAgent.connected ? 'success' : 'danger'">
              {{ selectedAgent.connected ? t('monitor.connected') : t('monitor.notConnected') }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('monitor.sessions')">
            {{ selectedAgent.sessionCount || 0 }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('monitor.messageCount')">
            {{ selectedAgent.messageCount || 0 }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 操作按钮 -->
        <div class="agent-actions">
          <el-button type="primary" @click="testConnection(selectedAgent)">
            <el-icon><Connection /></el-icon>
            {{ t('gateway.testConnection') }}
          </el-button>
          <el-button @click="editAgent(selectedAgent)">
            <el-icon><Edit /></el-icon>
            {{ t('common.edit') }}
          </el-button>
          <el-button
            type="danger"
            @click="removeAgent(selectedAgent.id)"
            :disabled="agents.length <= 1"
          >
            <el-icon><Delete /></el-icon>
            {{ t('common.delete') }}
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('monitor.close') }}</el-button>
      </div>
    </template>

    <!-- 添加Agent对话框 -->
    <el-dialog
      v-model="showAddAgent"
      :title="t('monitor.addNewAgent')"
      width="600px"
      append-to-body
    >
      <el-form :model="newAgent" :rules="agentRules" ref="agentFormRef" label-width="120px">
        <el-form-item :label="t('monitor.agentNameLabel')" prop="name">
          <el-input v-model="newAgent.name" :placeholder="t('gateway.inputAgentName')" />
        </el-form-item>
        <el-form-item label="Gateway URL" prop="gatewayUrl">
          <el-input v-model="newAgent.gatewayUrl" placeholder="http://127.0.0.1:端口号 或 http://远程IP:端口号" />
        </el-form-item>
        <el-form-item label="Token" prop="token">
          <el-input v-model="newAgent.token" type="password" :placeholder="t('gateway.inputToken')" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddAgent = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" @click="addAgent">{{ t('common.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Close, Connection, Edit, Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'switch'])

const visible = ref(props.modelValue)
const showAddAgent = ref(false)
const selectedAgentId = ref(null)

// Agent列表
const agents = ref([
  {
    id: 1,
    name: 'Main Agent',
    gatewayUrl: '', // 用户需要输入网关地址
    token: '331cc2a54bda0d335ec263864c68e9a0ed37547408184ba3',
    connected: true,
    bindTime: new Date(),
    sessionCount: 0,
    messageCount: 0
  }
])

// 新Agent表单
const newAgent = reactive({
  name: '',
  gatewayUrl: '',
  token: ''
})

const agentRules = computed(() => ({
  name: [{ required: true, message: t('gateway.agentNameRequired'), trigger: 'blur' }],
  gatewayUrl: [{ required: true, message: t('gateway.gatewayUrlRequired'), trigger: 'blur' }],
  token: [{ required: true, message: t('gateway.tokenRequired'), trigger: 'blur' }]
}))

const agentFormRef = ref(null)

// 选中的Agent
const selectedAgent = computed(() => {
  return agents.value.find(agent => agent.id === selectedAgentId.value)
})

const selectAgent = (agentId) => {
  selectedAgentId.value = agentId
  emit('switch', agentId)
}

const removeAgent = async (agentId) => {
  try {
    await ElMessageBox.confirm(
      t('monitor.deleteAgentConfirm'),
      t('monitor.deleteTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    agents.value = agents.value.filter(agent => agent.id !== agentId)

    // 如果删除的是当前选中的Agent，选中第一个
    if (selectedAgentId.value === agentId) {
      selectedAgentId.value = agents.value[0]?.id || null
    }

    ElMessage.success(t('monitor.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('monitor.deleteFailed'))
    }
  }
}

const testConnection = (agent) => {
  ElMessage.info(t('monitor.testConnectionDev'))
}

const editAgent = (agent) => {
  ElMessage.info(t('monitor.editDev'))
}

const addAgent = () => {
  agentFormRef.value.validate((valid) => {
    if (valid) {
      agents.value.push({
        id: Date.now(),
        name: newAgent.name,
        gatewayUrl: newAgent.gatewayUrl,
        token: newAgent.token,
        connected: false,
        bindTime: new Date(),
        sessionCount: 0,
        messageCount: 0
      })

      showAddAgent.value = false
      ElMessage.success(t('monitor.addSuccess'))

      // 选中新添加的Agent
      selectedAgentId.value = agents.value[agents.value.length - 1].id

      // 重置表单
      newAgent.name = ''
      newAgent.gatewayUrl = ''
      newAgent.token = ''
    }
  })
}

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}

const maskToken = (token) => {
  if (!token) return ''
  return token.substring(0, 8) + '...' + token.substring(token.length - 8)
}

const formatDate = (date) => {
  if (!date) return ''
  const loc = locale.value === 'zh-CN' ? 'zh-CN' : 'en-US'
  return new Date(date).toLocaleString(loc)
}

// 初始化选中第一个Agent
if (agents.value.length > 0) {
  selectedAgentId.value = agents.value[0].id
}
</script>

<style scoped>
.multi-agent-container {
  min-height: 400px;
}

.agent-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e8e8e8;
  padding-bottom: 0;
  overflow-x: auto;
}

.agent-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.agent-tab.active {
  background: #fff;
  border-color: #409eff;
  border-bottom: 1px solid #fff;
  margin-bottom: -2px;
}

.agent-tab:hover {
  background: #e6f7ff;
}

.agent-name {
  font-size: 14px;
  color: #333;
}

.close-icon {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
}

.close-icon:hover {
  background: #ff4d4f;
  color: #fff;
}

.add-agent-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  background: #f0faf6;
  border: 1px dashed #52c41a;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  color: #52c41a;
  transition: all 0.3s;
}

.add-agent-tab:hover {
  background: #d9f7be;
}

.agent-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.agent-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
