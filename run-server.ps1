# SkillBridge Server Startup Script
Write-Host "🚀 Starting SkillBridge Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path "server\.env")) {
    Write-Host "⚠️  .env file not found. Creating default .env..." -ForegroundColor Yellow
    @"
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=supersecret_jwt_key_change_in_production
PORT=4000
NODE_ENV=development
"@ | Out-File -FilePath "server\.env" -Encoding utf8
    Write-Host "✅ Created server\.env file" -ForegroundColor Green
}

# Start the server
Set-Location server
npm run dev

