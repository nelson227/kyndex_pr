@echo off
REM Complete cleanup and fresh push
cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"

echo Killing node processes...
taskkill /F /IM node.exe 2>nul

echo Cleaning up problematic files...
del /F /Q package.json 2>nul
del /F /Q vercel.json 2>nul
del /F /Q push-now.bat 2>nul
del /F /Q push-vercel-fix.bat 2>nul
del /F /Q clean-and-reset.bat 2>nul

echo Resetting git...
git reset --hard origin/develop
git clean -fd

echo Configuring git...
git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"

echo.
echo === CLEAN STATE READY ===
echo All problematic files removed
echo Git reset to origin/develop
echo.
pause
