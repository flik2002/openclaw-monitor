@echo off
echo Starting Frontend Service...
cd /d "%~dp0frontend"
npm run dev
pause
