<template>
  <div
    class="agent-tab"
    :class="{
      'agent-tab-selected': isSelected,
      'agent-tab-hovered': isHovered
    }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span class="status-dot" :class="`status-${agent.status}`"></span>
    <span class="agent-name">{{ agent.name }}</span>
    <el-button
      v-if="isHovered"
      type="danger"
      size="small"
      link
      class="delete-btn"
      @click.stop="handleDelete"
    >
      <el-icon><Delete /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  agent: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isHovered: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'hover', 'delete'])

const handleClick = () => {
  emit('click', props.agent.id)
}

const handleMouseEnter = () => {
  emit('hover', props.agent.id)
}

const handleMouseLeave = () => {
  emit('hover', null)
}

const handleDelete = () => {
  emit('delete', props.agent)
}
</script>

<style scoped>
.agent-tab {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 3px solid #E8E8E8;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  position: relative;
}

.agent-tab:hover {
  background: #f5f7fa;
}

.agent-tab-selected {
  border-bottom-color: #28C78E;
  background: #f0faf6;
}

.agent-tab-hovered {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-idle {
  background: #67c23a;
}

.status-working {
  background: #e6a23c;
}

.status-offline {
  background: #909399;
}

.agent-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.delete-btn {
  margin-left: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.agent-tab:hover .delete-btn {
  opacity: 1;
}
</style>
