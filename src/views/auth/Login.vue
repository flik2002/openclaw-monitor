<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>{{ t('common.login') }}</h2>
        <p>{{ t('auth.welcomeBack') }}</p>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            :placeholder="t('auth.email')"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="t('auth.password')"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ t('common.login') }}
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <span>{{ t('auth.noAccount') }}</span>
          <router-link to="/auth/register" class="register-link">{{ t('common.register') }}</router-link>
        </div>

        <div class="forgot-password">
          <router-link to="/auth/reset-password" class="forgot-link">{{ t('auth.forgotPassword') }}</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore'
import http from '@/utils/http'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const loginRules = computed(() => ({
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' }
  ]
}))

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      console.log('========== Start login flow ==========')
      console.log('1. Form validation passed')
      console.log('2. Email:', loginForm.email)
      console.log('3. Password:', loginForm.password)
      console.log('4. Preparing request to: /api/auth/login')
      
      const response = await http.post('/api/auth/login', {
        email: loginForm.email,
        password: loginForm.password
      })

      console.log('5. Response received:', response)
      console.log('6. Response type:', typeof response)
      console.log('7. Response content:', JSON.stringify(response, null, 2))
      
      if (response && response.success) {
        console.log('8. Login success, saving user info')
        console.log('9. User ID:', response.data.userId)
        console.log('10. Token:', response.data.token ? response.data.token.substring(0, 20) + '...' : 'none')
        
        // 保存用户信息
        userStore.login({
          userId: response.data.userId,
          email: loginForm.email,
          role: response.data.role,
          token: response.data.token
        })

        console.log('11. User info saved to userStore')
        console.log('12. Preparing to redirect to home')
        
        ElMessage.success(t('auth.loginSuccess'))
        router.push('/')
        
        console.log('13. Login flow complete')
      } else {
        console.log('8. Login failed, success is false or response is empty')
        console.log('9. Error message:', response?.message || 'unknown error')
        ElMessage.error(response?.message || t('auth.loginFailed'))
      }
    } catch (error) {
      console.error('========== Login failed ==========')
      console.error('Error type:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      console.error('Full error object:', error)
      
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        console.error('Response headers:', error.response.headers)
      }
      
      ElMessage.error(error.response?.data?.message || error.message || t('auth.loginFailedNetwork'))
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #28C78E 0%, #20a076 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #28C78E;
  margin-bottom: 10px;
}

.login-header p {
  font-size: 14px;
  color: #666;
}

.login-form {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link {
  color: #28C78E;
  text-decoration: none;
}

.forgot-password {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
