# PowerShell script to start backend and frontend servers for OD system
# Usage: Open PowerShell in workspace root and run `.





















Write-Host "Started backend and frontend.  Check each terminal for logs and errors."Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start" -WorkingDirectory (Get-Location)# start frontend in new windowStart-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WorkingDirectory (Get-Location)# start backend in new window}    }        }            [System.Environment]::SetEnvironmentVariable($name, $value);            $value = $matches[2].Trim()            $name = $matches[1].Trim()        if ($_ -match "^\s*([^#].*?)=(.*)") {    Get-Content .env | ForEach-Object {    Write-Host "Loading environment variables from .env"if (Test-Path ".env") {# load environment variables from .env file if present# Ensure you have already installed dependencies using `npm install` in both folders.un-all.ps1`