# CTF Watchdog - scheduled every 2 minutes via Task Scheduler
$logFile = "D:\ctf\logs\watchdog.log"
function Write-Log($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$ts] $msg"
}

Write-Log "--- Watchdog ---"

# 1. Check Node.js server
try {
    $r = Invoke-WebRequest "http://localhost:3000/api/me" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Log "Server: OK"
} catch {
    Write-Log "Server: OFFLINE - restarting via VBScript"
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Start-Process -FilePath "wscript.exe" -ArgumentList "D:\ctf\launch_server.vbs" -WindowStyle Hidden
    Start-Sleep -Seconds 5
    Write-Log "Server: restarted"
}

# 2. Check Cloudflare tunnel
$cfProcs = @(Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue)
Write-Log "Tunnel procs: $($cfProcs.Count)"
$tunnelHealthy = $false

if ($cfProcs.Count -gt 0) {
    # Check if current URL is actually alive and responding (with 3 retries to avoid false alarms)
    $currentUrl = (Get-Content "D:\ctf\logs\current_url.txt" -ErrorAction SilentlyContinue)
    if ($currentUrl -match '^https://[a-z0-9-]+\.trycloudflare\.com') {
        for ($attempt = 1; $attempt -le 3; $attempt++) {
            try {
                $resp = Invoke-WebRequest -Uri "$($currentUrl.Trim())/api/me" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
                if ($resp.StatusCode -eq 200) {
                    $tunnelHealthy = $true
                    Write-Log "Tunnel: OK ($($currentUrl.Trim()))"
                    break
                }
            } catch {
                Write-Log "Tunnel check attempt $attempt failed ($($_.Exception.Message))"
                if ($attempt -lt 3) {
                    Start-Sleep -Seconds 3
                }
            }
        }
    }
}

if (-not $tunnelHealthy) {
    Write-Log "Tunnel: UNHEALTHY/OFFLINE - restarting via VBScript"
    Start-Process -FilePath "wscript.exe" -ArgumentList "D:\ctf\launch_tunnel.vbs" -WindowStyle Hidden
    Start-Sleep -Seconds 15
    Write-Log "Tunnel: restarted"
}

# 3. Update URL file (get most recent URL from log)
$content = Get-Content "D:\ctf\logs\tunnel-err.log" -Raw -ErrorAction SilentlyContinue
if ($content -match 'https://[a-z0-9-]+\.trycloudflare\.com') {
    $allMatches = [regex]::Matches($content, 'https://[a-z0-9-]+\.trycloudflare\.com')
    $url = $allMatches[$allMatches.Count - 1].Value
    Write-Log "URL: $url"
    $url | Set-Content "D:\ctf\logs\current_url.txt" -Encoding UTF8
}

Write-Log "--- Done ---"
