# SkillBridge Frontend Startup Script
Write-Host "🚀 Starting SkillBridge Frontend..." -ForegroundColor Green
Write-Host ""

# Get the directory where this script is located
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path -Parent $scriptPath
Set-Location $scriptDir

# Check if client directory exists
if (-not (Test-Path "client")) {
    Write-Host "❌ Error: Cannot find 'client' directory." -ForegroundColor Red
    Write-Host "   Script location: $scriptDir" -ForegroundColor Yellow
    Write-Host "   Please ensure this script is in the SkillBridge directory." -ForegroundColor Yellow
    exit 1
}

# Start the frontend
Set-Location client
npm run dev

