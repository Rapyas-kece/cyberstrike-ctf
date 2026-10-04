# CTF Platform Startup Script - Auto-runs at Windows Logon
# Uses VBScript launchers for truly detached processes (survive PS session end)
$logFile = "D:\ctf\logs\startup.log"
function Write-Log($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$ts] $msg"
}

Write-Log "=== CTF Platform Startup ==="

# Kill old instances
Get-Process -Name "node","cloudflared" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Node.js server via VBScript (truly detached)
Start-Process -FilePath "wscript.exe" -ArgumentList "D:\ctf\launch_server.vbs" -WindowStyle Hidden
Write-Log "Node.js server launch triggered"
Start-Sleep -Seconds 4

# Verify server started
try {
    Invoke-WebRequest "http://localhost:3000/api/me" -TimeoutSec 5 -UseBasicParsing | Out-Null
    Write-Log "Server: OK"
} catch {
    Write-Log "Server: not yet responding, will retry"
}

# Clear tunnel log for fresh URL
"" | Set-Content "D:\ctf\logs\tunnel-err.log" -Encoding UTF8

# Start Cloudflare tunnel via VBScript (truly detached)
Start-Process -FilePath "wscript.exe" -ArgumentList "D:\ctf\launch_tunnel.vbs" -WindowStyle Hidden
Write-Log "Cloudflare tunnel launch triggered"

# Wait for URL
Start-Sleep -Seconds 15
$content = Get-Content "D:\ctf\logs\tunnel-err.log" -Raw -ErrorAction SilentlyContinue
if ($content -match 'https://[a-z0-9-]+\.trycloudflare\.com') {
    $url = $matches[0]
    Write-Log "URL: $url"
    $url | Set-Content "D:\ctf\logs\current_url.txt" -Encoding UTF8
} else {
    Write-Log "URL not yet available (will be captured by watchdog)"
}

Write-Log "=== Startup Complete ==="
