<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>登录</h2>
        <p>欢迎回到 OpenClaw 监控系统</p>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
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
            登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <span>还没有账号?</span>
          <router-link to="/auth/register" class="register-link">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import http from '@/utils/http'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const loginRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      const response = await http.post('/api/auth/login', {
        email: loginForm.email,
        password: loginForm.password
      })

      if (response.success) {
        // 保存用户信息
        userStore.login({
          userId: response.data.userId,
          email: loginForm.email,
          role: response.data.role,
          token: response.data.token
        })

        ElMessage.success('登录成功')
        router.push('/')
      }
    } catch (error) {
      console.error('登录失败:', error)
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
  margin-left: 5px;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
