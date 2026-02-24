# Automated Setup Script for OD System Login

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     OD Verification & Location Tracking System         ║" -ForegroundColor Cyan
Write-Host "║              Login Setup & Configuration               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n" 

# Check if Node.js is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js first" -ForegroundColor Red
    exit 1
}

Write-Host "`n"

# Check if PostgreSQL is running
Write-Host "🗄️  Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgCheck = psql -U postgres -c "SELECT version();" 2>$null
    if ($pgCheck) {
        Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL might not be running. Make sure it's started." -ForegroundColor Yellow
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne 'y') { exit 1 }
    }
} catch {
    Write-Host "⚠️  Could not verify PostgreSQL. Make sure it's installed and running." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') { exit 1 }
}

Write-Host "`n"

# Step 1: Backend Setup
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STEP 1: Backend Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

Set-Location backend

Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install 2>&1 | Out-Null

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "`n⚙️  Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created" -ForegroundColor Green
        Write-Host "   Please update .env with your database credentials" -ForegroundColor Gray
    }
}

Write-Host "`n🗄️  Initializing database..." -ForegroundColor Yellow
npm run db:init 2>&1 | Out-Null
Write-Host "✅ Database tables created" -ForegroundColor Green

Write-Host "`n👥 Creating test users..." -ForegroundColor Yellow
npm run db:seed 2>&1 | Out-Null
Write-Host "✅ Test users created" -ForegroundColor Green

# Go back to root
Set-Location ..

Write-Host "`n"

# Step 2: Frontend Setup
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STEP 2: Frontend Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

Set-Location frontend

Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install 2>&1 | Out-Null
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "`n⚙️  Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created" -ForegroundColor Green
    }
}

# Ensure correct API URL
Write-Host "`n🔗 Configuring API endpoint..." -ForegroundColor Yellow
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "REACT_APP_API_URL") {
    Add-Content ".env" "REACT_APP_API_URL=http://localhost:5000"
    Write-Host "✅ API URL configured" -ForegroundColor Green
} else {
    Write-Host "✅ API URL already configured" -ForegroundColor Green
}

Set-Location ..

Write-Host "`n"
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STEP 3: Test Credentials" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n📝 Use these credentials to login:`n" -ForegroundColor Green

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  STAFF USER                                            ║" -ForegroundColor Yellow
Write-Host "║  Email: staff@college.com                              ║" -ForegroundColor Yellow
Write-Host "║  Password: password123                                 ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Yellow

Write-Host "`n"

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  HOD USER                                              ║" -ForegroundColor Yellow
Write-Host "║  Email: hod@college.com                                ║" -ForegroundColor Yellow
Write-Host "║  Password: password123                                 ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Yellow

Write-Host "`n"

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  ADMIN USER                                            ║" -ForegroundColor Yellow
Write-Host "║  Email: admin@college.com                              ║" -ForegroundColor Yellow
Write-Host "║  Password: password123                                 ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Yellow

Write-Host "`n"
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STEP 4: Starting the Application" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n🚀 Ready to start! Follow these steps:`n" -ForegroundColor Green

Write-Host "1️⃣  Open PowerShell/CMD and run (Terminal 1):" -ForegroundColor Cyan
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "    (Wait for 'Server running on port 5000')" -ForegroundColor Gray

Write-Host "`n2️⃣  Open another PowerShell/CMD and run (Terminal 2):" -ForegroundColor Cyan
Write-Host "    cd frontend" -ForegroundColor White
Write-Host "    npm start" -ForegroundColor White
Write-Host "    (Wait for 'Compiled successfully')" -ForegroundColor Gray

Write-Host "`n3️⃣  Open browser:" -ForegroundColor Cyan
Write-Host "    http://localhost:3000" -ForegroundColor White

Write-Host "`n4️⃣  Login with credentials above" -ForegroundColor Cyan

Write-Host "`n"
Write-Host "✨ Setup Complete! ✨" -ForegroundColor Green
Write-Host "`nVisit the following guides for more information:" -ForegroundColor Yellow
Write-Host "  • LOGIN_SETUP_GUIDE.md - Detailed login setup" -ForegroundColor Gray
Write-Host "  • QUICK_LOGIN_REFERENCE.md - Quick reference card" -ForegroundColor Gray
Write-Host "  • README.md - Full system documentation" -ForegroundColor Gray

Write-Host "`n"
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  🎉 System is ready! Start the servers above.         ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n"
