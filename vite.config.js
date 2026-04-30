import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import startMonitorApiPlugin from './vite-plugins/startMonitorApi.js'

export default defineConfig({
  plugins: [
    vue(),
    startMonitorApiPlugin() // 自动启动HTTP API Wrapper
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // open: '/monitor-v2', // 注释掉，由start-all.bat统一打开浏览器
    proxy: {
      // 网关服务代理 - 解决CORS跨域问题
      '/gateway-api': {
        target: 'http://127.0.0.1:18789',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gateway-api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Gateway proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to Gateway:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from Gateway:', proxyRes.statusCode, req.url);
          });
        }
      },
      // HTTP API Wrapper代理 - 监控数据API
      '/monitor-api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/monitor-api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Monitor API proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to Monitor API:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from Monitor API:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
