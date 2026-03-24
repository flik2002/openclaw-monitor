@echo off
echo ========================================
echo OpenClaw 智能体状态监控系统启动脚本
echo ========================================
echo.
echo 注意: 此脚本使用不同端口,不会影响您现有的OpenClaw进程
echo.

echo [1/2] 启动后端服务 (端口3002)...
cd backend
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [2/2] 启动前端服务 (端口5173)...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo 启动完成!
echo ========================================
echo.
echo 后端地址: http://localhost:3002
echo 前端地址: http://localhost:5173
echo.
echo 请等待几秒钟让服务完全启动...
echo 然后打开浏览器访问: http://localhost:5173
echo.
echo 您的OpenClaw进程不受影响,继续正常运行
echo.
pause
