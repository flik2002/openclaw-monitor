<template>
  <el-dialog
    v-model="visible"
    title="绑定 Gateway"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-steps :active="currentStep" finish-status="success" simple>
      <el-step title="填写配置" />
      <el-step title="测试连接" />
      <el-step title="完成绑定" />
    </el-steps>

    <div class="step-content">
      <!-- 步骤1: 填写配置 -->
      <div v-show="currentStep === 0" class="step-form">
        <el-form ref="configFormRef" :model="configForm" :rules="configRules" label-width="120px">
          <el-form-item label="智能体名称" prop="agentName">
            <el-input v-model="configForm.agentName" placeholder="请输入智能体名称" />
          </el-form-item>
          <el-form-item label="Gateway地址" prop="gatewayUrl">
            <el-input v-model="configForm.gatewayUrl" placeholder="https://gateway.example.com" />
          </el-form-item>
          <el-form-item label="Token" prop="token">
            <el-input v-model="configForm.token" type="password" placeholder="请输入Token" show-password />
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤2: 测试连接 -->
      <div v-show="currentStep === 1" class="step-test">
        <ConnectionTest
          :gateway-url="configForm.gatewayUrl"
          :token="configForm.token"
          @success="handleTestSuccess"
          @fail="handleTestFail"
        />
      </div>

      <!-- 步骤3: 完成绑定 -->
      <div v-show="currentStep === 2" class="step-complete">
        <el-result
          v-if="bindSuccess"
          icon="success"
          title="绑定成功"
          :sub-title="`已发现 ${discoveredAgents.length} 个智能体`"
        >
          <template #extra>
            <div class="agent-list">
              <el-tag v-for="agent in discoveredAgents" :key="agent.id" type="success" class="agent-tag">
                {{ agent.name }}
              </el-tag>
            </div>
          </template>
        </el-result>
        <el-result v-else icon="error" title="绑定失败" :sub-title="bindError" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button v-if="currentStep < 2" type="primary" :loading="loading" @click="nextStep">
          下一步
        </el-button>
        <el-button v-if="currentStep === 2" type="primary" @click="handleClose">
          完成
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useGatewayStore } from '@/stores/gatewayStore'
import { useAgentStore } from '@/stores/agentStore'
import http from '@/utils/http'
import ConnectionTest from './ConnectionTest.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const currentStep = ref(0)
const loading = ref(false)
const bindSuccess = ref(false)
const bindError = ref('')
const discoveredAgents = ref([])

const gatewayStore = useGatewayStore()
const agentStore = useAgentStore()

const configFormRef = ref(null)
const configForm = reactive({
  agentName: '',
  gatewayUrl: '',
  token: ''
})

const configRules = {
  agentName: [
    { required: true, message: '请输入智能体名称', trigger: 'blur' }
  ],
  gatewayUrl: [
    { required: true, message: '请输入Gateway地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  token: [
    { required: true, message: '请输入Token', trigger: 'blur' }
  ]
}

const testResult = ref(null)

const nextStep = async () => {
  if (currentStep.value === 0) {
    // 验证表单
    if (!configFormRef.value) return
    await configFormRef.value.validate((valid) => {
      if (valid) {
        currentStep.value = 1
      }
    })
  } else if (currentStep.value === 1) {
    // 执行绑定
    await handleBind()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleTestSuccess = (result) => {
  testResult.value = result
}

const handleTestFail = () => {
  testResult.value = null
}

const handleBind = async () => {
  loading.value = true

  try {
    const response = await http.post('/api/gateway/bind', {
      agentName: configForm.agentName,
      gatewayUrl: configForm.gatewayUrl,
      token: configForm.token
    })

    if (response.success) {
      bindSuccess.value = true
      discoveredAgents.value = response.data.agents

      // 更新Store
      gatewayStore.addGateway({
        id: response.data.gatewayId,
        agentName: configForm.agentName,
        gatewayUrl: configForm.gatewayUrl,
        connectionStatus: 'running'
      })

      // 添加智能体到Store
      response.data.agents.forEach(agent => {
        agentStore.addAgent(agent)
      })

      currentStep.value = 2
      emit('success')
    }
  } catch (error) {
    bindSuccess.value = false
    bindError.value = error.response?.data?.message || '绑定失败'
    currentStep.value = 2
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
  currentStep.value = 0
  bindSuccess.value = false
  bindError.value = ''
  discoveredAgents.value = []
  configForm.agentName = ''
  configForm.gatewayUrl = ''
  configForm.token = ''
}
</script>

<style scoped>
.step-content {
  margin-top: 20px;
  min-height: 200px;
}

.step-form {
  padding: 20px 0;
}

.step-test {
  padding: 20px 0;
}

.step-complete {
  padding: 20px 0;
}

.agent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.agent-tag {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
