@echo off
echo Starting Backend Service...
cd /d "%~dp0backend"
node src/index.js
pause
