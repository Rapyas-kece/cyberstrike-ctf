const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log("============================================================");
console.log("🚀 MEMULAI SERVER CYBERSTRIKE CTF & CLOUDFLARE PUBLIC TUNNEL");
console.log("============================================================\n");

// 1. Jalankan server lokal
const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// 2. Jalankan cloudflared tunnel
const cloudflaredBin = path.join(__dirname, 'bin', 'cloudflared.exe');
const tunnelProcess = spawn(cloudflaredBin, ['tunnel', '--url', 'http://localhost:3000'], {
  cwd: __dirname
});

let publicUrlFound = false;

tunnelProcess.stderr.on('data', (data) => {
  const output = data.toString();

  // Deteksi URL trycloudflare.com
  const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match && !publicUrlFound) {
    publicUrlFound = true;
    const publicUrl = match[0];

    console.log("\n============================================================");
    console.log("🎉 SELAMAT! WEB CTF KAMU SUDAH ONLINE DAN BISA DIAKSES!");
    console.log("============================================================");
    console.log(`🌐 PUBLIC URL (BISA DIBUKA DI HP/LAPTOP):`);
    console.log(`   👉 ${publicUrl}`);
    console.log(`\n🏠 LOCAL URL:`);
    console.log(`   👉 http://localhost:3000`);
    console.log("============================================================");
    console.log("💡 Bagikan link PUBLIC URL di atas ke grup peserta kamu!");
    console.log("Tekan Ctrl + C di terminal ini jika ingin menghentikan server.\n");
  }
});

tunnelProcess.on('close', (code) => {
  console.log(`[Tunnel] Closed with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n[Shutdown] Menghentikan server dan tunnel...');
  serverProcess.kill();
  tunnelProcess.kill();
  process.exit(0);
});
