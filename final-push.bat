@echo off
cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"

echo.
echo === PUSHING CLEAN STATE ===
echo.

git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"

echo Adding all clean files...
git add -A

echo Committing...
git commit -m "refactor: clean deployment setup for Vercel" --allow-empty

echo Pushing to GitHub...
git push origin develop -u

echo.
echo === PUSH COMPLETE ===
echo Your project is now clean and ready for Vercel!
echo.
pause
