import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    email: null,
    role: null,
    token: null,
    isLoggedIn: false
  }),

  getters: {
    isAdmin: (state) => state.role === 'admin',
    isRegisteredUser: (state) => state.role === 'registered_user' || state.role === 'admin',
    isGuest: (state) => !state.isLoggedIn
  },

  actions: {
    // 登录
    login(userData) {
      this.userId = userData.userId
      this.email = userData.email
      this.role = userData.role
      this.token = userData.token
      this.isLoggedIn = true

      // 保存到LocalStorage
      localStorage.setItem('token', userData.token)
      localStorage.setItem('userId', userData.userId)
      localStorage.setItem('userEmail', userData.email)
      localStorage.setItem('userRole', userData.role)
    },

    // 登出
    logout() {
      this.userId = null
      this.email = null
      this.role = null
      this.token = null
      this.isLoggedIn = false

      // 清除LocalStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userRole')
    },

    // 检查认证状态
    checkAuth() {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const email = localStorage.getItem('userEmail')
      const role = localStorage.getItem('userRole')

      if (token && userId && email && role) {
        this.userId = userId
        this.email = email
        this.role = role
        this.token = token
        this.isLoggedIn = true
        return true
      }

      return false
    }
  }
})
