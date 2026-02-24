# Interactive User Registration Script
# Run this to create your personal account

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         Create Your Personal User Account              ║" -ForegroundColor Cyan
Write-Host "║     Staff OD Verification & Location Tracking System   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if backend is running
Write-Host "Checking if backend is running..." -ForegroundColor Yellow
try {
    $testConnection = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method GET -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ Backend is running on port 5000`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend is NOT running!`n" -ForegroundColor Red
        Write-Host "Please start backend first:`n" -ForegroundColor Yellow
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  npm run dev`n" -ForegroundColor White
        Read-Host "Press Enter after starting backend..."
    }
}

# Get user input
Write-Host "Please enter your details:`n" -ForegroundColor Cyan

$name = Read-Host "1. Full Name (example: Ramesh Kumar)"
$email = Read-Host "2. Email (example: your.email@gmail.com)"
$password = Read-Host "3. Password (at least 6 characters)" -AsSecureString
$passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($password))

Write-Host "`n4. Select Role:`n" -ForegroundColor Cyan
Write-Host "   [1] staff    - Staff Member (default)" -ForegroundColor Gray
Write-Host "   [2] hod      - Head of Department" -ForegroundColor Gray
Write-Host "   [3] admin    - Administrator`n" -ForegroundColor Gray

$roleChoice = Read-Host "Enter choice 1-3, default is 1"
switch ($roleChoice) {
    "2" { $role = "hod" }
    "3" { $role = "admin" }
    default { $role = "staff" }
}

$department = Read-Host "5. Department (example: Computer Science)"

# Validation
Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                  Review Your Details                   ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Yellow

Write-Host "Name:       $name" -ForegroundColor White
Write-Host "Email:      $email" -ForegroundColor White
Write-Host "Password:   " -NoNewline -ForegroundColor White
for ($i = 0; $i -lt $passwordPlain.Length; $i++) { Write-Host "*" -NoNewline -ForegroundColor White }
Write-Host "`nRole:       $role" -ForegroundColor White
Write-Host "Department: $department`n" -ForegroundColor White

Write-Host "Is this correct? (y/n): " -ForegroundColor Cyan -NoNewline
$confirm = Read-Host
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "`n❌ Cancelled. Please run the script again.`n" -ForegroundColor Red
    exit
}

# Create account
Write-Host "`n📝 Creating account..." -ForegroundColor Yellow

$body = @{
    name = $name
    email = $email
    password = $passwordPlain
    role = $role
    department = $department
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body

    $result = $response.Content | ConvertFrom-Json

    Write-Host "`n✅ Account created successfully!`n" -ForegroundColor Green
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                  LOGIN CREDENTIALS                     ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
    Write-Host "Email:    $email" -ForegroundColor White
    Write-Host "Password: " -NoNewline -ForegroundColor White
    for ($i = 0; $i -lt $passwordPlain.Length; $i++) { Write-Host "*" -NoNewline -ForegroundColor White }
    Write-Host "`n" -ForegroundColor White

} catch {
    $errorResponse = $_.Exception.Response
    if ($errorResponse) {
        $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
        $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
        Write-Host "`n❌ Error: $($errorBody.error)`n" -ForegroundColor Red
    } else {
        Write-Host "`n❌ Error: Could not connect to backend`n" -ForegroundColor Red
        Write-Host "Make sure backend is running: npm run dev`n" -ForegroundColor Yellow
    }
    exit
}

# Next steps
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    NEXT STEPS                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "1. Open your browser and go to:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000`n" -ForegroundColor White

Write-Host "2. Login with your credentials:" -ForegroundColor Yellow
Write-Host "   Email:    $email" -ForegroundColor White
Write-Host "   Password: (the password you entered)`n" -ForegroundColor White

Write-Host "3. Click Login button" -ForegroundColor Yellow
Write-Host "   You should see the dashboard`n" -ForegroundColor White

if ($role -eq "staff") {
    Write-Host "4. As a STAFF member, you can:" -ForegroundColor Yellow
    Write-Host "   • View your location history" -ForegroundColor Gray
    Write-Host "   • Track your location during duty" -ForegroundColor Gray
    Write-Host "   • See your compliance status`n" -ForegroundColor Gray
} elseif ($role -eq "hod") {
    Write-Host "4. As a HOD, you can:" -ForegroundColor Yellow
    Write-Host "   • Create duties for staff members" -ForegroundColor Gray
    Write-Host "   • View all staff location history" -ForegroundColor Gray
    Write-Host "   • Access the dashboard" -ForegroundColor Gray
    Write-Host "   • Monitor compliance`n" -ForegroundColor Gray
} else {
    Write-Host "4. As an ADMIN, you can:" -ForegroundColor Yellow
    Write-Host "   • Full system access" -ForegroundColor Gray
    Write-Host "   • Create duties and manage users" -ForegroundColor Gray
    Write-Host "   • View all reports and analytics`n" -ForegroundColor Gray
}

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✨ Account created successfully! ✨           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Ready to login? Open http://localhost:3000 in your browser!`n" -ForegroundColor Cyan
