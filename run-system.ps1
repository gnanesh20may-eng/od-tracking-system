# One-click runner for Smart OD Verification System
# Usage: powershell -ExecutionPolicy Bypass -File run-system.ps1

# Configuration
$useNgrok = $env:NGROK_AUTOSTART -eq 'true'
$ngrokAuth = $env:NGROK_AUTH_TOKEN

# Ports used by the app (backend 5000, frontend 3000)
$ports = @(5000, 3000)
foreach ($p in $ports) {
    $lines = netstat -ano | findstr ":$p"
    if ($lines) {
        $pids = $lines | ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object -Unique
        foreach ($procId in $pids) {
            if ($procId -and $procId -ne '') {
                Write-Host "Killing PID $procId on port $p"
                taskkill /PID $procId /F | Out-Null
            }
        }
    }
}

function Start-NgrokTunnel([int]$port) {
    # Start ngrok for a specific port in a new window.
    # Prefer system-installed ngrok, fall back to npx ngrok.
    $hasNgrok = (Get-Command ngrok -ErrorAction SilentlyContinue) -ne $null
    if ($hasNgrok) {
        $file = 'ngrok'
        $args = @('http', "$port", '--log=stdout')
        if ($ngrokAuth) { $args = @('http', "$port", '--authtoken', $ngrokAuth, '--log=stdout') }
    } else {
        # Use npx ngrok
        $file = 'npx'
        $args = @('ngrok', 'http', "$port", '--log=stdout')
        if ($ngrokAuth) { $args = @('ngrok', 'http', "$port", '--authtoken', $ngrokAuth, '--log=stdout') }
    }
    Start-Process -FilePath $file -ArgumentList $args -WindowStyle Normal
}

# Optionally start ngrok tunnels and wait for public URLs
if ($useNgrok) {
    Write-Host "Starting ngrok tunnels for backend (5000) and frontend (3000)..."
    Start-NgrokTunnel -port 5000
    Start-NgrokTunnel -port 3000

    # Poll local ngrok API for tunnels
    $backendPublic = $null
    $frontendPublic = $null
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $tunnelsJson = Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels -ErrorAction Stop
            foreach ($t in $tunnelsJson.tunnels) {
                if ($t.config -and $t.config.addr -match '5000') { $backendPublic = $t.public_url }
                if ($t.config -and $t.config.addr -match '3000') { $frontendPublic = $t.public_url }
            }
        } catch {
            # ignore
        }
        if ($backendPublic -and $frontendPublic) { break }
        Start-Sleep -Seconds 2
    }

    if ($backendPublic -and $frontendPublic) {
        Write-Host "ngrok backend URL: $backendPublic"
        Write-Host "ngrok frontend URL: $frontendPublic"

        # Write env files so servers use correct public URLs
        $backendEnvPath = Join-Path $PSScriptRoot 'backend\.env'
        $frontendEnvPath = Join-Path $PSScriptRoot 'frontend\.env'

        "CLIENT_URL=$frontendPublic" | Out-File -FilePath $backendEnvPath -Encoding utf8
        "REACT_APP_API_URL=$backendPublic`/api" | Out-File -FilePath $frontendEnvPath -Encoding utf8

        Write-Host "Wrote backend .env and frontend .env with ngrok URLs"
    } else {
        Write-Host "ngrok did not return both tunnels in time. Continuing without auto env changes."
    }
}


# Run DB initialization explicitly before starting servers
Push-Location -LiteralPath "$PSScriptRoot\backend"
try {
    if (Test-Path package.json) {
        Write-Host "Running database initialization (npm run db:init)..."
        try {
            npm run db:init
            Write-Host "Database initialization completed."
        } catch {
            Write-Host "Database initialization failed or DB not available; continuing. Error: $_" -ForegroundColor Yellow
        }
    }
} finally {
    Pop-Location
}

# Start backend in a new PowerShell window and leave it open to show logs
$backendCmd = "Set-Location -LiteralPath '$PSScriptRoot\backend'; if (-Not (Test-Path node_modules)) { npm install } ; npm start"
Start-Process -FilePath 'powershell' -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command',$backendCmd) -WindowStyle Normal

# Give backend a few seconds to boot
Start-Sleep -Seconds 6

# Start frontend in a new PowerShell window
$frontendCmd = "Set-Location -LiteralPath '$PSScriptRoot\frontend'; if (-Not (Test-Path node_modules)) { npm install } ; npm start"
Start-Process -FilePath 'powershell' -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command',$frontendCmd) -WindowStyle Normal

Write-Host "✅ Backend and Frontend processes started. Check the new windows for logs."
Write-Host "If testing from mobile outside localhost, ngrok should expose HTTPS URLs (see ngrok windows)."
