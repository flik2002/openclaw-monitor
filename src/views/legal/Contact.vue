<template>
  <div class="legal-page">
    <h1>{{ t('legal.contactTitle') }}</h1>
    <p>{{ t('legal.contactContent') }}</p>
    <p>{{ t('legal.contactEmail') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.legal-page {
  padding: 20px;
}
</style>
