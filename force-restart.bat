@echo off
chcp 65001 >nul
echo ========================================
echo   强制清理并重启所有服务
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 停止所有Node进程...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo [2/5] 清理前端缓存...
cd frontend
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo 已删除 .vite 缓存
)
if exist dist (
    rmdir /s /q dist
    echo 已删除 dist 目录
)
cd ..

echo.
echo [3/5] 启动后端服务...
start "OpenClaw Backend" cmd /k "cd backend && npm run dev"
timeout /t 5 >nul

echo.
echo [4/5] 启动前端服务...
start "OpenClaw Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 5 >nul

echo.
echo [5/5] 检查服务状态...
netstat -ano | findstr ":3002" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务已启动 (端口 3002)
) else (
    echo ❌ 后端服务启动失败
)

netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务已启动 (端口 5173)
) else (
    echo ❌ 前端服务启动失败
)

echo.
echo ========================================
echo   重启完成!
echo ========================================
echo.
echo 📡 后端服务: http://localhost:3002
echo 🌐 前端服务: http://localhost:5173
echo.
echo 💡 重要提示:
echo   1. 在浏览器中按 Ctrl+Shift+Delete 清理缓存
echo   2. 或按 F12 打开开发者工具
echo   3. 右键点击刷新按钮,选择"清空缓存并硬性重新加载"
echo   4. 访问诊断页面: http://localhost:5173/test-api.html
echo.
pause