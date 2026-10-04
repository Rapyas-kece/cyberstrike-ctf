' CTF Tunnel Launcher - creates truly detached process
Dim oShell, oFSO
Set oShell = CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

' Kill existing cloudflared
On Error Resume Next
oShell.Run "taskkill /F /IM cloudflared.exe", 0, True
On Error GoTo 0
WScript.Sleep 1000

' Set working directory to D:\ctf
oShell.CurrentDirectory = "D:\ctf"

' Start cloudflared as fully detached process (0 = hidden window) with stable http2 protocol
oShell.Run Chr(34) & "D:\ctf\bin\cloudflared.exe" & Chr(34) & " tunnel --protocol http2 --url http://localhost:3000 --logfile D:\ctf\logs\tunnel-err.log --loglevel info", 0, False

WScript.Quit 0
