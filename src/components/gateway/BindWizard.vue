<template>
  <el-dialog
    v-model="visible"
    :title="t('gateway.bind')"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
    @open="handleOpen"
  >
    <el-steps :active="currentStep" finish-status="success" simple>
      <el-step :title="t('gateway.step1')" />
      <el-step :title="t('gateway.step2')" />
      <el-step :title="t('gateway.step3')" />
    </el-steps>

    <div class="step-content">
      <!-- 步骤1: 填写配置 -->
      <div v-show="currentStep === 0" class="step-form">
        <el-form ref="configFormRef" :model="configForm" :rules="configRules" label-width="120px">
          <el-form-item :label="t('gateway.agentName')" prop="agentName">
            <el-input v-model="configForm.agentName" :placeholder="t('gateway.inputAgentName')" />
          </el-form-item>
          <el-form-item :label="t('gateway.gatewayUrl')" prop="gatewayUrl">
            <el-input v-model="configForm.gatewayUrl" :placeholder="t('gateway.inputGatewayUrl')" />
          </el-form-item>
          <el-form-item :label="t('gateway.token')" prop="token">
            <el-input v-model="configForm.token" type="password" :placeholder="t('gateway.inputToken')" show-password />
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
          :title="t('gateway.bindSuccess')"
          :sub-title="`${t('gateway.discovered')} ${discoveredAgents.length} ${t('agent.main')}`"
        >
          <template #extra>
            <div class="agent-list">
              <el-tag v-for="agent in discoveredAgents" :key="agent.id" type="success" class="agent-tag">
                {{ agent.name }}
              </el-tag>
            </div>
          </template>
        </el-result>
        <el-result v-else icon="error" :title="t('gateway.bindFailed')" :sub-title="bindError" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="currentStep > 0" @click="prevStep">{{ t('gateway.prevStep') }}</el-button>
        <el-button v-if="currentStep < 2" type="primary" :loading="loading" @click="nextStep">
          {{ t('gateway.nextStep') }}
        </el-button>
        <el-button v-if="currentStep === 2" type="primary" @click="handleClose">
          {{ t('gateway.complete') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useGatewayStore } from '@/stores/gatewayStore'
import { useAgentStore } from '@/stores/agentStore'
import http from '@/utils/http'
import ConnectionTest from './ConnectionTest.vue'

const { t } = useI18n()

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

// 监听props变化，更新visible
watch(() => props.modelValue, (newValue) => {
  console.log('BindWizard props.modelValue changed:', newValue)
  visible.value = newValue
})

// 监听visible变化，同步到props
watch(visible, (newValue) => {
  console.log('BindWizard visible changed:', newValue)
  emit('update:modelValue', newValue)
})

const configFormRef = ref(null)
const configForm = reactive({
  agentName: '',
  gatewayUrl: '',
  token: ''
})

const configRules = computed(() => ({
  agentName: [
    { required: true, message: t('gateway.agentNameRequired'), trigger: 'blur' }
  ],
  gatewayUrl: [
    { required: true, message: t('gateway.gatewayUrlRequired'), trigger: 'blur' },
    { type: 'url', message: t('gateway.urlInvalid'), trigger: 'blur' }
  ],
  token: [
    { required: true, message: t('gateway.tokenRequired'), trigger: 'blur' }
  ]
}))

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
    // 检查测试是否成功
    if (!testResult.value || !testResult.value.connected) {
      ElMessage.error(t('gateway.testBeforeBind'))
      return
    }
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
    // 前端独立完成绑定，不请求云ECS
    const gatewayId = `gateway-${Date.now()}` // 生成唯一ID
    
    // 保存网关信息到localStorage
    const boundGateway = {
      gatewayId: gatewayId,
      gatewayUrl: configForm.gatewayUrl,
      gatewayType: configForm.gatewayUrl.includes('127.0.0.1') || configForm.gatewayUrl.includes('localhost') ? 'local' : 'remote',
      name: configForm.agentName,
      status: 'connected',
      token: configForm.token
    }
    
    localStorage.setItem('bound_gateway', JSON.stringify(boundGateway))
    console.log('Gateway info saved to localStorage:', boundGateway)

    // 保存 Token 到 localStorage
    localStorage.setItem('gatewayToken', configForm.token)
    console.log('Gateway Token saved to localStorage')

    // 更新Store
    gatewayStore.addGateway({
      id: gatewayId,
      agentName: configForm.agentName,
      gatewayUrl: configForm.gatewayUrl,
      token: configForm.token,
      connectionStatus: 'running',
      boundAt: new Date().toISOString()
    })

    bindSuccess.value = true
    discoveredAgents.value = [] // 暂时没有agents数据
    currentStep.value = 2
    emit('success')
  } catch (error) {
    bindSuccess.value = false
    bindError.value = error.message || '绑定失败'
    currentStep.value = 2
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  console.log('========== BindWizard handleClose start ==========')
  console.log('BindWizard bindSuccess.value:', bindSuccess.value)
  console.log('BindWizard currentStep.value:', currentStep.value)
  console.log('BindWizard discoveredAgents.value:', discoveredAgents.value)

  // 如果绑定成功，刷新页面以显示监控数据
  if (bindSuccess.value) {
    console.log('Bind success, preparing to refresh page')
    visible.value = false

    // 延迟刷新，确保用户看到成功提示
    setTimeout(() => {
      console.log('Refreshing page to load monitoring data')
      console.log('========== Page refresh imminent ==========')
      window.location.href = '/'
    }, 500)
  } else {
    console.log('Bind failed or user cancelled, just closing dialog')
    // 绑定失败或用户取消，只是关闭对话框
    visible.value = false
  }

  // 重置表单状态
  currentStep.value = 0
  bindSuccess.value = false
  bindError.value = ''
  discoveredAgents.value = []
  configForm.agentName = ''
  configForm.gatewayUrl = ''
  configForm.token = ''

  console.log('========== BindWizard handleClose done ==========')
}

const handleOpen = () => {
  console.log('BindWizard dialog opened')
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
