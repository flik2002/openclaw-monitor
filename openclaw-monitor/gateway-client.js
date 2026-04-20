// gateway-client.js
require('dotenv').config();
const WebSocket = require('ws');

class OpenClawGatewayClient {
  constructor(token) {
    this.ws = null;
    this.token = token;
    this.reconnectInterval = 5000;
    this.callbacks = new Map();
    this.messageId = 0;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const url = `ws://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}?token=${this.token}`;
      
      console.log(`[GatewayClient] Connecting to ${url}`);
      
      this.ws = new WebSocket(url);
      let resolved = false;

      this.ws.on('open', () => {
        console.log('[GatewayClient] ✅ Connected to OpenClaw Gateway');
        if (!resolved) { resolved = true; resolve(); }
      });

      this.ws.on('error', (err) => {
        console.error('[GatewayClient] ❌ WebSocket error:', err.message);
        // 不reject，允许服务继续运行
        if (!resolved) { resolved = true; resolve(); }
      });

      this.ws.on('close', () => {
        console.log('[GatewayClient] 🔄 Disconnected, attempting reconnect in 5s...');
        setTimeout(() => {
          this.connect().catch(err => {
            console.error('[GatewayClient] Reconnect failed:', err.message);
          });
        }, this.reconnectInterval);
      });

      this.ws.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          const callback = this.callbacks.get(parsed.id);
          if (callback) {
            this.callbacks.delete(parsed.id);
            if (parsed.error) {
              callback.reject(parsed.error);
            } else {
              callback.resolve(parsed.result);
            }
          }
        } catch (e) {
          console.error('[GatewayClient] Failed to parse message:', e.message);
        }
      });
    });
  }

  async send(method, params = {}) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const id = ++this.messageId;
      const message = JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params
      });

      const timeout = setTimeout(() => {
        this.callbacks.delete(id);
        reject(new Error('Request timeout'));
      }, 10000);

      this.callbacks.set(id, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });

      this.ws.send(message);
    });
  }

  // =====================
  // Public API Methods
  // =====================

  async listSessions() {
    return this.send('sessions.list', {});
  }

  async sessionStatus(key) {
    return this.send('session.status', { key });
  }

  async getCronJobs() {
    return this.send('cron.list', {});
  }

  async getTasks() {
    return this.send('tasks.list', {});
  }

  async getSystemMetrics() {
    return this.send('metrics.system', {});
  }

  async getMessageStats() {
    return this.send('metrics.messages', {});
  }

  // 健康检查
  async ping() {
    return this.send('gateway.ping', {});
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

module.exports = OpenClawGatewayClient;
