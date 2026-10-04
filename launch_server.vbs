Dim oShell
Set oShell = CreateObject("WScript.Shell")

' Kill existing node on port 3000
On Error Resume Next
Dim oExec
Set oExec = oShell.Exec("netstat -ano")
On Error GoTo 0

' Set working directory to D:\ctf
oShell.CurrentDirectory = "D:\ctf"

' Start node server
oShell.Run "node D:\ctf\server.js", 0, False

WScript.Quit 0
