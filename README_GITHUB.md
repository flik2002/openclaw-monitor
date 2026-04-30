帮# OpenClaw 智能体状态监控系统 - 前端

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.3.11-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.10-brightgreen.svg)](https://vitejs.dev/)

## 项目简介

OpenClaw 智能体状态监控系统是一个现代化的前端应用，用于实时监控和管理智能体状态。基于 Vue 3 + Vite 构建，提供直观的用户界面和强大的数据可视化功能。

## 功能特性

- ✅ **实时监控** - 实时显示智能体状态和任务进度
- ✅ **多网关管理** - 支持多个网关连接和账户管理
- ✅ **数据可视化** - 使用 ECharts 提供丰富的图表展示
- ✅ **国际化支持** - 支持中文和英文切换
- ✅ **本地存储** - 使用 Dexie (IndexedDB) 进行本地数据持久化
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **用户认证** - 完整的登录、注册、密码重置功能

## 技术栈

- **框架**: Vue 3.3.11
- **构建工具**: Vite 5.0.10
- **UI 组件库**: Element Plus 2.4.4
- **状态管理**: Pinia 2.1.7
- **路由**: Vue Router 4.2.5
- **HTTP 客户端**: Axios 1.6.2
- **图表库**: ECharts 5.4.3
- **本地数据库**: Dexie 3.2.4
- **国际化**: Vue I18n 9.8.0

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 资源文件
│   ├── components/     # 组件
│   │   ├── common/    # 通用组件
│   │   ├── gateway/   # 网关相关组件
│   │   ├── layout/    # 布局组件
│   │   └── monitor/   # 监控相关组件
│   ├── config/        # 配置文件
│   ├── i18n/          # 国际化
│   │   └── locales/   # 语言文件
│   ├── router/        # 路由配置
│   ├── services/      # 服务层
│   ├── stores/        # 状态管理
│   ├── utils/         # 工具函数
│   └── views/         # 页面视图
│       ├── admin/     # 管理页面
│       ├── auth/      # 认证页面
│       ├── legal/     # 法律条款页面
│       └── monitor/   # 监控页面
├── .env.example       # 环境变量示例
├── .gitignore         # Git 忽略文件
├── index.html         # 入口 HTML
├── LICENSE            # 许可证
├── package.json       # 项目配置
├── README.md          # 项目说明
└── vite.config.js     # Vite 配置
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 环境变量

创建 `.env` 文件并配置以下变量：

```env
VITE_API_BASE_URL=http://your-api-url
VITE_APP_TITLE=OpenClaw Monitor
```

## 主要功能说明

### 1. 监控页面

- 实时显示智能体状态
- 任务列表和进度跟踪
- 频道列表管理
- 状态卡片展示

### 2. 网关管理

- 多网关连接支持
- 账户绑定向导
- 连接测试功能
- 多账户管理

### 3. 用户认证

- 用户注册
- 用户登录
- 密码重置
- 认证状态管理

### 4. 国际化

- 中文 (zh-CN)
- 英文 (en-US)
- 自动语言检测

## 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化

### 提交规范

- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具相关

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

[MIT License](LICENSE)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 联系方式

- 项目主页: [GitHub Repository URL]
- 问题反馈: [GitHub Issues URL]

## 致谢

感谢所有贡献者和开源社区的支持！
