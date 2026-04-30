@echo off
chcp 65001 >nul
echo ========================================
echo   OpenClaw 监控系统 - 服务启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 检查 Node.js 环境...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装或未添加到 PATH
    pause
    exit /b 1
)

echo.
echo [2/4] 检查端口占用...
netstat -ano | findstr ":3002" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口 3002 已被占用,正在结束进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002"') do taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 >nul
)

netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口 5173 已被占用,正在结束进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 >nul
)

echo.
echo [3/4] 启动后端服务...
start "OpenClaw Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 >nul

echo.
echo [4/4] 启动前端服务...
start "OpenClaw Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo   服务启动完成!
echo ========================================
echo.
echo 📡 后端服务: http://localhost:3002
echo 🌐 前端服务: http://localhost:5173
echo.
echo 💡 提示:
echo   - 两个服务将在独立窗口中运行
echo   - 关闭窗口将停止对应服务
echo   - 如需自动监控,请运行 start-monitoring.bat
echo.
pause