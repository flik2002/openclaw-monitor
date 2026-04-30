<template>
  <div class="status-cards">
    <!-- 运行状态 - 仪表盘 -->
    <div class="chart-card">
      <div class="card-title">{{ t('monitor.runStatus') }}</div>
      <div ref="statusChart" class="chart-container"></div>
    </div>

    <!-- 会话数 - 环形图 -->
    <div class="chart-card">
      <div class="card-title">{{ t('monitor.sessions') }}</div>
      <div ref="sessionChart" class="chart-container"></div>
    </div>

    <!-- Token 使用 - 半圆仪表盘 -->
    <div class="chart-card">
      <div class="card-title">{{ t('monitor.tokenUsage') }}</div>
      <div ref="tokenChart" class="chart-container"></div>
    </div>

    <!-- 在线时长 - 进度条 -->
    <div class="chart-card">
      <div class="card-title">{{ t('monitor.onlineTime') }}</div>
      <div class="metric-big">{{ status.metrics?.onlineTime || '0h 0m' }}</div>
      <el-progress :percentage="100" :stroke-width="8" color="#409eff" />
    </div>

    <!-- 内存占用 - 水平进度条 -->
    <div class="chart-card">
      <div class="card-title">{{ t('monitor.memoryUsage') }}</div>
      <div class="metric-big">{{ displayMemoryUsage }}</div>
      <el-progress :percentage="memoryPercentage" :stroke-width="8" :color="memoryColor" />
    </div>

    <!-- 消息统计 - 柱状图 -->
    <div class="chart-card">
      <div class="card-title">{{ t('monitor.messageStats') }}</div>
      <div ref="messageChart" class="chart-container"></div>
    </div>

    <!-- 大模型 - 信息卡片 -->
    <div class="chart-card">
      <div class="card-title">{{ t('monitor.llmModel') }}</div>
      <div class="model-info">
        <div class="model-name">{{ status.metrics?.model || 'unknown' }}</div>
        <el-tag :type="statusTagType" size="small">{{ statusText }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'

const { t, locale } = useI18n()

const props = defineProps({
  status: {
    type: Object,
    default: () => ({})
  }
})

const statusChart = ref(null)
const sessionChart = ref(null)
const tokenChart = ref(null)
const messageChart = ref(null)

// 动态运行状态 computed 属性
const connectionStatus = computed(() => props.status.connectionStatus || 'offline')
const isRunning = computed(() => connectionStatus.value === 'running')
const statusTagType = computed(() => isRunning.value ? 'success' : 'danger')
const statusText = computed(() => isRunning.value ? t('monitor.running') : t('monitor.offline'))

// 内存占用显示 - 离线时显示0MB
const displayMemoryUsage = computed(() => {
  if (!isRunning.value) {
    return '0 MB'
  }
  return `${props.status.metrics?.memoryUsed || 0} MB`
})

// 计算内存百分比 - 离线时为0
const memoryPercentage = computed(() => {
  if (!isRunning.value) {
    return 0
  }
  const used = props.status.metrics?.memoryUsed || 0
  const total = 8192 // 假设 8GB 总内存
  return Math.min(Math.round((used / total) * 100), 100)
})

const memoryColor = computed(() => {
  if (memoryPercentage.value < 60) return '#67c23a'
  if (memoryPercentage.value < 80) return '#e6a23c'
  return '#f56c6c'
})

// 初始化图表
const initCharts = () => {
  initStatusChart()
  initSessionChart()
  initTokenChart()
  initMessageChart()
}

// 运行状态 - 仪表盘
const initStatusChart = () => {
  if (!statusChart.value) return
  const chart = echarts.init(statusChart.value)
  const running = isRunning.value
  
  chart.setOption({
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 1,
      itemStyle: { color: running ? '#67c23a' : '#f56c6c' },
      progress: { show: true, width: 18 },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 18 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '20%'],
        fontSize: 20,
        fontWeight: 'bold',
        formatter: running ? t('monitor.running') : t('monitor.offline'),
        color: running ? '#67c23a' : '#f56c6c'
      },
      data: [{ value: running ? 100 : 0 }]
    }]
  })
}

// 会话数 - 环形图
const initSessionChart = () => {
  if (!sessionChart.value) return
  const chart = echarts.init(sessionChart.value)
  const count = props.status.metrics?.sessions || 0
  
  chart.setOption({
    series: [{
      type: 'pie',
      radius: ['65%', '85%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: `{count|${count}}\n{label|${t('monitor.session')}}`,
        rich: {
          count: { fontSize: 28, fontWeight: 'bold', color: '#409eff' },
          label: { fontSize: 12, color: '#999', padding: [4, 0, 0, 0] }
        }
      },
      data: [
        { value: count, name: t('monitor.session'), itemStyle: { color: '#409eff' } },
        { value: 10 - count, name: t('monitor.idle'), itemStyle: { color: '#e6e8eb' } }
      ]
    }]
  })
}

// Token 使用 - 半圆仪表盘
const initTokenChart = () => {
  if (!tokenChart.value) return
  const chart = echarts.init(tokenChart.value)
  const used = props.status.metrics?.tokenUsed || 0
  const total = props.status.metrics?.tokenTotal || 100000
  const percentage = Math.round((used / total) * 100)
  
  chart.setOption({
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      itemStyle: { color: percentage < 60 ? '#67c23a' : percentage < 80 ? '#e6a23c' : '#f56c6c' },
      progress: { show: true, width: 18 },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 18 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '20%'],
        fontSize: 16,
        fontWeight: 'bold',
        formatter: `{value|${percentage}%}\n{used|${(used / 1000).toFixed(1)}k / ${(total / 1000).toFixed(0)}k}`,
        rich: {
          value: { fontSize: 20, color: '#409eff' },
          used: { fontSize: 10, color: '#999', padding: [4, 0, 0, 0] }
        }
      },
      data: [{ value: percentage }]
    }]
  })
}

// 消息统计 - 柱状图
const initMessageChart = () => {
  if (!messageChart.value) return
  const chart = echarts.init(messageChart.value)
  const count = props.status.metrics?.messageCount || 0
  
  chart.setOption({
    grid: { top: 10, bottom: 20, left: 30, right: 10 },
    xAxis: {
      type: 'category',
      data: [t('monitor.messageLabel')],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#999' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999' }
    },
    series: [{
      data: [count],
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#67c23a' },
          { offset: 1, color: '#95d47a' }
        ])
      },
      showBackground: true,
      backgroundStyle: { color: '#f5f7fa' }
    }]
  })
}

// 监听数据变化，更新图表
watch(() => props.status, () => {
  initCharts()
}, { deep: true })

// 监听语言变化，重新初始化图表
watch(() => locale.value, () => {
  initCharts()
})

onMounted(() => {
  initCharts()
  
  // 窗口大小变化时重新渲染
  window.addEventListener('resize', () => {
    statusChart.value && echarts.getInstanceByDom(statusChart.value)?.resize()
    sessionChart.value && echarts.getInstanceByDom(sessionChart.value)?.resize()
    tokenChart.value && echarts.getInstanceByDom(tokenChart.value)?.resize()
    messageChart.value && echarts.getInstanceByDom(messageChart.value)?.resize()
  })
})
</script>

<style scoped>
.status-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

/* 第 5-7 个卡片：第二行 */
.status-cards > :nth-child(5) {
  grid-column: span 1;
}
.status-cards > :nth-child(6) {
  grid-column: span 1;
}
.status-cards > :nth-child(7) {
  grid-column: span 1;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 120px;
}

.metric-big {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  text-align: center;
  margin: 20px 0 12px 0;
}

.model-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  gap: 12px;
}

.model-name {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
  text-align: center;
}

/* 响应式布局 */
@media (max-width: 1400px) {
  .status-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1000px) {
  .status-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .status-cards {
    grid-template-columns: 1fr;
  }
}
</style>
