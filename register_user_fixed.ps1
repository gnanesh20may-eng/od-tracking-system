# Interactive User Registration Script - Fixed Version
# Run this to create your personal account with your own Gmail email

Write-Host "`n" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Create Your Personal User Account" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if backend is running
Write-Host "Checking backend connection..." -ForegroundColor Yellow
try {
    $testConnection = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method GET -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -ne 404) {
        Write-Host "WARNING: Backend might not be running!" -ForegroundColor Yellow
        Write-Host "Make sure you ran: cd backend && npm run dev`n" -ForegroundColor Yellow
    }
}

# Get user input
Write-Host "Enter your details:`n" -ForegroundColor Cyan

$name = Read-Host "1. Full Name"
$email = Read-Host "2. Email (your Gmail)"
$password = Read-Host "3. Password (min 6 characters)" -AsSecureString
$passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($password))

Write-Host "`nSelect Role:" -ForegroundColor Cyan
Write-Host "  1) Staff" -ForegroundColor Gray
Write-Host "  2) Head of Department (HOD)" -ForegroundColor Gray
Write-Host "  3) Admin`n" -ForegroundColor Gray

$roleChoice = Read-Host "Enter 1, 2, or 3 (default is 1)"
if ($roleChoice -eq "2") {
    $role = "hod"
} elseif ($roleChoice -eq "3") {
    $role = "admin"
} else {
    $role = "staff"
}

$department = Read-Host "Department"

# Confirm details
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Review your details:" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "Name:       $name"
Write-Host "Email:      $email"
Write-Host "Password:   (hidden)"
Write-Host "Role:       $role"
Write-Host "Department: $department`n"

$confirm = Read-Host "Correct? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "`nCancelled." -ForegroundColor Red
    exit
}

# Create account
Write-Host "`nCreating account..." -ForegroundColor Yellow

$jsonBody = @"
{
    "name": "$name",
    "email": "$email",
    "password": "$passwordPlain",
    "role": "$role",
    "department": "$department"
}
"@

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $jsonBody `
        -ErrorAction Stop

    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Account created" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Login with:" -ForegroundColor White
    Write-Host "  Email:    $email"
    Write-Host "  Password: (your password)"
    
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "  1. Open: http://localhost:3000"
    Write-Host "  2. Click Login"
    Write-Host "  3. Enter your email and password"
    Write-Host "  4. Click the Login button`n" -ForegroundColor Yellow

} catch {
    Write-Host "`nERROR: Could not create account" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)`n" -ForegroundColor Red
    
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. Backend is running (npm run dev)" -ForegroundColor Yellow
    Write-Host "  2. Email is not already used" -ForegroundColor Yellow
    Write-Host "  3. Password is at least 6 characters`n" -ForegroundColor Yellow
    
    exit 1
}

Write-Host "Done!" -ForegroundColor Green
