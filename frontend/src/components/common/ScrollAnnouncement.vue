<template>
  <div class="scroll-announcement" v-if="announcements.length > 0">
    <div class="announcement-wrapper" :style="wrapperStyle">
      <div
        v-for="(announcement, index) in announcements"
        :key="announcement.id"
        class="announcement-item"
      >
        {{ announcement.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import http from '@/utils/http'

const announcements = ref([])
const scrollPosition = ref(0)
let animationFrame = null

// 滚动速度映射(像素/秒)
const speedMap = {
  slow: 30,
  medium: 60,
  fast: 100
}

// 计算滚动速度
const scrollSpeed = computed(() => {
  if (announcements.value.length === 0) return 60
  const speed = announcements.value[0].scroll_speed || 'medium'
  return speedMap[speed] || 60
})

// 计算wrapper样式
const wrapperStyle = computed(() => ({
  transform: `translateX(${-scrollPosition.value}px)`
}))

// 获取公告列表
const fetchAnnouncements = async () => {
  try {
    const response = await http.get('/api/announcement/list')
    if (response.success) {
      announcements.value = response.data
    }
  } catch (error) {
    console.error('获取公告失败:', error)
  }
}

// 滚动动画
const animate = () => {
  if (announcements.value.length === 0) return

  // 计算总宽度
  const totalWidth = announcements.value.length * 500 // 假设每个公告宽度500px

  // 更新位置
  scrollPosition.value += scrollSpeed.value / 60 // 60fps

  // 循环滚动
  if (scrollPosition.value >= totalWidth) {
    scrollPosition.value = 0
  }

  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  fetchAnnouncements()
  animate()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.scroll-announcement {
  width: 100%;
  overflow: hidden;
  height: 30px;
  line-height: 30px;
  background: #f5f7fa;
  border-radius: 4px;
}

.announcement-wrapper {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}

.announcement-item {
  display: inline-block;
  padding: 0 50px;
  min-width: 500px;
  font-size: 14px;
  color: #666;
}
</style>
