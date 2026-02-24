@echo off
REM OD System Login Setup - Batch Script for Windows

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     OD Verification & Location Tracking System         ║
echo ║              Login Setup Configuration                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js installed: %NODE_VERSION%
echo.

REM Check PowerShell availability
where powershell >nul 2>&1
if errorlevel 1 (
    echo ⚠️  PowerShell not found. Using batch commands instead.
)

echo ═══════════════════════════════════════════════════════
echo STEP 1: Backend Setup
echo ═══════════════════════════════════════════════════════
echo.

cd backend
echo 📦 Installing backend dependencies...
call npm install >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

REM Check and copy .env
if not exist ".env" (
    if exist ".env.example" (
        echo ⚙️  Creating .env file from template...
        copy .env.example .env >nul
        echo ✅ .env file created
        echo    Update it with your PostgreSQL credentials
    )
)
echo.

echo 🗄️  Initializing database...
call npm run db:init >nul 2>&1
echo ✅ Database tables created
echo.

echo 👥 Creating test users...
call npm run db:seed
if errorlevel 1 (
    echo ❌ Failed to create test users
    echo    Make sure PostgreSQL is running and database exists
    pause
)
echo.

cd ..

echo.
echo ═══════════════════════════════════════════════════════
echo STEP 2: Frontend Setup
echo ═══════════════════════════════════════════════════════
echo.

cd frontend
echo 📦 Installing frontend dependencies...
call npm install >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

REM Check and copy .env
if not exist ".env" (
    if exist ".env.example" (
        echo ⚙️  Creating .env file from template...
        copy .env.example .env >nul
        echo ✅ .env file created
    )
)

REM Update API URL in .env
echo 🔗 Configuring API endpoint...
(
    findstr /v "REACT_APP_API_URL" .env
    echo REACT_APP_API_URL=http://localhost:5000
) > .env.tmp
move /y .env.tmp .env >nul
echo ✅ API URL configured: http://localhost:5000
echo.

cd ..

echo.
echo ═══════════════════════════════════════════════════════
echo STEP 3: Test Credentials
echo ═══════════════════════════════════════════════════════
echo.
echo 📝 Use these credentials to login:
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  STAFF USER                                            ║
echo ║  Email: staff@college.com                              ║
echo ║  Password: password123                                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  HOD USER                                              ║
echo ║  Email: hod@college.com                                ║
echo ║  Password: password123                                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  ADMIN USER                                            ║
echo ║  Email: admin@college.com                              ║
echo ║  Password: password123                                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo ═══════════════════════════════════════════════════════
echo STEP 4: Start the Application
echo ═══════════════════════════════════════════════════════
echo.
echo 🚀 Setup Complete! Now start the servers:
echo.
echo 1. Open Command Prompt and run:
echo    cd backend
echo    npm run dev
echo    (Wait for "Server running on port 5000")
echo.
echo 2. Open another Command Prompt and run:
echo    cd frontend
echo    npm start
echo    (Wait for "Compiled successfully")
echo.
echo 3. Open browser: http://localhost:3000
echo.
echo 4. Login with credentials above
echo.
echo ✨ Setup Complete! ✨
echo.
pause
