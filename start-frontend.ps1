# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
cd frontend
if (Test-Path node_modules) {
    npm run dev
} else {
    Write-Host "Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

