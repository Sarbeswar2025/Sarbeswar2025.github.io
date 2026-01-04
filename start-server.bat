@echo off
setlocal

set PORT=5500
set ROOT=%~dp0

REM Kill anything currently listening on %PORT%
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":%PORT% .*LISTENING"') do (
  echo Stopping process on %PORT%: PID=%%P
  taskkill /F /PID %%P >nul 2>nul
)

cd /d "%ROOT%"
echo.
echo Serving from: %ROOT%
echo Open in browser:
echo   http://127.0.0.1:%PORT%/
echo   http://%COMPUTERNAME%:%PORT%/   (sometimes works on LAN)
echo.
echo LAN (phone on same Wi-Fi):
echo   Use your IPv4 from: ipconfig
echo   Example: http://192.168.x.x:%PORT%/
echo.

start "" http://127.0.0.1:%PORT%/
python -m http.server %PORT% --bind 0.0.0.0
