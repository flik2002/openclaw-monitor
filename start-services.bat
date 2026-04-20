@echo off
echo ========================================
echo OpenClaw BigHome 服务启动脚本
echo ========================================
echo.

echo 启动后端服务...
start "OpenClaw Backend" cmd /k "cd /d e:\huawei code\openclaw\BigHome\backend && node src/index.js"
timeout /t 3 /nobreak >nul

echo 启动前端服务...
start "OpenClaw Frontend" cmd /k "cd /d e:\huawei code\openclaw\BigHome\frontend && node node_modules/vite/bin/vite.js"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo 服务已启动！
echo 后端地址: http://localhost:3002
echo 前端地址: http://localhost:5173
echo ========================================
echo.
echo 请在浏览器中访问: http://localhost:5173
echo.
pause
