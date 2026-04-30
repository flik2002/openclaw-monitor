@echo off
chcp 65001 >nul
echo =========================================
echo   Upload auth.js to Cloud ECS
echo =========================================
echo.

REM Configuration - Correct paths found on cloud ECS
set CLOUD_USER=root
set CLOUD_HOST=47.109.47.116
set CLOUD_PATH=/var/www/biglegs-backend/backend/src/routes

echo [1/2] Uploading auth.js...
echo Note: You will be prompted for root password
scp backend\src\routes\auth.js %CLOUD_USER%@%CLOUD_HOST%:%CLOUD_PATH%/

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Upload failed
    pause
    exit /b 1
)

echo [OK] Upload successful
echo.

echo [2/2] Restarting backend service...
ssh %CLOUD_USER%@%CLOUD_HOST% "pm2 restart biglegs-backend"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Restart failed
    pause
    exit /b 1
)

echo [OK] Restart successful
echo.
echo =========================================
echo   Deployment completed!
echo =========================================
pause
