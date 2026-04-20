@echo off
echo ========================================
echo 重启后端服务
echo ========================================

echo 正在查找后端服务进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002"') do (
    echo 找到进程 PID: %%a
    echo 正在结束进程...
    taskkill /F /PID %%a
    if errorlevel 1 (
        echo 结束进程失败，可能需要管理员权限
        echo 请手动结束进程或使用管理员权限运行此脚本
        pause
        exit /b 1
    )
)

echo 等待端口释放...
timeout /t 3 /nobreak > nul

echo 正在启动后端服务...
cd backend
start /B npm start

echo 后端服务启动中，请稍候...
timeout /t 5 /nobreak > nul

echo 验证后端服务状态...
curl http://localhost:3002/health

if errorlevel 1 (
    echo 后端服务启动失败
    pause
    exit /b 1
)

echo ========================================
echo 后端服务重启成功!
echo ========================================
pause