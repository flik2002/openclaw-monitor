<template>
  <div class="monitor-v2-container">
    <Header />
    <iframe
      :src="iframeSrc"
      frameborder="0"
      class="monitor-iframe"
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'

const router = useRouter()
const iframeSrc = ref('/monitor-ui-v2.html')
const iframeLoaded = ref(false)
const selectedGatewayId = ref(null)

const onIframeLoad = () => {
  iframeLoaded.value = true
  console.log('Monitor page V2 loaded')

  const iframe = document.querySelector('.monitor-iframe')
  if (iframe && iframe.contentWindow) {
    // 发送当前语言设置给iframe
    const currentLang = localStorage.getItem('language') || 'zh-CN'
    iframe.contentWindow.postMessage({ type: 'languageChange', lang: currentLang }, '*')

    // 如果有选中的Gateway ID，发送消息给iframe
    if (selectedGatewayId.value) {
      iframe.contentWindow.postMessage({
        type: 'selectGateway',
        gatewayId: selectedGatewayId.value
      }, '*')
      console.log('Sent selected Gateway ID to iframe:', selectedGatewayId.value)
    }
  }
}

// 监听来自iframe的消息
const handleIframeMessage = (event) => {
  console.log('Received iframe message:', event.data)

  if (event.data && event.data.type === 'openBindWizard') {
    // 触发Header组件中的绑定向导
    const headerComponent = document.querySelector('.header-component')
    if (headerComponent) {
      // 触发自定义事件
      const customEvent = new CustomEvent('openBindWizard')
      headerComponent.dispatchEvent(customEvent)
    }

    // 或者直接调用全局方法（如果有）
    if (window.openBindWizard) {
      window.openBindWizard()
    }
  }

  if (event.data && event.data.type === 'navigate') {
    // iframe请求在父窗口中导航
    const path = event.data.path || '/'
    console.log('Iframe requested navigation to:', path)
    router.push(path)
  }
}

onMounted(() => {
  console.log('MonitorPageV2 component mounted')
  console.log('iframeSrc:', iframeSrc.value)

  // 从localStorage获取选中的Gateway ID
  selectedGatewayId.value = localStorage.getItem('selectedGatewayId')
  console.log('Selected Gateway ID:', selectedGatewayId.value)

  // 监听来自iframe的消息
  window.addEventListener('message', handleIframeMessage)
})

onUnmounted(() => {
  // 移除消息监听
  window.removeEventListener('message', handleIframeMessage)
})
</script>

<style scoped>
.monitor-v2-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
}

.monitor-iframe {
  width: 100%;
  height: 100vh;
  border: none;
  display: block;
}
</style>
