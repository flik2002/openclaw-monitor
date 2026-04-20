@echo off
echo Starting OpenClaw Monitor API Wrapper...
cd /d "%~dp0"
start /B node server.js
echo Service started on port 3000
echo Press any key to exit this window (service will keep running)
pause >nul
