@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 20 or newer, then run this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :error
)
echo Building Flâneur...
call npm run build
if errorlevel 1 goto :error
start "" http://localhost:8787
echo Starting Flâneur at http://localhost:8787
call npm start
exit /b 0
:error
echo Setup failed. Review the error messages above.
pause
exit /b 1
