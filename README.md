# OpenClaw Agent Status Monitoring System

## Project Overview

This system is a display-only Web application designed to showcase real-time running status of user's OpenClaw agents. It adopts a frontend-backend separated architecture, using Vue3 for frontend and Node.js + Express + SQLite for backend.

## Core Features

- ✅ **Data Passthrough**: All OpenClaw status data is fetched directly from user's Gateway by the frontend, with no storage or intervention from the backend
- ✅ **Local Storage**: Historical data is stored in user's browser IndexedDB, allowing users to manage it independently
- ✅ **Dynamic Discovery**: Automatically discover agents and channels after binding Gateway, no manual configuration needed
- ✅ **Tab Switching**: Switch between agent views using top tabs, supporting up to 8 agents
- ✅ **Real-time Monitoring**: 30-second polling updates for agent status and channel status
- ✅ **KBI Charts**: Task completion rate trends, channel message distribution, response speed comparison, resource usage distribution

## Tech Stack

### Frontend
- Vue 3.3.11+
- Element Plus 2.4.4+
- ECharts 5.4.3+
- Vue-I18n 9.8.0+
- Pinia 2.1.0+
- Vue Router 4.2.0+
- Axios 1.6.0+
- Dexie.js 3.2.0+

### Backend
- Node.js 18.0+
- Express 4.18.0+
- SQLite3 5.1.0+
- bcrypt 5.1.0+
- jsonwebtoken 9.0.0+
- crypto-js 4.2.0+
- nodemailer 6.9.0+

## Project Structure

```
BigHome/
├── frontend/          # Frontend project
│   ├── src/          # Source code
│   ├── public/       # Static resources
│   └── package.json  # Dependency configuration
├── backend/          # Backend project
│   ├── src/          # Source code
│   └── package.json  # Dependency configuration
├── .codeartsdoer/    # SDD documents
│   └── specs/
│       └── openclaw_monitor/
│           ├── spec.md      # Requirements specification
│           ├── design.md    # Technical design document
│           └── tasks.md     # Task planning document
└── README.md         # Project documentation
```

## Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

## Documentation

- [Requirements Specification](.codeartsdoer/specs/openclaw_monitor/spec.md)
- [Technical Design Document](.codeartsdoer/specs/openclaw_monitor/design.md)
- [Task Planning Document](.codeartsdoer/specs/openclaw_monitor/tasks.md)

## Version Information

- **Current Version**: V14 (Tab Edition)
- **Last Updated**: 2026-03-23

## License

MIT License
