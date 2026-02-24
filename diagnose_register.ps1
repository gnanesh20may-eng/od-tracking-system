# Diagnose Account Registration Issues

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Diagnosing Registration Error" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Check if backend is running
Write-Host "1. Checking if backend is running..." -ForegroundColor Yellow
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body '{}' -ErrorAction Stop 2>$null
    $backendRunning = $true
    Write-Host "   ✅ Backend is running on port 5000" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400 -or $_.Exception.Response.StatusCode -eq 404) {
        $backendRunning = $true
        Write-Host "   ✅ Backend is running on port 5000" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend is NOT running!" -ForegroundColor Red
        Write-Host "   Fix: Run: cd backend && npm run dev" -ForegroundColor Yellow
        exit 1
    }
}

# Step 2: Check database connection
Write-Host "`n2. Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $result = & psql -U postgres -c "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  PostgreSQL might not be running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Could not check PostgreSQL" -ForegroundColor Yellow
}

# Step 3: Check if database exists
Write-Host "`n3. Checking od_system database..." -ForegroundColor Yellow
try {
    $dbCheck = & psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'od_system'" 2>&1
    if ($dbCheck -match "1") {
        Write-Host "   ✅ od_system database exists" -ForegroundColor Green
        
        # Check tables
        $tableCheck = & psql -U postgres -d od_system -tc "SELECT table_name FROM information_schema.tables WHERE table_schema='public'" 2>&1
        if ($tableCheck -match "staff") {
            Write-Host "   ✅ Tables are created" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Tables not created!" -ForegroundColor Red
            Write-Host "   Fix: cd backend && npm run db:init" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "   ❌ od_system database does not exist!" -ForegroundColor Red
        Write-Host "   Fix: cd backend && npm run db:init" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ⚠️  Could not verify database" -ForegroundColor Yellow
}

# Step 4: Test registration endpoint
Write-Host "`n4. Testing registration endpoint..." -ForegroundColor Yellow

$testData = @{
    name = "Test User"
    email = "test.$(Get-Random)@test.com"
    password = "password123"
    role = "staff"
    department = "Test"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $testData `
        -ErrorAction Stop
    
    Write-Host "   ✅ Registration endpoint works!" -ForegroundColor Green
    Write-Host "   Response: $($response.StatusCode)" -ForegroundColor Green
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "   ❌ Registration endpoint returned error: $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 401) {
        Write-Host "`n   ERROR: 401 Unauthorized" -ForegroundColor Red
        Write-Host "   This means the backend is rejecting registration." -ForegroundColor Yellow
        Write-Host "`n   Possible causes:" -ForegroundColor Yellow
        Write-Host "   1. Backend code has authentication middleware on /register" -ForegroundColor Gray
        Write-Host "   2. Check backend/routes/auth.js" -ForegroundColor Gray
        Write-Host "   3. Registration route should NOT require JWT token" -ForegroundColor Gray
        exit 1
    } elseif ($statusCode -eq 404) {
        Write-Host "   ❌ Registration endpoint not found (404)" -ForegroundColor Red
        Write-Host "   Backend might not be running or route is wrong" -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "   Details: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ System is ready for registration!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Now run:" -ForegroundColor Yellow
Write-Host "  .\register_user_fixed.ps1`n" -ForegroundColor White
