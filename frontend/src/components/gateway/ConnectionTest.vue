<template>
  <div class="connection-test">
    <el-button type="primary" :loading="loading" @click="handleTest">
      测试连接
    </el-button>

    <div v-if="testResult" class="test-result">
      <div class="result-item">
        <span class="result-label">连接状态:</span>
        <el-tag :type="testResult.connected ? 'success' : 'danger'" size="large">
          {{ testResult.connected ? '🟢 成功' : '🔴 失败' }}
        </el-tag>
      </div>

      <div v-if="testResult.connected" class="result-item">
        <span class="result-label">连接延迟:</span>
        <span class="result-value">{{ testResult.latency }} ms</span>
      </div>

      <div v-if="testResult.message" class="result-item">
        <span class="result-label">消息:</span>
        <span class="result-value">{{ testResult.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/utils/http'

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

  try {
    const response = await http.post('/api/gateway/test', {
      gatewayUrl: props.gatewayUrl,
      token: props.token
    })

    if (response.success) {
      testResult.value = response.data

      if (response.data.connected) {
        emit('success', response.data)
      } else {
        emit('fail')
      }
    }
  } catch (error) {
    testResult.value = {
      connected: false,
      latency: 0,
      message: '连接测试失败'
    }
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
