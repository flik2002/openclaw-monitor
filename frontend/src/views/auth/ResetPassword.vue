<template>
  <div class="reset-password-container">
    <div class="reset-password-box">
      <h2>{{ t('auth.resetPassword') }}</h2>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item :label="t('auth.email')" prop="email">
          <el-input
            v-model="form.email"
            :placeholder="t('auth.enterEmail')"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item :label="t('auth.newPassword')" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            :placeholder="t('auth.enterNewPassword')"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item :label="t('auth.confirmPassword')" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            :placeholder="t('auth.reEnterPassword')"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleResetPassword" :loading="loading" style="width: 100%">
            {{ t('auth.resetPassword') }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="back-to-login">
        <router-link to="/auth/login">
          {{ t('auth.backToLogin') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import http from '@/utils/http'
import { useUserStore } from '@/stores/userStore'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error(t('auth.passwordRequired')))
  } else if (value.length < 8) {
    callback(new Error(t('auth.passwordMinLength')))
  } else if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    callback(new Error(t('auth.passwordMustContain')))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error(t('auth.reEnterPassword')))
  } else if (value !== form.newPassword) {
    callback(new Error(t('auth.passwordMismatch')))
  } else {
    callback()
  }
}

const rules = computed(() => ({
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}))

const handleResetPassword = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    
    try {
      const response = await http.post('/reset-password/reset-password', {
        email: form.email,
        newPassword: form.newPassword
      })
      
      if (response.success) {
        ElMessage.success(t('auth.resetSuccess'))
        
        // 自动登录
        userStore.login(response.data)
        
        // 跳转到首页
        router.push('/')
      } else {
        ElMessage.error(response.message || t('auth.resetFailed'))
      }
    } catch (error) {
      console.error('Password reset failed:', error)
      ElMessage.error(t('auth.resetFailed') + ': ' + (error.response?.data?.message || error.message))
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-password-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.reset-password-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
}

.back-to-login a {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

.back-to-login a:hover {
  text-decoration: underline;
}
</style>
