@echo off
cd /d "c:\Users\nguem\OneDrive\Bureau\Kyndex"
taskkill /F /IM node.exe 2>nul
git add vercel.json
git commit -m "fix: update vercel.json with correct monorepo configuration"
git push origin develop
echo Done!
