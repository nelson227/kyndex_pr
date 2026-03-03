cd /d c:\Users\nguem\OneDrive\Bureau\Kyndex
REM Kill node
taskkill /F /IM node.exe 2>nul

REM Configure git
git config --global user.email "nelson227@gmail.com"
git config --global user.name "Nelson"

REM Clean git status
git status

REM Add and push
git add vercel.json
git commit -m "fix: setup Vercel configuration for Next.js monorepo" --allow-empty
git push origin develop

echo.
echo DONE! Check Vercel Dashboard and click Redeploy
pause
