@echo off
cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"
echo Pushing changes to GitHub...
git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"
git add vercel.json package.json
git commit -m "fix: configure vercel.json to build Next.js from frontend folder"
git push origin develop -v
echo.
echo Push completed!
pause
