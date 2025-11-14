# SkillBridge Server Startup Script
Write-Host "🚀 Starting SkillBridge Backend Server..." -ForegroundColor Green
Write-Host ""

# Get the directory where this script is located
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path -Parent $scriptPath
Set-Location $scriptDir

# Check if server directory exists
if (-not (Test-Path "server")) {
    Write-Host "❌ Error: Cannot find 'server' directory." -ForegroundColor Red
    Write-Host "   Script location: $scriptDir" -ForegroundColor Yellow
    Write-Host "   Please ensure this script is in the SkillBridge directory." -ForegroundColor Yellow
    exit 1
}

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

# Verify server directory exists
if (-not (Test-Path "server")) {
    Write-Host "❌ Error: 'server' directory not found!" -ForegroundColor Red
    exit 1
}

# Start the server
Set-Location server
npm run dev

