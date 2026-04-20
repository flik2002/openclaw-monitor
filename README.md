# OpenClaw Monitor System

A real-time monitoring dashboard for OpenClaw Agent status, featuring session tracking, token usage statistics, and message trends visualization.

## Features

- **Real-time Monitoring**: Live status of OpenClaw Gateway and sessions
- **Token Statistics**: Track total tokens, prompt tokens, and completion tokens
- **Session Management**: View active sessions with model info and runtime
- **Message Trends**: 7-day message statistics with daily breakdown
- **System Metrics**: Uptime tracking and memory usage display

## Tech Stack

### Frontend
- Vue 3 + Vite
- Element Plus UI
- ECharts for visualization

### Backend (Monitor API)
- Node.js + Express
- WebSocket client for Gateway connection
- File-based session data reading

## Project Structure

```
BigHome/
├── frontend/              # Vue 3 frontend application
│   ├── src/               # Source code
│   ├── public/            # Static files (monitor-ui-v2.html)
│   └── vite.config.js     # Vite configuration with proxy
├── openclaw-monitor/      # Monitor API server
│   ├── server.js          # Main API server
│   ├── gateway-client.js  # WebSocket client for Gateway
│   ├── .env               # Configuration file
│   └── package.json       # Dependencies
├── start-all.bat          # Start all services (Windows)
├── stop-all.bat           # Stop all services (Windows)
└── README.md              # This file
```

## Quick Start

### Prerequisites

1. **Node.js** 18+ installed
2. **OpenClaw Gateway** running on port 18789
3. **OpenClaw data directory** configured (default: `%APPDATA%\SPB_Data\.openclaw`)

### Configuration

Edit `openclaw-monitor/.env` to match your environment:

```env
OPENCLAW_TOKEN=your_token_here
OPENCLAW_WORKSPACE=C:\Users\YourUser\AppData\Roaming\SPB_Data\.openclaw\workspace
OPENCLAW_DATA_DIR=C:\Users\YourUser\AppData\Roaming\SPB_Data\.openclaw
MONITOR_PORT=3000
GATEWAY_HOST=127.0.0.1
GATEWAY_PORT=18789
```

### Start Services

**Windows (Recommended):**
```bash
# Double-click or run in command prompt:
start-all.bat
```

This will:
1. Start Monitor API server on port 3000
2. Start Frontend dev server on port 5173
3. Open browser to http://localhost:5173/monitor-v2

**Manual Start:**
```bash
# Terminal 1: Start Monitor API
cd openclaw-monitor
npm install
node server.js

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev

# Open browser: http://localhost:5173/monitor-v2
```

### Stop Services

**Windows:**
```bash
# Double-click or run:
stop-all.bat
```

**Manual:**
Press `Ctrl+C` in each terminal window.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/gateway/status` | Gateway connection status |
| `GET /api/sessions/list` | List all sessions with token stats |
| `GET /api/metrics/system` | System uptime and metrics |
| `GET /api/metrics/memory` | Memory usage |
| `GET /api/messages/stats` | Message statistics with 7-day trend |
| `GET /api/models/current` | Current model information |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Browser       │────▶│   Frontend      │────▶│   Monitor API   │
│ localhost:5173  │     │   (Vite Dev)    │     │   localhost:3000│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────────────┐
                        │                               │                               │
                        ▼                               ▼                               ▼
                ┌───────────────┐             ┌───────────────┐             ┌───────────────┐
                │   Gateway     │             │  Sessions     │             │  History      │
                │  WebSocket    │             │  JSON File    │             │  .reset Files │
                │  port 18789   │             │               │             │               │
                └───────────────┘             └───────────────┘             └───────────────┘
```

## Troubleshooting

### Monitor shows all zeros

1. Check if Monitor API is running: `http://localhost:3000/health`
2. Check if Gateway is running: `netstat -an | findstr 18789`
3. Check if data directory exists in `.env`
4. Restart services using `stop-all.bat` then `start-all.bat`

### "require is not defined" error

This means `openclaw-monitor/package.json` is missing. Make sure it exists with `"type": "commonjs"`.

### Frontend proxy errors

Check `frontend/vite.config.js` has both `/api` and `/monitor-api` proxy configurations.

## Version

- **Version**: 1.0.0
- **Last Updated**: 2026-04-20

## License

MIT License
