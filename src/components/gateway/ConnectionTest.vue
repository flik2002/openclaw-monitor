<template>
  <div class="connection-test">
    <el-button type="primary" :loading="loading" @click="handleTest">
      {{ t('gateway.testConnection') }}
    </el-button>

    <div v-if="testResult" class="test-result">
      <div class="result-item">
        <span class="result-label">{{ t('gateway.connectionStatus') }}:</span>
        <el-tag :type="testResult.connected ? 'success' : 'danger'" size="large">
          {{ testResult.connected ? '🟢 ' + t('gateway.connectionSuccess') : '🔴 ' + t('gateway.connectionFailed') }}
        </el-tag>
      </div>

      <div v-if="testResult.connected" class="result-item">
        <span class="result-label">{{ t('gateway.connectionLatency') }}:</span>
        <span class="result-value">{{ testResult.latency }} {{ t('gateway.ms') }}</span>
      </div>

      <div v-if="testResult.message" class="result-item">
        <span class="result-label">{{ t('gateway.connectionMessage') }}:</span>
        <span class="result-value">{{ testResult.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import http from '@/utils/http'

const { t } = useI18n()

const props = defineProps({
  gatewayUrl: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['success', 'fail'])

const loading = ref(false)
const testResult = ref(null)

const handleTest = async () => {
  loading.value = true

  console.log('ConnectionTest - start testing connection')
  console.log('ConnectionTest - gatewayUrl:', props.gatewayUrl)
  console.log('ConnectionTest - token:', props.token ? 'set' : 'not set')

  try {
    // 规范化网关URL：将https改为http（本地网关通常使用http）
    let normalizedUrl = props.gatewayUrl
    if (normalizedUrl.includes('127.0.0.1') || normalizedUrl.includes('localhost')) {
      normalizedUrl = normalizedUrl.replace(/^https/, 'http')
    }

    // 判断是否为本地网关（127.0.0.1 或 localhost）
    const isLocalGateway = normalizedUrl.includes('127.0.0.1') || normalizedUrl.includes('localhost')

    // 构建请求URL：本地网关使用代理，远程网关直接访问
    // 测试网关根路径是否可访问
    let requestUrl
    if (isLocalGateway) {
      // 使用Vite代理路径，避免CORS问题
      requestUrl = '/gateway-api/'
      console.log('ConnectionTest - using proxy for local gateway')
    } else {
      // 远程网关直接访问
      requestUrl = `${normalizedUrl}/`
      console.log('ConnectionTest - direct access for remote gateway')
    }

    const startTime = Date.now()

    // 构建请求头
    const headers = {}

    // 只有Token不为空时才添加Authorization头
    if (props.token && props.token.trim() !== '') {
      headers['Authorization'] = `Bearer ${props.token}`
    }

    // 发送一个简单的GET请求测试连接
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: headers
    })
    const latency = Date.now() - startTime

    console.log('ConnectionTest - test response:', response)

    // 只要能连接到网关就算成功（200或401都算连接成功）
    if (response.ok || response.status === 401) {
      testResult.value = {
        connected: true,
        latency: latency,
        message: response.status === 401 ? '连接成功（需要认证）' : '连接成功'
      }
      console.log('ConnectionTest - connection success')
      emit('success', { connected: true, latency })
    } else {
      testResult.value = {
        connected: false,
        message: `连接失败: ${response.status} ${response.statusText}`
      }
      console.log('ConnectionTest - connection failed')
      emit('fail')
    }
  } catch (error) {
    console.error('ConnectionTest - test connection failed:', error)

    // 详细的错误信息
    let errorMessage = t('gateway.testFailed')
    if (error.message && error.message.includes('Failed to fetch')) {
      errorMessage = '无法连接到网关，请检查地址和端口是否正确'
    } else if (error.message && error.message.includes('CORS')) {
      errorMessage = '跨域请求被阻止，请检查网关CORS配置'
    } else {
      errorMessage = t('gateway.configError') + error.message
    }

    testResult.value = {
      connected: false,
      latency: 0,
      message: errorMessage
    }

    console.log('ConnectionTest - emit fail event')
    emit('fail')
  } finally {
    loading.value = false
  }
}

// 组件挂载时自动测试
onMounted(() => {
  handleTest()
})
</script>

<style scoped>
.connection-test {
  text-align: center;
}

.test-result {
  margin-top: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  font-weight: 600;
  margin-right: 10px;
}

.result-value {
  color: #666;
}
</style>
