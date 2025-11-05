# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
cd backend
if (Test-Path node_modules) {
    npm start
} else {
    Write-Host "Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

