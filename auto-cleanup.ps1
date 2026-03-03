#!/usr/bin/env pwsh

# Navigate to the project
Set-Location "c:\Users\nguem\OneDrive\Bureau\Kyndex"

Write-Host "=== CLEANING UP ===" -ForegroundColor Green

# Kill node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove problematic files
Remove-Item -Force "package.json" -ErrorAction SilentlyContinue
Remove-Item -Force "push-now.bat" -ErrorAction SilentlyContinue
Remove-Item -Force "push-vercel-fix.bat" -ErrorAction SilentlyContinue
Remove-Item -Force "clean-and-reset.bat" -ErrorAction SilentlyContinue
Remove-Item -Force "cleanup-and-reset.bat" -ErrorAction SilentlyContinue
Remove-Item -Force "final-push.bat" -ErrorAction SilentlyContinue

Write-Host "✓ Files cleaned" -ForegroundColor Green

# Git reset
Write-Host "=== RESETTING GIT ===" -ForegroundColor Green
git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"
git reset --hard origin/develop > $null 2>&1
git clean -fd > $null 2>&1

Write-Host "✓ Git reset" -ForegroundColor Green

# Create clean vercel.json
Write-Host "=== CREATING vercel.json ===" -ForegroundColor Green
$vercelJson = @{
    version = 2
    builds = @(
        @{
            src = "frontend/package.json"
            use = "@vercel/next"
        }
    )
    routes = @(
        @{
            src = "/(.*)"
            dest = "frontend/`$1"
        }
    )
}

$vercelJson | ConvertTo-Json -Depth 10 | Set-Content "vercel.json" -Encoding UTF8
Write-Host "✓ vercel.json created" -ForegroundColor Green

# Commit and push
Write-Host "=== PUSHING TO GITHUB ===" -ForegroundColor Green
git add vercel.json
git commit -m "fix: setup Vercel configuration for Next.js monorepo"
git push origin develop

Write-Host "=== COMPLETE ===" -ForegroundColor Green
Write-Host "Your project has been cleaned and pushed!" -ForegroundColor Cyan
Write-Host "Next step: Go to Vercel Dashboard and click Redeploy" -ForegroundColor Yellow
