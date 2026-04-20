@echo off
echo ========================================
echo   Starting OpenClaw Monitor System
echo ========================================
echo.

REM Start HTTP API Wrapper
echo [1/3] Starting HTTP API Wrapper...
cd /d "%~dp0openclaw-monitor"
start "OpenClaw Monitor API" /min cmd /c "node server.js"
timeout /t 2 /nobreak >nul

REM Start Frontend Dev Server
echo [2/3] Starting Frontend Dev Server...
cd /d "%~dp0frontend"
start "OpenClaw Frontend" cmd /c "npm run dev"

REM Wait for frontend server to start
echo [3/3] Waiting for frontend server to start...
timeout /t 5 /nobreak >nul

REM Open browser automatically
echo.
echo Opening browser...
start http://localhost:5173/monitor-v2

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo - HTTP API Wrapper: http://localhost:3000
echo - Frontend Dev Server: http://localhost:5173
echo - Monitor Page: http://localhost:5173/monitor-v2
echo.
echo Browser opened automatically!
echo.
echo Press any key to exit this window
echo (Services will keep running in separate windows)
pause >nul
