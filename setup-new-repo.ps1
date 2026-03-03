#!/usr/bin/env pwsh

Write-Host "=== FRESH SETUP WITH NEW REPO ===" -ForegroundColor Cyan

# Kill all node processes
Write-Host "Killing node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Navigate to project
Set-Location "c:\Users\nguem\OneDrive\Bureau\Kyndex"
Write-Host "Location: $(Get-Location)" -ForegroundColor Green

# Configure git
Write-Host "Configuring git..." -ForegroundColor Yellow
git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"

# Update remote to new repo
Write-Host "Updating git remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/nelson227/kyndex_pr.git

# Verify remote
Write-Host "Remote configuration:" -ForegroundColor Green
git remote -v

# Check status
Write-Host "`nGit status:" -ForegroundColor Green
git status

# Stage all files
Write-Host "`nStaging all files..." -ForegroundColor Yellow
git add -A

# Commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Kyndex full stack application" --allow-empty

# Push to new repo
Write-Host "Pushing to new repository..." -ForegroundColor Yellow
git push -u origin main 2>&1

Write-Host "`n=== SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "Repository: https://github.com/nelson227/kyndex_pr" -ForegroundColor Cyan
Write-Host "Next: Connect to Vercel using this new repo!" -ForegroundColor Cyan
