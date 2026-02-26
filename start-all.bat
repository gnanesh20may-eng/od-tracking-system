@echo off
setlocal
echo Attempting to free ports 3000 and 5000 (if any processes are listening)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (
  echo Killing PID %%a on port 5000
  taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
  echo Killing PID %%a on port 3000
  taskkill /PID %%a /F >nul 2>&1
)

echo Starting backend in new window...
start cmd /k "cd /d "%~dp0backend" && npm start"

echo Starting frontend in new window...
start cmd /k "cd /d "%~dp0frontend" && npm start"

timeout /t 2 >nul
echo Opening http://localhost:3000
start "" "http://localhost:3000"

endlocal
exit /b 0
