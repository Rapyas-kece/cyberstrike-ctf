// TCP-to-WebSocket Bridge for CTF Challenges
// Usage: node tcp_bridge.js "<WSS_URL>" [port]

const net = require('net');

const wssUrl = process.argv[2] || "wss://tcp.1pc.tf/api/proxy/d541a84b-941d-4c48-ae0c-8bde16692e9a?capability=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMWEwN2FlNC1mOTllLTdjYTItYjAxNi02M2U4MjcwM2U1NmYiLCJzdGFtcCI6ImY4YTczODU5LTAzZjEtNDg4YS05MDk2LThlZTJlMjk2ZDNjMSIsImNvbnRhaW5lciI6ImQ1NDFhODRiLTk0MWQtNGM0OC1hZTBjLThiZGUxNjY5MmU5YSIsInByZXZpZXciOmZhbHNlLCJwdXJwb3NlIjoicnNjdGYtcHJveHktdjEiLCJpYXQiOjE3OTEwNDU4NTIsImV4cCI6MTc5MTA1MzA1Mn0.lo7-ho_o04LZzom_ohMGnZvk1VzzkC2el-SlokCsiII";
const port = parseInt(process.argv[3] || '1337', 10);

const server = net.createServer((socket) => {
  console.log(`\n[+] Klien TCP terhubung (Netcat / Pwntools)!`);
  console.log(`[+] Menghubungkan ke remote WebSocket: ${wssUrl.split('?')[0]}...`);

  const ws = new WebSocket(wssUrl);

  ws.onopen = () => {
    console.log('[+] WebSocket TERHUBUNG! Silakan berinteraksi.\n');
  };

  ws.onmessage = async (event) => {
    if (event.data instanceof Blob) {
      const buffer = Buffer.from(await event.data.arrayBuffer());
      socket.write(buffer);
    } else {
      socket.write(event.data);
    }
  };

  socket.on('data', (chunk) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(chunk);
    }
  });

  ws.onerror = (err) => {
    console.error('[-] WebSocket Error:', err.message);
  };

  ws.onclose = () => {
    console.log('\n[-] WebSocket ditutup oleh server target.');
    socket.end();
  };

  socket.on('close', () => {
    console.log('[-] Klien TCP terputus.');
    if (ws.readyState === WebSocket.OPEN) ws.close();
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`====================================================`);
  console.log(`🔌 TCP <-> WebSocket Bridge Aktif`);
  console.log(`📡 Port Lokal : 127.0.0.1:${port}`);
  console.log(`💻 Perintah NC: nc 127.0.0.1 ${port}`);
  console.log(`====================================================`);
});
