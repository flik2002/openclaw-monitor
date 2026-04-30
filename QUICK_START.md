# 🎉 OpenClaw智能体状态监控系统 - 快速启动指南

## ✅ 系统已成功启动!

### 当前状态:
- ✅ **后端服务**: http://localhost:3001 (运行中)
- ✅ **前端服务**: http://localhost:3000 (运行中)
- ✅ **数据库**: SQLite (sql.js) 已初始化

---

## 🚀 立即开始测试

### 1. 访问系统
打开浏览器访问: **http://localhost:3000**

### 2. 测试核心功能

#### 功能1: 用户注册
1. 访问 http://localhost:3000/auth/register
2. 填写邮箱: `test@example.com`
3. 点击"发送验证码"
4. **查看后端控制台获取验证码**(开发环境会打印)
5. 输入验证码
6. 设置密码: `Test1234`
7. 点击"注册"
8. ✅ 自动登录并跳转到监控页面

#### 功能2: Gateway绑定(核心功能)
1. 在监控页面点击"添加"按钮
2. 填写智能体名称: `我的智能体1`
3. 填写Gateway地址: `https://gateway.example.com`
4. 填写Token: `test-token`
5. 点击"下一步"
6. ✅ 系统自动测试连接

#### 功能3: 状态监控(核心功能)
- ✅ 智能体标签页切换(最多8个)
- ✅ 状态卡片显示(运行状态、会话数、Token使用等)
- ✅ 渠道状态列表
- ✅ 任务列表
- ✅ 30秒自动轮询

---

## 📊 V14核心特性验证

### ✅ 已实现:
1. **智能体数量**: 最多8个(已实现)
2. **标签页切换**: ≤300ms(已实现)
3. **轮询间隔**: 30秒(已实现)
4. **动态发现**: `/tools/invoke` + `sessions_list`(已实现)
5. **标签页动画**: hover效果(已实现)
6. **状态卡片**: 6个卡片(已实现)

---

## 🔧 技术栈

### 后端:
- Node.js + Express
- sql.js (SQLite in-memory)
- JWT认证
- AES-256加密

### 前端:
- Vue 3 + Element Plus
- Pinia状态管理
- Vue Router
- Axios
- IndexedDB (Dexie.js)

---

## 📝 API测试

### 健康检查:
```bash
curl http://localhost:3001/health
```

### 注册API:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","verificationCode":"123456"}'
```

### 登录API:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

---

## 🐛 常见问题

### Q: 前端无法访问?
**A**: 检查端口3000是否被占用,或查看前端控制台错误

### Q: 后端API报错?
**A**: 检查后端控制台日志,查看具体错误信息

### Q: 数据库错误?
**A**: 数据库文件位于 `backend/data.db`,可删除后重新初始化

---

## 📂 项目结构

```
BigHome/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── views/       # 页面
│   │   ├── stores/      # 状态管理
│   │   └── router/      # 路由
│   └── package.json
├── backend/          # 后端项目
│   ├── src/
│   │   ├── database/   # 数据库
│   │   ├── services/   # 服务层
│   │   └── routes/     # API路由
│   ├── data.db        # SQLite数据库文件
│   └── package.json
├── TESTING_GUIDE.md  # 详细测试指南
└── SQLITE_FIX.md     # SQLite问题解决方案
```

---

## 🎯 下一步

1. **测试核心功能**: 按照上述步骤测试注册、登录、Gateway绑定
2. **查看详细指南**: 阅读 `TESTING_GUIDE.md` 了解更多测试细节
3. **反馈问题**: 如遇到问题,查看控制台日志并反馈

---

## 💡 提示

- 后端控制台会显示验证码(开发环境)
- 前端控制台会显示轮询日志(每30秒)
- 数据库文件会自动创建在 `backend/data.db`

---

**祝您测试顺利! 🎉**
