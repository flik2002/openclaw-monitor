import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useUserStore } from './stores/userStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(i18n)

// 初始化用户认证状态
const userStore = useUserStore()
userStore.checkAuth()

app.mount('#app')
