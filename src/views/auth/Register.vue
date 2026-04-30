<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>{{ t('common.register') }}</h2>
        <p>{{ t('auth.createAccount') }}</p>
      </div>

      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form">
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            :placeholder="t('auth.email')"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="registerForm.phone"
            :placeholder="t('auth.phone') + '(' + t('common.guest') + ')'"
            prefix-icon="Phone"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="verificationCode">
          <div class="code-input">
            <el-input
              v-model="registerForm.verificationCode"
              :placeholder="t('auth.verificationCode')"
              prefix-icon="Key"
              size="large"
            />
            <el-button
              type="primary"
              size="large"
              :disabled="codeButtonDisabled"
              :loading="codeLoading"
              @click="handleSendCode"
            >
              {{ codeButtonText }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            :placeholder="t('auth.password') + '(' + t('auth.passwordStrength') + ')'"
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
            class="register-button"
            @click="handleRegister"
          >
            {{ t('common.register') }}
          </el-button>
        </el-form-item>

        <div class="register-footer">
          <span>{{ t('auth.hasAccount') }}</span>
          <router-link to="/auth/login" class="login-link">{{ t('common.login') }}</router-link>
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

const registerFormRef = ref(null)
const loading = ref(false)
const codeLoading = ref(false)
const countdown = ref(0)

const registerForm = reactive({
  email: '',
  phone: '',
  verificationCode: '',
  password: ''
})

const registerRules = computed(() => ({
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: t('auth.phoneInvalid'), trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: t('auth.codeRequired'), trigger: 'blur' },
    { len: 6, message: t('auth.codeSixDigits'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 8, message: t('auth.passwordMinLength'), trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
          callback(new Error(t('auth.passwordMustContain')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

const codeButtonDisabled = computed(() => countdown.value > 0 || !registerForm.email)
const codeButtonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}s ${t('auth.sendCode')}`
  }
  return t('auth.sendCode')
})

const handleSendCode = async () => {
  // 验证邮箱格式
  if (!registerForm.email) {
    ElMessage.warning(t('auth.enterEmailFirst'))
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(registerForm.email)) {
    ElMessage.warning(t('auth.emailInvalid'))
    return
  }

  codeLoading.value = true

  try {
    const response = await http.post('/api/auth/send-verification', {
      email: registerForm.email
    })

    if (response.success) {
      ElMessage.success(t('auth.codeSentToEmail'))
      countdown.value = 60 // 60秒倒计时

      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  } catch (error) {
    console.error('Send verification code failed:', error)
    // 显示具体的错误信息
    const errorMsg = error.response?.data?.message || error.message || t('auth.codeSendFailed')
    ElMessage.error(errorMsg)
  } finally {
    codeLoading.value = false
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      const response = await http.post('/api/auth/register', {
        email: registerForm.email,
        phone: registerForm.phone || undefined,
        password: registerForm.password,
        verificationCode: registerForm.verificationCode
      })

      if (response.success) {
        // 自动登录
        userStore.login({
          userId: response.data.userId,
          email: registerForm.email,
          role: 'registered_user',
          token: response.data.token
        })

        ElMessage.success(t('auth.registerSuccess'))
        router.push('/')
      }
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #28C78E 0%, #20a076 100%);
}

.register-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #28C78E;
  margin-bottom: 10px;
}

.register-header p {
  font-size: 14px;
  color: #666;
}

.register-form {
  margin-bottom: 20px;
}

.code-input {
  display: flex;
  gap: 10px;
}

.code-input .el-input {
  flex: 1;
}

.register-button {
  width: 100%;
}

.register-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #28C78E;
  text-decoration: none;
  margin-left: 5px;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
