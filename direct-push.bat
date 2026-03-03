@echo off
setlocal enabledelayedexpansion

REM Kill all node/npm processes
for /f "tokens=5 delims= " %%P in ('netstat -ano ^| findstr :3000') do taskkill /pid %%P /f 2>nul
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

timeout /t 2 /nobreak

cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"

REM Set git config
git config user.email "nelson227@gmail.com"
git config user.name "Nelson"

REM Show remote
echo Remote configured:
git remote -v
echo.

REM Create/switch to main
git branch -M main

REM Stage everything
git add -A

REM Commit
echo Creating commit...
git commit -m "Initial commit: Kyndex application" --allow-empty

REM Push FORCE
echo.
echo PUSHING TO GITHUB...
git push -u origin main --force -v

echo.
echo PUSH COMPLETED!
timeout /t 3
