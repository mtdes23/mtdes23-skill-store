@echo off
chcp 65001 >nul
title SKILLVAULT AI - Cho Ban Skills Antigravity & Claude
echo ========================================================
echo       KHOI DONG WEBSITE BAN SKILLS (VIETQR PAY)
echo ========================================================
echo.
cd /d "%~dp0"
echo [1/2] Dang khoi dong Web Server tai cong 8080...
start "" "http://localhost:8080"
python server.py
pause
