<template>
  <div class="status-card">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
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
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.status-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  margin-bottom: 15px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.card-content {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}
</style>
