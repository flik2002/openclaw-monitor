import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建Axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 自动添加JWT Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 未授权,清除登录状态
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          localStorage.removeItem('userEmail')
          localStorage.removeItem('userRole')
          ElMessage.error('登录已过期,请重新登录')
          // 跳转到登录页
          window.location.href = '/auth/login'
          break
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误,请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default http
