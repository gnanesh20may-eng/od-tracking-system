param(
  [string]$FrontendDir = "frontend",
  [string]$BackendDir = "backend",
  [int[]]$PortsToKill = @(3000,5000)
)

Write-Host "Stopping processes on ports: $($PortsToKill -join ', ')"
foreach ($p in $PortsToKill) {
  $lines = netstat -ano
  $pattern = ":" + $p + " "
  $pids = @()
  foreach ($line in $lines) {
    if ($line.Contains($pattern)) {
      $parts = $line -split '\s+'
      $pid = $parts[-1]
      if (-not ($pids -contains $pid)) { $pids += $pid }
    }
  }
  if ($pids.Count -gt 0) {
    foreach ($pid in $pids) {
      try {
        Write-Host "Killing PID $pid (port $p)"
        taskkill /PID $pid /F | Out-Null
      } catch {
        Write-Warning "Failed to kill $pid: $($_.Exception.Message)"
      }
    }
  } else {
    Write-Host "No process found on port $p"
  }
}

Write-Host "Starting backend (in $BackendDir)..."
Start-Process -FilePath "npm.cmd" -ArgumentList "start" -WorkingDirectory (Join-Path $PSScriptRoot $BackendDir)

Start-Sleep -Seconds 1
Write-Host "Starting frontend (in $FrontendDir)..."
Start-Process -FilePath "npm.cmd" -ArgumentList "start" -WorkingDirectory (Join-Path $PSScriptRoot $FrontendDir)

Start-Sleep -Seconds 3
Write-Host "Opening http://localhost:3000 in default browser"
Start-Process "http://localhost:3000"

Write-Host "All processes requested. Use the opened terminals to watch logs."
