@echo off
REM Clean Vercel deployment setup
cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"

REM Kill any node processes
taskkill /F /IM node.exe 2>nul

REM Remove deployment files
del /F /Q vercel.json 2>nul
del /F /Q deploy-vercel.ps1 2>nul
del /F /Q VERCEL_DEPLOYMENT.md 2>nul
del /F /Q push-fixes.bat 2>nul
del /F /Q .vercelignore 2>nul

REM Clean git
git reset --hard HEAD
git clean -fd

REM Configure git
git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"

REM Stage and commit the cleanup
git add --all
git commit -m "refactor: remove old deployment configuration files" --allow-empty
git push origin develop

echo.
echo === CLEANUP COMPLETE ===
echo All deployment files have been removed.
echo Git has been reset and cleaned.
echo You're ready for fresh Vercel setup!
echo.
pause
