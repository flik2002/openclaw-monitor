# OpenClaw 智能体状态监控系统

## 项目简介

本系统是一个纯展示型 Web 系统,用于展示用户 OpenClaw 智能体的实时运行状态。采用前后端分离架构,前端使用 Vue3,后端使用 Node.js+Express+SQLite。

## 核心特性

- ✅ **数据透传**:所有 OpenClaw 状态数据通过前端直接从用户 Gateway 获取,后端不存储、不介入
- ✅ **本地存储**:历史数据存储在用户浏览器 IndexedDB,用户可自主管理
- ✅ **动态发现**:绑定 Gateway 后自动发现智能体和渠道,无需手动配置
- ✅ **标签页切换**:顶部标签页方式切换智能体视图,最多支持 8 个智能体
- ✅ **实时监控**:30 秒轮询更新智能体状态和渠道状态
- ✅ **KBI 图表**:任务完成率趋势、渠道消息分布、响应速度对比、资源使用分布

## 技术栈

### 前端
- Vue 3.3.11+
- Element Plus 2.4.4+
- ECharts 5.4.3+
- Vue-I18n 9.8.0+
- Pinia 2.1.0+
- Vue Router 4.2.0+
- Axios 1.6.0+
- Dexie.js 3.2.0+

### 后端
- Node.js 18.0+
- Express 4.18.0+
- SQLite3 5.1.0+
- bcrypt 5.1.0+
- jsonwebtoken 9.0.0+
- crypto-js 4.2.0+
- nodemailer 6.9.0+

## 项目结构

```
BigHome/
├── frontend/          # 前端项目
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   └── package.json  # 依赖配置
├── backend/          # 后端项目
│   ├── src/          # 源代码
│   └── package.json  # 依赖配置
├── .codeartsdoer/    # SDD 文档
│   └── specs/
│       └── openclaw_monitor/
│           ├── spec.md      # 需求规格文档
│           ├── design.md    # 技术设计文档
│           └── tasks.md     # 任务规划文档
└── README.md         # 项目说明
```

## 快速开始

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 后端启动
```bash
cd backend
npm install
npm start
```

## 文档

- [需求规格文档](.codeartsdoer/specs/openclaw_monitor/spec.md)
- [技术设计文档](.codeartsdoer/specs/openclaw_monitor/design.md)
- [任务规划文档](.codeartsdoer/specs/openclaw_monitor/tasks.md)

## 版本信息

- **当前版本**: V14 (标签页版)
- **更新日期**: 2026-03-23

## 许可证

MIT License
