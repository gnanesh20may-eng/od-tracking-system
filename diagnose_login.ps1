# Diagnostic Script to Fix Login Issues

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║             Login Failed - Diagnostic Tool             ║" -ForegroundColor Cyan
Write-Host "║         This will help identify the problem            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check 1: Backend Running
Write-Host "1️⃣  Checking if Backend is running..." -ForegroundColor Yellow
$backendCheck = netstat -ano 2>$null | findstr ":5000"
if ($backendCheck) {
    Write-Host "❌ Backend might be running but we can't fully verify" -ForegroundColor Yellow
} else {
    Write-Host "❌ Backend is NOT running on port 5000" -ForegroundColor Red
    Write-Host "   FIX: Run in backend folder: npm run dev`n" -ForegroundColor Green
}

# Check 2: Frontend Running
Write-Host "2️⃣  Checking if Frontend is running..." -ForegroundColor Yellow
$frontendCheck = netstat -ano 2>$null | findstr ":3000"
if ($frontendCheck) {
    Write-Host "❌ Frontend might be running but we can't fully verify" -ForegroundColor Yellow
} else {
    Write-Host "❌ Frontend is NOT running on port 3000" -ForegroundColor Red
    Write-Host "   FIX: Run in frontend folder: npm start`n" -ForegroundColor Green
}

# Check 3: PostgreSQL
Write-Host "3️⃣  Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgResult = psql -U postgres -c "SELECT version();" 2>$null
    if ($pgResult) {
        Write-Host "✅ PostgreSQL is installed and running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ PostgreSQL is NOT accessible" -ForegroundColor Red
    Write-Host "   FIX: Install PostgreSQL or start the service`n" -ForegroundColor Green
}

# Check 4: Database exists
Write-Host "4️⃣  Checking if database 'od_system' exists..." -ForegroundColor Yellow
try {
    $dbCheck = psql -U postgres -l 2>$null | findstr "od_system"
    if ($dbCheck) {
        Write-Host "✅ Database 'od_system' exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Database 'od_system' NOT found" -ForegroundColor Red
        Write-Host "   FIX: Run: cd backend && npm run db:init`n" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Cannot check database" -ForegroundColor Red
}

# Check 5: Tables exist
Write-Host "5️⃣  Checking if tables are created..." -ForegroundColor Yellow
try {
    $tableCheck = psql -U postgres -d od_system -c "\dt" 2>$null | findstr "staff"
    if ($tableCheck) {
        Write-Host "✅ Staff table exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Tables NOT created" -ForegroundColor Red
        Write-Host "   FIX: Run: cd backend && npm run db:init`n" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Cannot verify tables" -ForegroundColor Red
}

# Check 6: Users exist
Write-Host "6️⃣  Checking if users exist..." -ForegroundColor Yellow
try {
    $userCount = psql -U postgres -d od_system -c "SELECT COUNT(*) FROM staff;" 2>$null
    if ($userCount -match "[1-9]") {
        Write-Host "✅ Users exist in database" -ForegroundColor Green
        Write-Host "`n   Users:" -ForegroundColor Cyan
        psql -U postgres -d od_system -c "SELECT id, email, role FROM staff LIMIT 10;" 2>$null |
            Select-Object -Skip 2 | Select-Object -SkipLast 2 | ForEach-Object { Write-Host "   $_" }
    } else {
        Write-Host "❌ NO users in database" -ForegroundColor Red
        Write-Host "   FIX: Run: cd backend && npm run db:seed`n" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Cannot check users" -ForegroundColor Red
    Write-Host "   FIX: Run: cd backend && npm run db:seed`n" -ForegroundColor Green
}

# Check 7: Frontend .env
Write-Host "`n7️⃣  Checking frontend .env..." -ForegroundColor Yellow
if (Test-Path "frontend\.env") {
    $envContent = Get-Content "frontend\.env"
    if ($envContent -match "REACT_APP_API_URL") {
        Write-Host "✅ Frontend .env looks good" -ForegroundColor Green
        Write-Host "`n   Content:" -ForegroundColor Cyan
        Get-Content "frontend\.env" | ForEach-Object { Write-Host "   $_" }
    } else {
        Write-Host "❌ REACT_APP_API_URL not set in .env" -ForegroundColor Red
        Write-Host "   FIX: Add to frontend/.env:`n   REACT_APP_API_URL=http://localhost:5000`n" -ForegroundColor Green
    }
} else {
    Write-Host "❌ frontend/.env does NOT exist" -ForegroundColor Red
    Write-Host "   FIX: Copy from .env.example: frontend/`n       copy .env.example .env`n" -ForegroundColor Green
}

# Check 8: Backend .env
Write-Host "`n8️⃣  Checking backend .env..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    $envContent = Get-Content "backend\.env"
    if ($envContent -match "DB_HOST") {
        Write-Host "✅ Backend .env looks good" -ForegroundColor Green
        Write-Host "`n   File exists (showing selected lines):" -ForegroundColor Cyan
        Get-Content "backend\.env" | Select-String -Pattern "DB_|JWT_|PORT" | ForEach-Object { Write-Host "   $_" }
    } else {
        Write-Host "❌ Backend .env missing database config" -ForegroundColor Red
    }
} else {
    Write-Host "❌ backend/.env does NOT exist" -ForegroundColor Red
    Write-Host "   FIX: Copy from .env.example:`n       copy backend\.env.example backend\.env`n" -ForegroundColor Green
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  RECOMMENDED FIXES                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Do these steps IN ORDER:`n" -ForegroundColor Yellow

Write-Host "STEP 1 - Initialize Backend (if needed):" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run db:init" -ForegroundColor White
Write-Host "  npm run db:seed`n" -ForegroundColor White

Write-Host "STEP 2 - Start Backend (Terminal 1):" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  [Wait for: Server running on port 5000]`n" -ForegroundColor White

Write-Host "STEP 3 - Start Frontend (Terminal 2):" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host "  [Wait for: Compiled successfully!]`n" -ForegroundColor White

Write-Host "STEP 4 - Login:" -ForegroundColor Cyan
Write-Host "  Open: http://localhost:3000" -ForegroundColor White
Write-Host "  Email: staff@college.com" -ForegroundColor White
Write-Host "  Password: password123" -ForegroundColor White
Write-Host "  [Press F12 to see errors if it fails]`n" -ForegroundColor White

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║             Follow STEP 1 first, then STEP 2-4        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Questions? See LOGIN_FAILED_FIX.md for detailed help`n" -ForegroundColor Gray
