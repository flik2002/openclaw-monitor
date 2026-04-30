@echo off
echo Starting OpenClaw Frontend Service...
cd /d "%~dp0frontend"
echo Current directory: %CD%
echo.
echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
echo.
echo Starting frontend service...
echo.
echo ========================================
echo Frontend service will start on port 5173
echo ========================================
echo.
npm run dev
pause
