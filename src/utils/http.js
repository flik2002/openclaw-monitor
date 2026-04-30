import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建Axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://47.109.47.116',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    console.log('========== HTTP请求 ==========')
    console.log('请求URL:', config.url)
    console.log('请求方法:', config.method)
    console.log('完整URL:', config.baseURL + config.url)
    console.log('请求头:', config.headers)
    console.log('请求数据:', config.data)
    
    // 自动添加JWT Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('已添加Token:', token.substring(0, 20) + '...')
    } else {
      console.log('未找到Token，请求可能需要认证')
    }
    
    console.log('========== 请求发送 ==========')
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    console.log('========== HTTP响应成功 ==========')
    console.log('状态码:', response.status)
    console.log('响应数据:', response.data)
    console.log('响应头:', response.headers)
    console.log('========== 响应处理完成 ==========')
    return response.data
  },
  ( error) => {
    console.log('========== HTTP响应失败 ==========')
    console.error('错误类型:', error.name)
    console.error('错误消息:', error.message)
    
    if (error.response) {
      const { status, data } = error.response
      console.error('响应状态:', status)
      console.error('响应数据:', data)
      console.error('响应头:', error.response.headers)

      switch (status) {
        case 401:
          console.error('401 未授权错误')
          // 不要在这里清除localStorage,让用户手动处理
          // ElMessage.warning('登录已过期，请重新登录')
          break
        case 403:
          console.error('403 禁止访问错误')
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          console.error('404 资源不存在错误')
          console.error('请求的URL:', error.config?.url)
          console.error('完整URL:', error.config?.baseURL + error.config?.url)
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          console.error('500 服务器内部错误')
          ElMessage.error(data.message || '服务器内部错误')
          break
        default:
          console.error(`${status} 错误`)
          ElMessage.error(data.message || '请求失败')
      }
    } else if (error.request) {
      console.error('网络错误,请求已发送但未收到响应')
      ElMessage.error('网络连接失败,请检查网络')
    } else {
      console.error('请求配置错误')
      ElMessage.error('请求失败,请稍后重试')
    }
    
    console.log('========== 错误处理完成 ==========')
    return Promise.reject(error)
  }
)

export default http
