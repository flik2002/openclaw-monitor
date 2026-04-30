<template>
  <div class="scroll-announcement" v-if="props.announcements.length > 0">
    <div class="announcement-wrapper" :style="wrapperStyle">
      <!-- 复制一份用于无缝滚动 -->
      <div
        v-for="(announcement, index) in [...props.announcements, ...props.announcements]"
        :key="`${announcement.id}-${index}`"
        class="announcement-item"
      >
        <span class="announcement-icon">📢</span>
        {{ announcement.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 接收公告数据作为props
const props = defineProps({
  announcements: {
    type: Array,
    default: () => []
  }
})

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
  if (props.announcements.length === 0) return 60
  const speed = props.announcements[0].scroll_speed || 'medium'
  return speedMap[speed] || 60
})

// 计算wrapper样式
const wrapperStyle = computed(() => ({
  transform: `translateX(${-scrollPosition.value}px)`
}))

// 滚动动画
const animate = () => {
  if (props.announcements.length === 0) return

  // 计算单个公告宽度
  const itemWidth = 500 // 每个公告宽度500px
  const totalWidth = props.announcements.length * itemWidth

  // 更新位置
  scrollPosition.value += scrollSpeed.value / 60 // 60fps

  // 无缝滚动：当滚动完一组公告后，重置位置
  if (scrollPosition.value >= totalWidth) {
    scrollPosition.value = 0
  }

  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  // 延迟启动动画，等待DOM渲染
  setTimeout(() => {
    animate()
  }, 100)
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
  height: 40px;
  line-height: 40px;
  background: linear-gradient(to right, #f0f9ff, #e0f2fe, #f0f9ff);
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.announcement-wrapper {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}

.announcement-item {
  display: inline-flex;
  align-items: center;
  padding: 0 50px;
  min-width: 500px;
  font-size: 14px;
  color: #1e40af;
  font-weight: 500;
}

.announcement-icon {
  margin-right: 8px;
  font-size: 16px;
}
</style>
