import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    email: null,
    token: null,
    isLoggedIn: false,
    heartbeatTimer: null,
    // 网关绑定信息
    boundGateway: {
      gatewayId: null,
      gatewayUrl: null,
      gatewayType: null, // 'local' 或 'remote'
      status: 'disconnected', // 'connected', 'disconnected', 'error'
      name: null
    },
    heartbeatFailCount: 0 // 心跳失败计数
  }),

  getters: {
    isGuest: (state) => !state.isLoggedIn
  },

  actions: {
    // 登录
    login(userData) {
      console.log('userStore.login called, userData:', userData)
      this.userId = userData.userId
      this.email = userData.email
      this.token = userData.token
      this.isLoggedIn = true

      console.log('Saving user info to localStorage')
      // 保存到LocalStorage
      localStorage.setItem('token', userData.token)
      localStorage.setItem('userId', userData.userId)
      localStorage.setItem('userEmail', userData.email)

      // 启动心跳定时器
      this.startHeartbeat()

      console.log('Login state:', {
        userId: this.userId,
        email: this.email,
        isLoggedIn: this.isLoggedIn,
        token: this.token ? 'set' : 'not set'
      })
    },

    // 登出
    logout() {
      this.userId = null
      this.email = null
      this.token = null
      this.isLoggedIn = false

      // 停止心跳定时器
      this.stopHeartbeat()

      // 清除LocalStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
    },

    // 检查认证状态
    checkAuth() {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const email = localStorage.getItem('userEmail')

      if (token && userId && email) {
        this.userId = userId
        this.email = email
        this.token = token
        this.isLoggedIn = true

        // 加载网关绑定信息
        this.checkGatewayBinding()

        // 启动心跳定时器
        this.startHeartbeat()

        return true
      }

      return false
    },

    // 启动心跳定时器
    startHeartbeat() {
      // 清除现有定时器
      this.stopHeartbeat()

      // 每60秒发送一次心跳
      this.heartbeatTimer = setInterval(async () => {
        if (!this.userId) {
          console.log('未找到userId,停止心跳')
          this.stopHeartbeat()
          return
        }

        try {
          // 心跳只发送userId和网关信息，不需要JWT Token
          const heartbeatData = { userId: this.userId }
          if (this.boundGateway.gatewayId) {
            heartbeatData.boundGateway = {
              gatewayId: this.boundGateway.gatewayId,
              gatewayUrl: this.boundGateway.gatewayUrl,
              gatewayType: this.boundGateway.gatewayType
            }
          }

          // 直接fetch到云ECS，不经过http拦截器（不添加JWT Token）
          const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://47.109.47.116'
          const response = await fetch(`${apiBase}/api/auth/heartbeat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(heartbeatData)
          })
          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || '心跳失败')
          }

          console.log('心跳成功:', data)
          this.heartbeatFailCount = 0
        } catch (error) {
          console.error('心跳请求失败:', error)
          this.heartbeatFailCount++

          if (this.heartbeatFailCount >= 3) {
            console.error('心跳连续失败3次，标记用户离线')
            this.updateGatewayStatus('error')
          }
        }
      }, 60000) // 60秒

      console.log('心跳定时器已启动')
    },

    // 停止心跳定时器
    stopHeartbeat() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer)
        this.heartbeatTimer = null
        console.log('心跳定时器已停止')
      }
    },

    // 绑定网关
    async bindGateway(gatewayUrl, gatewayId, name = '默认网关') {
      try {
        // 区分本地网关和远程网关
        const isLocalGateway = gatewayUrl.includes('127.0.0.1') || gatewayUrl.includes('localhost')
        const gatewayType = isLocalGateway ? 'local' : 'remote'

        console.log('绑定网关:', { gatewayUrl, gatewayId, gatewayType, name })

        // 保存到本地状态
        this.boundGateway = {
          gatewayId,
          gatewayUrl,
          gatewayType,
          status: 'connected',
          name
        }

        // 持久化到localStorage
        localStorage.setItem('bound_gateway', JSON.stringify(this.boundGateway))

        // 同步到云端
        const response = await fetch('/api/gateway/bind', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            gatewayId,
            gatewayUrl,
            gatewayType,
            name
          })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('网关绑定成功:', data)
          return { success: true, data }
        } else {
          console.error('网关绑定失败:', response.status)
          return { success: false, error: '绑定失败' }
        }
      } catch (error) {
        console.error('网关绑定异常:', error)
        return { success: false, error: error.message }
      }
    },

    // 解绑网关
    unbindGateway() {
      this.boundGateway = {
        gatewayId: null,
        gatewayUrl: null,
        gatewayType: null,
        status: 'disconnected',
        name: null
      }
      localStorage.removeItem('bound_gateway')
      console.log('网关已解绑')
    },

    // 检查网关绑定状态
    checkGatewayBinding() {
      const savedGateway = localStorage.getItem('bound_gateway')
      if (savedGateway) {
        try {
          this.boundGateway = JSON.parse(savedGateway)
          console.log('已加载网关绑定信息:', this.boundGateway)
          return true
        } catch (error) {
          console.error('解析网关绑定信息失败:', error)
          return false
        }
      }
      return false
    },

    // 更新网关状态
    updateGatewayStatus(status) {
      this.boundGateway.status = status
      localStorage.setItem('bound_gateway', JSON.stringify(this.boundGateway))
    }
  }
})
