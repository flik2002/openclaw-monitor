<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>注册</h2>
        <p>创建您的 OpenClaw 监控系统账号</p>
      </div>

      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form">
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="registerForm.phone"
            placeholder="手机号(选填)"
            prefix-icon="Phone"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="verificationCode">
          <div class="code-input">
            <el-input
              v-model="registerForm.verificationCode"
              placeholder="请输入验证码"
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
            placeholder="请输入密码(至少8位,包含字母和数字)"
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
            注册
          </el-button>
        </el-form-item>

        <div class="register-footer">
          <span>已有账号?</span>
          <router-link to="/auth/login" class="login-link">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import http from '@/utils/http'

const router = useRouter()
const userStore = useUserStore()

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

const registerRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度至少8位', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
          callback(new Error('密码必须包含字母和数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const codeButtonDisabled = computed(() => countdown.value > 0 || !registerForm.email)
const codeButtonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}秒后重发`
  }
  return '发送验证码'
})

const handleSendCode = async () => {
  if (!registerForm.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  codeLoading.value = true

  try {
    const response = await http.post('/api/auth/send-verification', {
      email: registerForm.email
    })

    if (response.success) {
      ElMessage.success('验证码已发送')
      countdown.value = 300 // 5分钟 = 300秒

      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
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

        ElMessage.success('注册成功')
        router.push('/')
      }
    } catch (error) {
      console.error('注册失败:', error)
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
