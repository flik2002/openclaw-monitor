import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vite插件：自动启动HTTP API Wrapper服务
 */
export default function startMonitorApiPlugin() {
  let monitorProcess = null;

  return {
    name: 'start-monitor-api',
    
    // 开发服务器启动时
    configureServer(server) {
      console.log('\n🚀 [Monitor API Plugin] Starting HTTP API Wrapper...\n');
      
      // 启动HTTP API Wrapper
      const monitorPath = path.resolve(__dirname, '../../openclaw-monitor');
      const serverPath = path.join(monitorPath, 'server.js');
      
      monitorProcess = spawn('node', [serverPath], {
        cwd: monitorPath,
        stdio: 'inherit', // 继承标准输出，显示日志
        shell: true
      });

      monitorProcess.on('error', (err) => {
        console.error('❌ [Monitor API Plugin] Failed to start:', err.message);
      });

      monitorProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          console.warn(`⚠️  [Monitor API Plugin] Process exited with code ${code}`);
        }
      });

      // 等待服务启动
      setTimeout(() => {
        console.log('✅ [Monitor API Plugin] HTTP API Wrapper started on port 3000\n');
      }, 2000);
    },

    // 开发服务器关闭时
    closeBundle() {
      if (monitorProcess) {
        console.log('\n🛑 [Monitor API Plugin] Stopping HTTP API Wrapper...\n');
        monitorProcess.kill();
      }
    }
  };
}
