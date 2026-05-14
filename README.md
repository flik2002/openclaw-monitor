# OpenClaw Monitor

> AI monitors AI — Free open-source monitoring dashboard for OpenClaw agents.

[![Stars](https://img.shields.io/github/stars/flik2002/openclaw-monitor?style=social)](https://github.com/flik2002/openclaw-monitor)
[![Forks](https://img.shields.io/github/forks/flik2002/openclaw-monitor?style=social)](https://github.com/flik2002/openclaw-monitor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Demo Screenshot

![OpenClaw Monitor](Openclaw%20Monitor.jpg)

<!-- Add a GIF demo here: record your screen showing the dashboard in action, -->
<!-- save as demo.gif, and uncomment the line below: -->
<!-- ![Demo](demo.gif) -->

## Features

- **Cron Task Scheduler** — Visualize AI agent task scheduling at a glance
- **Token Usage Tracking** — 7-day bar chart of prompt/completion tokens per model
- **Multi-Model Support** — Claude Code, OpenAI Codex, DeepSeek V4, and more
- **Real-time Sessions** — Live session list with model, runtime, and status
- **7-Day Message Trends** — Daily message count breakdown with ECharts
- **System Metrics** — Uptime and memory usage monitoring

## Tech Stack

- **Frontend**: Vue 3 + Vite + Element Plus + ECharts
- **Backend**: Node.js + Express + WebSocket client
- **Data**: Local session JSON files (no cloud, fully offline)

## Project Structure

```
openclaw-monitor/
├── frontend/              # Vue 3 dashboard
│   ├── src/
│   └── vite.config.js
├── backend/               # Monitor API server
│   └── src/
├── openclaw-monitor/      # Monitor helper scripts
├── start-all.bat          # Windows one-click start
└── stop-all.bat           # Windows stop
```

## Quick Start

### Prerequisites

- Node.js 18+
- OpenClaw Gateway running on port 18789

### One-Click Start (Windows)

```bash
start-all.bat
```

### Manual Start

```bash
# Terminal 1: Monitor API (port 3000)
cd backend && npm install && npm start

# Terminal 2: Frontend (port 5173)
cd frontend && npm install && npm run dev

# Open: http://localhost:5173/monitor-v2
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/gateway/status` | Gateway connection status |
| `GET /api/sessions/list` | All sessions with token stats |
| `GET /api/metrics/system` | System uptime and memory |
| `GET /api/messages/stats` | 7-day message trend |
| `GET /api/models/current` | Current model info |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Frontend   │────▶│  Monitor API │
│localhost:5173│     │  (Vue 3)     │     │  localhost:3000
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                          ┌───────────────────────┼───────────────────────┐
                          │                       │                       │
                          ▼                       ▼                       ▼
                  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
                  │   Gateway    │       │   Sessions   │       │   History    │
                  │  WebSocket  │       │  JSON Files  │       │  .reset Files│
                  │  port 18789 │       │              │       │              │
                  └──────────────┘       └──────────────┘       └──────────────┘
```

## License

MIT — use freely, contribute welcome!
