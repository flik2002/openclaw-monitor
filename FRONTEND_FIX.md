# 🚨 前端无法访问问题 - 解决方案

## 问题现象
访问 http://localhost:3000 提示无法连接

## 可能原因
1. 前端服务未正常启动
2. 端口3000被其他程序占用
3. Node.js进程权限问题

## 解决方案

### 方案1: 使用启动脚本(推荐)

我已为您创建了启动脚本 `start.bat`,请按以下步骤操作:

1. **关闭所有Node.js进程**:
   - 打开任务管理器(Ctrl+Shift+Esc)
   - 找到所有"Node.js JavaScript Runtime"进程
   - 右键 → 结束任务

2. **运行启动脚本**:
   - 双击 `start.bat` 文件
   - 会自动打开两个命令行窗口(后端和前端)
   - 等待几秒钟让服务完全启动

3. **访问系统**:
   - 打开浏览器访问: http://localhost:3000

### 方案2: 手动启动

1. **关闭所有Node.js进程**:
   ```powershell
   # 在PowerShell中执行
   Get-Process -Name node | Stop-Process -Force
   ```

2. **启动后端**:
   ```bash
   cd backend
   npm run dev
   ```
   等待看到: `🚀 OpenClaw 监控系统后端服务已启动`

3. **启动前端(新终端)**:
   ```bash
   cd frontend
   npm run dev
   ```
   等待看到: `Local: http://localhost:3000/`

4. **访问系统**:
   打开浏览器访问: http://localhost:3000

### 方案3: 检查端口占用

如果3000端口被占用:

```powershell
# 查看占用3000端口的进程
netstat -ano | findstr :3000

# 如果有进程占用,记下PID,然后结束进程
taskkill /PID <PID> /F
```

### 方案4: 更改前端端口

如果3000端口持续被占用,可以修改前端端口:

编辑 `frontend/vite.config.js`:

```javascript
server: {
  port: 3002,  // 改为其他端口
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

然后访问: http://localhost:3002

## 验证服务状态

### 检查后端:
```bash
curl http://localhost:3001/health
```
应该返回: `{"status":"ok",...}`

### 检查前端:
```bash
curl http://localhost:3000
```
应该返回HTML内容

## 常见错误

### 错误1: "Cannot find module"
**原因**: 依赖未安装
**解决**:
```bash
cd frontend
npm install
```

### 错误2: "Port 3000 is already in use"
**原因**: 端口被占用
**解决**: 使用方案3或方案4

### 错误3: "Access is denied"
**原因**: 进程权限问题
**解决**: 以管理员身份运行命令提示符

## 下一步

1. 先尝试**方案1**(使用启动脚本)
2. 如果仍然失败,尝试**方案2**(手动启动)
3. 如果端口被占用,使用**方案3**或**方案4**

启动成功后,请访问: http://localhost:3000
