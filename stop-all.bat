@echo off
echo ========================================
echo   Stopping OpenClaw Monitor System
echo ========================================
echo.

REM 停止所有node进程
echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
pause
