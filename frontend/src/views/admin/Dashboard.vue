<template>
  <div class="admin-dashboard">
    <h1>{{ t('admin.dashboard') }}</h1>
    <p>{{ t('admin.underDevelopment') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
</style>
