Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

strPath = "c:\Users\nguem\OneDrive\Bureau\Kyndex"

' Kill processes
objShell.Run "taskkill /f /im node.exe", 0, False
objShell.Run "taskkill /f /im npm.exe", 0, False
WScript.Sleep(2000)

' Execute git commands
objShell.CurrentDirectory = strPath

objShell.Run "cmd.exe /c git config user.email ""nelson227@gmail.com""", 0, True
objShell.Run "cmd.exe /c git config user.name ""Nelson""", 0, True
objShell.Run "cmd.exe /c git branch -M main", 0, True
objShell.Run "cmd.exe /c git add -A", 0, True
objShell.Run "cmd.exe /c git commit -m ""Initial commit: Kyndex application"" --allow-empty", 0, True
objShell.Run "cmd.exe /c git push -u origin main --force", 0, True

MsgBox "Push completed to https://github.com/nelson227/kyndex_pr", 0, "Success"
