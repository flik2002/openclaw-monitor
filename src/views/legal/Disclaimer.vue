<template>
  <div class="legal-page">
    <div class="legal-container">
      <h1>{{ t('legal.disclaimerDetail.title') }}</h1>
      <div class="legal-content">
        <p class="update-time">{{ t('legal.disclaimerDetail.updateTime') }}</p>

        <div v-for="(section, index) in t('legal.disclaimerDetail.sections')" :key="index">
          <h2>{{ section.heading }}</h2>
          <p v-for="(para, pi) in section.paragraphs" :key="'p-'+pi">{{ para }}</p>
          <ul v-if="section.items">
            <li v-for="(item, li) in section.items" :key="'li-'+li">{{ item }}</li>
          </ul>
        </div>

        <p class="copyright">{{ t('legal.copyright') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px 20px;
}

.legal-container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.legal-container h1 {
  font-size: 32px;
  font-weight: 600;
  color: #28C78E;
  margin-bottom: 30px;
  text-align: center;
}

.legal-content {
  line-height: 1.8;
  color: #333;
}

.update-time {
  color: #999;
  font-size: 14px;
  margin-bottom: 30px;
}

.legal-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-top: 40px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #28C78E;
}

.legal-content h2:first-of-type {
  margin-top: 0;
}

.legal-content p {
  margin-bottom: 15px;
  text-align: justify;
}

.legal-content ul {
  margin: 15px 0;
  padding-left: 30px;
}

.legal-content li {
  margin-bottom: 10px;
}

.copyright {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
