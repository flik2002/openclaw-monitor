<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="legal-links">
        <router-link to="/legal/disclaimer" class="legal-link">免责声明</router-link>
        <span class="separator">|</span>
        <router-link to="/legal/privacy" class="legal-link">隐私政策</router-link>
        <span class="separator">|</span>
        <router-link to="/legal/terms" class="legal-link">服务条款</router-link>
        <span class="separator">|</span>
        <router-link to="/legal/contact" class="legal-link">联系方式</router-link>
      </div>
      <div class="copyright">© 2026 OpenClaw. All rights reserved.</div>
    </div>
  </footer>
</template>

<script setup>
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
