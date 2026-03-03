@echo off
cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"

REM Kill node processes
taskkill /F /IM node.exe 2>nul

REM Configure git
git config user.email "nelson227@gmail.com"
git config user.name "Nelson"

echo.
echo === PREPARING NEW REPO PUSH ===
echo.

REM Check current status
git status

REM Create or switch to main branch
git checkout -b main 2>nul
git checkout main

REM Add all files
git add -A

REM Commit
git commit -m "Initial commit: Kyndex application" --allow-empty

REM Push to new repo with force
echo.
echo Pushing to https://github.com/nelson227/kyndex_pr.git
git push -u origin main --force

echo.
echo === DONE ===
echo Repository is now on kyndex_pr with main branch
echo Next: Connect this repo to Vercel!
echo.
pause
