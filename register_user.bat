@echo off
REM Interactive User Registration Script - Windows Batch
REM Run this to create your personal account

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║         Create Your Personal User Account              ║
echo ║     Staff OD Verification & Location Tracking System   ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if backend is running
echo Checking if backend is running...
timeout /t 1 /nobreak >nul

powershell -Command "Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method GET" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ Backend is running on port 5000
    echo.
) else (
    echo ❌ Backend is NOT running!
    echo.
    echo Please start backend first:
    echo   cd backend
    echo   npm run dev
    echo.
    pause
    exit /b
)

REM Get user input
echo Please enter your details:
echo.

set /p name="1. Full Name (e.g., Ramesh Kumar): "
set /p email="2. Email (e.g., ramesh@college.com): "
set /p password="3. Password (at least 6 characters): "

echo.
echo 4. Select Role:
echo.
echo    [1] staff    - Staff Member (default)
echo    [2] hod      - Head of Department
echo    [3] admin    - Administrator
echo.

set /p roleChoice="Enter choice (1-3, default is 1): "

if "!roleChoice!"=="2" (
    set role=hod
) else if "!roleChoice!"=="3" (
    set role=admin
) else (
    set role=staff
)

set /p department="5. Department (e.g., Computer Science): "

REM Review details
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                  Review Your Details                   ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo Name:       !name!
echo Email:      !email!
echo Password:   (hidden for security)
echo Role:       !role!
echo Department: !department!
echo.

set /p confirm="Is this correct? (y/n): "

if /i not "!confirm!"=="y" (
    echo.
    echo ❌ Cancelled. Please run the script again.
    echo.
    pause
    exit /b
)

REM Create account using PowerShell (safer for JSON)
echo.
echo 📝 Creating account...
echo.

powershell -Command ^
  "$body = @{ ^
      name = '!name!'; ^
      email = '!email!'; ^
      password = '!password!'; ^
      role = '!role!'; ^
      department = '!department!' ^
  } | ConvertTo-Json; ^
  try { ^
    $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body; ^
    Write-Host '✅ Account created successfully!'; ^
    Write-Host ''; ^
    Write-Host '╔════════════════════════════════════════════════════════╗'; ^
    Write-Host '║                  LOGIN CREDENTIALS                     ║'; ^
    Write-Host '╚════════════════════════════════════════════════════════╝'; ^
    Write-Host ''; ^
    Write-Host 'Email:    !email!'; ^
    Write-Host 'Password: (your entered password)'; ^
    Write-Host ''; ^
  } catch { ^
    Write-Host '❌ Error: ' $_.Exception.Message; ^
    Write-Host ''; ^
    Write-Host 'Make sure backend is running: npm run dev'; ^
    exit 1; ^
  }"

if errorlevel 1 (
    pause
    exit /b
)

REM Next steps
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                    NEXT STEPS                          ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo 1. Open your browser and go to:
echo    http://localhost:3000
echo.

echo 2. Login with your credentials:
echo    Email:    !email!
echo    Password: (the password you entered)
echo.

echo 3. Click Login button
echo    You should see the dashboard
echo.

if "!role!"=="staff" (
    echo 4. As a STAFF member, you can:
    echo    • View your location history
    echo    • Track your location during duty
    echo    • See your compliance status
    echo.
) else if "!role!"=="hod" (
    echo 4. As a HOD, you can:
    echo    • Create duties for staff members
    echo    • View all staff location history
    echo    • Access the dashboard
    echo    • Monitor compliance
    echo.
) else (
    echo 4. As an ADMIN, you can:
    echo    • Full system access
    echo    • Create duties and manage users
    echo    • View all reports and analytics
    echo.
)

echo ╔════════════════════════════════════════════════════════╗
echo ║          ✨ Account created successfully! ✨           ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo Ready to login? Open http://localhost:3000 in your browser!
echo.

pause
