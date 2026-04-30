@echo off
chcp 65001 >nul
echo === OpenClaw 服务监控 ===
echo.
echo 此脚本将监控前后端服务状态
echo 如果服务停止会自动重启
echo.
echo 按 Ctrl+C 可以停止监控
echo.
pause
powershell -ExecutionPolicy Bypass -File monitor-services.ps1