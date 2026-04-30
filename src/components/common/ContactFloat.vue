<template>
  <div class="contact-float">
    <div class="contact-card">
      <div class="contact-icon">
        <el-icon><Message /></el-icon>
      </div>
      <div class="contact-info">
        <span class="contact-label">{{ t('legal.contactTitle') }}</span>
        <a :href="`mailto:${contactEmail}`" class="contact-email">
          {{ contactEmail }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Message } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 联系人邮箱（可配置）
const contactEmail = '5003698@qq.com'
</script>

<style scoped>
.contact-float {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #28C78E 0%, #20a076 100%);
  border-radius: 50%;
  color: #fff;
  font-size: 18px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-label {
  font-size: 12px;
  color: #999;
}

.contact-email {
  font-size: 14px;
  color: #28C78E;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.contact-email:hover {
  color: #20a076;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-float {
    right: 10px;
    bottom: 10px;
  }

  .contact-card {
    padding: 10px 12px;
  }

  .contact-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .contact-label {
    font-size: 11px;
  }

  .contact-email {
    font-size: 13px;
  }
}
</style>
