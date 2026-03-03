@echo off
cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"
git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"
git add frontend/src/app/public-layout.tsx frontend/next.config.js vercel.json
git commit -m "fix: correct NavBar import and improve Vercel build configuration"
git push origin develop
echo Done!
pause
