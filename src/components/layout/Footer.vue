<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="legal-links">
        <router-link to="/legal/disclaimer" class="legal-link">{{ t('legal.disclaimer') }}</router-link>
        <span class="separator">|</span>
        <router-link to="/legal/privacy" class="legal-link">{{ t('legal.privacy') }}</router-link>
        <span class="separator">|</span>
        <router-link to="/legal/terms" class="legal-link">{{ t('legal.terms') }}</router-link>
        <span class="separator">|</span>
        <router-link to="/legal/contact" class="legal-link">{{ t('legal.contact') }}</router-link>
      </div>
      <div class="copyright">{{ t('legal.copyright') }}</div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.footer {
  width: 100%;
  padding: 20px 0;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.legal-links {
  margin-bottom: 10px;
}

.legal-link {
  color: #1890ff;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.3s;
}

.legal-link:hover {
  color: #40a9ff;
}

.separator {
  color: #999;
  font-size: 12px;
  margin: 0 10px;
}

.copyright {
  color: #999;
  font-size: 12px;
}

@media (max-width: 768px) {
  .legal-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
  }

  .separator {
    display: none;
  }
}
</style>
