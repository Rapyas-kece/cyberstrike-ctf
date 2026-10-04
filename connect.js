// Interactive WebSocket Terminal for CTF
// Usage: node connect.js [optional_wss_url]

const wssUrl = process.argv[2] || "wss://tcp.1pc.tf/api/proxy/d541a84b-941d-4c48-ae0c-8bde16692e9a?capability=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMWEwN2FlNC1mOTllLTdjYTItYjAxNi02M2U4MjcwM2U1NmYiLCJzdGFtcCI6ImY4YTczODU5LTAzZjEtNDg4YS05MDk2LThlZTJlMjk2ZDNjMSIsImNvbnRhaW5lciI6ImQ1NDFhODRiLTk0MWQtNGM0OC1hZTBjLThiZGUxNjY5MmU5YSIsInByZXZpZXciOmZhbHNlLCJwdXJwb3NlIjoicnNjdGYtcHJveHktdjEiLCJpYXQiOjE3OTEwNDU4NTIsImV4cCI6MTc5MTA1MzA1Mn0.lo7-ho_o04LZzom_ohMGnZvk1VzzkC2el-SlokCsiII";

console.log('[*] Menghubungkan ke server CTF...');
const ws = new WebSocket(wssUrl);

let inputBuffer = [];

ws.onopen = () => {
  console.log('[+] Terhubung! Silakan berinteraksi langsung:\n');
  while (inputBuffer.length > 0) {
    ws.send(inputBuffer.shift());
  }
};

ws.onmessage = async (event) => {
  if (event.data instanceof Blob) {
    const text = await event.data.text();
    process.stdout.write(text);
  } else {
    process.stdout.write(event.data);
  }
};

ws.onerror = (err) => {
  console.error('\n[-] Terjadi kesalahan:', err.message);
};

ws.onclose = () => {
  console.log('\n[*] Koneksi selesai / ditutup oleh server.');
  process.exit(0);
};

process.stdin.on('data', (chunk) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(chunk);
  } else {
    inputBuffer.push(chunk);
  }
});
