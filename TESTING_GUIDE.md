# OpenClaw智能体状态监控系统 - 测试指南

## 一、环境准备

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 2. 配置环境变量

创建 `backend/.env` 文件:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key-change-in-production
ENCRYPTION_KEY=your-32-character-encryption-key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

### 3. 启动服务

```bash
# 启动后端
cd backend
npm run dev

# 启动前端(新终端)
cd frontend
npm run dev
```

访问: http://localhost:5173

## 二、功能测试流程

### 测试1: 用户注册和登录

#### 1.1 注册新用户
1. 访问 http://localhost:5173/auth/register
2. 填写邮箱(如: test@example.com)
3. 填写手机号(可选,如: 13800138000)
4. 点击"发送验证码"
5. 查看后端控制台获取验证码(开发环境会打印)
6. 输入验证码
7. 设置密码(至少8位,包含字母和数字)
8. 点击"注册"
9. **预期结果**: 注册成功,自动登录,跳转到监控页面

#### 1.2 登录测试
1. 访问 http://localhost:5173/auth/login
2. 输入注册的邮箱和密码
3. 点击"登录"
4. **预期结果**: 登录成功,跳转到监控页面

### 测试2: Gateway绑定(核心功能)

#### 2.1 绑定Gateway
1. 在监控页面点击"添加"按钮
2. 填写智能体名称(如: "我的智能体1")
3. 填写Gateway地址(如: https://gateway.example.com)
4. 填写Token
5. 点击"下一步"
6. **预期结果**: 自动测试连接,显示连接状态

#### 2.2 动态发现智能体(V14特性)
- 绑定成功后,系统会自动调用 `/tools/invoke` + `sessions_list`
- 发现的智能体会显示在标签页中
- **预期结果**: 显示"已发现 X 个智能体"

### 测试3: 状态监控(核心功能)

#### 3.1 智能体标签页切换
1. 绑定多个Gateway(最多8个)
2. 点击不同标签页
3. **预期结果**:
   - 标签页切换时间 ≤ 300ms
   - 切换时有平滑动画
   - 当前标签页高亮显示

#### 3.2 状态卡片显示
每个智能体显示6个状态卡片:
- 运行状态(运行中/离线/忙碌)
- 会话数(含趋势)
- Token使用(进度条)
- 在线时长
- 内存占用
- 消息统计

#### 3.3 渠道状态列表
显示所有渠道的:
- 渠道名称
- 连接状态(已连接/断开/异常/未配置)
- 消息统计
- 最后活跃时间

#### 3.4 任务列表
显示所有任务的:
- 任务ID
- 任务名称
- 状态(运行中/已完成/失败/等待中)
- 进度条
- 开始/结束时间

#### 3.5 实时数据轮询(V14特性)
- 系统每30秒自动轮询所有Gateway状态
- 打开浏览器控制台,查看轮询日志
- **预期结果**: 每30秒输出"轮询状态更新"日志

### 测试4: 访客模式

#### 4.1 未登录访问
1. 清除LocalStorage中的token
2. 访问 http://localhost:5173
3. **预期结果**:
   - 可以访问监控页面
   - 显示"未绑定Gateway"提示
   - 可以查看公告和广告

#### 4.2 登录后功能
1. 登录后可以绑定Gateway
2. 可以查看实时状态
3. 可以解绑Gateway

## 三、API测试(使用Postman或curl)

### 3.1 注册API
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test1234",
  "verificationCode": "123456"
}
```

### 3.2 登录API
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test1234"
}
```

### 3.3 发送验证码API
```bash
POST http://localhost:3001/api/auth/send-verification
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 3.4 绑定Gateway API
```bash
POST http://localhost:3001/api/gateway/bind
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "agentName": "我的智能体",
  "gatewayUrl": "https://gateway.example.com",
  "token": "your-gateway-token"
}
```

### 3.5 测试Gateway连接API
```bash
POST http://localhost:3001/api/gateway/test
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "gatewayUrl": "https://gateway.example.com",
  "token": "your-gateway-token"
}
```

### 3.6 获取Gateway列表API
```bash
GET http://localhost:3001/api/gateway/list
Authorization: Bearer YOUR_TOKEN
```

### 3.7 解绑Gateway API
```bash
DELETE http://localhost:3001/api/gateway/unbind/GATEWAY_ID
Authorization: Bearer YOUR_TOKEN
```

## 四、V14特性验证清单

- [ ] 智能体数量最多8个(尝试绑定第9个应失败)
- [ ] 标签页切换时间 ≤ 300ms
- [ ] 状态轮询间隔为30秒
- [ ] 绑定Gateway时自动调用 `/tools/invoke` + `sessions_list`
- [ ] 标签页有hover动画效果
- [ ] 状态卡片有hover阴影效果

## 五、常见问题排查

### 问题1: 前端无法连接后端
**解决方案**:
- 检查后端是否启动(端口3001)
- 检查前端vite.config.js的proxy配置

### 问题2: 登录后Token未保存
**解决方案**:
- 打开浏览器开发者工具 → Application → Local Storage
- 检查是否有token项
- 检查userStore的login方法是否正确执行

### 问题3: Gateway绑定失败
**解决方案**:
- 检查Gateway地址是否正确
- 检查Token是否有效
- 查看后端日志获取详细错误信息

### 问题4: 状态数据不更新
**解决方案**:
- 检查pollingService是否启动
- 查看浏览器控制台是否有轮询日志
- 检查Gateway是否在线

## 六、性能测试

### 6.1 标签页切换性能
使用Chrome DevTools Performance面板:
1. 录制标签页切换操作
2. 检查切换时间是否 ≤ 300ms
3. 检查是否有卡顿

### 6.2 轮询性能
1. 绑定8个Gateway
2. 观察每30秒的轮询耗时
3. **预期结果**: 单次轮询耗时 < 5秒

## 七、测试数据准备

### 模拟Gateway数据
如果暂时没有真实的Gateway,可以修改后端代码返回模拟数据:

在 `backend/src/services/GatewayService.js` 的 `testConnection` 方法中:

```javascript
async testConnection(gatewayUrl, token) {
  // 模拟测试数据
  return {
    connected: true,
    latency: Math.floor(Math.random() * 100),
    message: '连接测试成功'
  }
}
```

在 `discoverAgents` 方法中:

```javascript
async discoverAgents(gatewayUrl, token) {
  // 模拟智能体数据
  return [
    { id: '1', name: '智能体1', status: 'running' },
    { id: '2', name: '智能体2', status: 'idle' }
  ]
}
```

## 八、下一步开发

当前已完成核心监控功能,后续可继续开发:
- KBI图表模块(阶段九)
- 本地存储管理(阶段十)
- 页面样式优化(阶段十二)
- 集成测试(阶段十三)
- 部署配置(阶段十四)
