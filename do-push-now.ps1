#!/usr/bin/env pwsh
$ErrorActionPreference = "SilentlyContinue"

# Kill everything blocking
Write-Host "Killing blocking processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process npm -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Navigate
$path = "c:\Users\nguem\OneDrive\Bureau\Kyndex"
Set-Location $path
Write-Host "Working in: $path"

# Configure git
Write-Host "Configuring git..."
& git config user.email "nelson227@gmail.com"
& git config user.name "Nelson"

# Show current remote
Write-Host "Current remote:"
& git remote -v

# Verify remote is correct
$remote = & git remote get-url origin
Write-Host "Remote URL: $remote"

if ($remote -notmatch "kyndex_pr") {
    Write-Host "Updating remote to kyndex_pr..."
    & git remote remove origin
    & git remote add origin https://github.com/nelson227/kyndex_pr.git
}

# Switch to/create main branch
Write-Host "Switching to main branch..."
& git show-ref --verify --quiet refs/heads/main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating main branch..."
    & git checkout -b main
} else {
    Write-Host "Switching to existing main branch..."
    & git checkout main
}

# Show status
Write-Host "`nCurrent status:"
& git status

# Add all files
Write-Host "`nAdding all files..."
& git add -A

# Commit
Write-Host "Committing..."
& git commit -m "Initial commit: Kyndex application" --allow-empty

# Show what we're about to push
Write-Host "`nAbout to push to:"
& git remote -v

# Push
Write-Host "`nPushing to GitHub..."
& git push -u origin main --force

Write-Host "`n=== COMPLETE ===" -ForegroundColor Green
Write-Host "Pushed to: https://github.com/nelson227/kyndex_pr" -ForegroundColor Cyan
