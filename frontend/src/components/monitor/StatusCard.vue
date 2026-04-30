<template>
  <div class="status-card">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <slot name="header-extra"></slot>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.status-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.status-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  font-size: 28px;
  font-weight: 700;
  color: #212529;
  line-height: 1.2;
}

/* 添加渐变背景效果 */
.status-card:nth-child(1) {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.status-card:nth-child(2) {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.status-card:nth-child(3) {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.status-card:nth-child(4) {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

.status-card:nth-child(5) {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
}

.status-card:nth-child(6) {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
}

.status-card:nth-child(7) {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
}
</style>
