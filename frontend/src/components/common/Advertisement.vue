<template>
  <div class="advertisement-container">
    <div
      v-for="ad in ads"
      :key="ad.id"
      class="advertisement"
      :style="getContainerStyle(ad)"
    >
      <a
        v-if="ad.link"
        :href="ad.link"
        target="_blank"
        rel="noopener noreferrer"
        class="ad-link"
      >
        <img
          v-if="ad.content_type === 'image'"
          :src="ad.content"
          :alt="ad.position"
          class="ad-image"
          @error="handleImageError"
        />
        <div v-else class="ad-text">{{ ad.content }}</div>
      </a>
      <div v-else>
        <img
          v-if="ad.content_type === 'image'"
          :src="ad.content"
          :alt="ad.position"
          class="ad-image"
          @error="handleImageError"
        />
        <div v-else class="ad-text">{{ ad.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  ads: {
    type: Array,
    default: () => []
  },
  position: {
    type: String,
    default: 'normal'
  }
})

const getContainerStyle = (ad) => {
  if (props.position === 'float') {
    // 悬浮模式 - 固定大小
    return {
      width: '280px',
      minHeight: '100px',
      marginBottom: '10px'
    }
  }

  // 正常模式 - 使用后台设置的大小
  return {
    width: `${ad.width}px`,
    height: `${ad.height}px`
  }
}

const handleImageError = () => {
  ElMessage.warning(t('advertisement.imageLoadFailed'))
}
</script>

<style scoped>
.advertisement-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.advertisement {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ad-link {
  display: block;
  width: 100%;
  height: 100%;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ad-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 14px;
  color: #666;
  text-align: center;
}
</style>
