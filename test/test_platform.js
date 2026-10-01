const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { spawn } = require('child_process');

async function runCTFTestSuite() {
  console.log("===============================================================");
  console.log("🛡️  CYBERSTRIKE CTF - AUTOMATED TEST SUITE & PLATFORM AUDIT");
  console.log("===============================================================\n");

  const results = { passed: 0, failed: 0, errors: [] };

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      results.passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      results.failed++;
      results.errors.push(message);
    }
  }

  const ctfRoot = path.resolve(__dirname, '..');
  const dataDir = path.join(ctfRoot, 'data');
  const solvesPath = path.join(dataDir, 'solves.json');
  const usersPath = path.join(dataDir, 'users.json');
  const downloadsDir = path.join(ctfRoot, 'public', 'downloads');

  // Backup state
  const solvesBackup = fs.readFileSync(solvesPath, 'utf8');
  const usersBackup = fs.readFileSync(usersPath, 'utf8');

  console.log("1. INTEGRITY OF PUBLIC DOWNLOAD ARTIFACTS");
  const requiredFiles = [
    'pesan_rot13.txt',
    'rahasia_tiga_lapis.txt',
    'ciphertext_xor.hex',
    'sandi_vigenere.txt',
    'bukti_gambar.jpg',
    'berkas_rusak.png',
    'foto_penyamaran.jpg',
    'rekaman_jaringan.pcap'
  ];

  for (const f of requiredFiles) {
    const fullP = path.join(downloadsDir, f);
    assert(fs.existsSync(fullP) && fs.statSync(fullP).size > 0, `Artifact exists & non-empty: ${f} (${fs.existsSync(fullP) ? fs.statSync(fullP).size : 0} bytes)`);
  }

  console.log("\n2. SOLVABILITY AUDIT (CRYPTOGRAPHY & DIGITAL FORENSICS)");
  // Crypto 1: ROT13
  const rot13Text = fs.readFileSync(path.join(downloadsDir, 'pesan_rot13.txt'), 'utf8');
  function decodeRot13(str) {
    return str.replace(/[a-zA-Z]/g, function (c) {
      return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
  }
  const crypto1Decoded = decodeRot13(rot13Text);
  assert(crypto1Decoded.includes('CTF{sandi_caesar_rot13_dasar}'), 'Crypto 1 (ROT13) solver decodes flag successfully');

  // Crypto 2: Binary -> Hex -> Base64
  const c2Content = fs.readFileSync(path.join(downloadsDir, 'rahasia_tiga_lapis.txt'), 'utf8');
  const binMatch = c2Content.match(/--- PAYLOAD BINER ---\s+([01\s]+)\s+--------------------/);
  assert(!!binMatch, 'Crypto 2 binary payload block parsed');
  if (binMatch) {
    const binStr = binMatch[1].replace(/\s+/g, '');
    let hexStr = '';
    for (let i = 0; i < binStr.length; i += 8) {
      const byte = binStr.substr(i, 8);
      hexStr += String.fromCharCode(parseInt(byte, 2));
    }
    const b64Str = Buffer.from(hexStr, 'hex').toString('utf8');
    const finalPlain = Buffer.from(b64Str, 'base64').toString('utf8');
    assert(finalPlain.includes('CTF{tiga_lapis_encoding_biner_hex_base64}'), 'Crypto 2 (Bin -> Hex -> B64) 3-layer solver recovers flag');
  }

  // Crypto 3: Single-byte XOR
  const hexCipher = fs.readFileSync(path.join(downloadsDir, 'ciphertext_xor.hex'), 'utf8').trim();
  const cipherBuf = Buffer.from(hexCipher, 'hex');
  let xorSolved = false;
  for (let k = 0; k < 256; k++) {
    const decrypted = Buffer.alloc(cipherBuf.length);
    for (let i = 0; i < cipherBuf.length; i++) {
      decrypted[i] = cipherBuf[i] ^ k;
    }
    const str = decrypted.toString('utf8');
    if (str.includes('CTF{single_byte_xor_kunci_terbongkar}')) {
      xorSolved = true;
      break;
    }
  }
  assert(xorSolved, 'Crypto 3 (Single-byte XOR brute force 0-255) recovers flag');

  // Crypto 4: Vigenère
  const vigContent = fs.readFileSync(path.join(downloadsDir, 'sandi_vigenere.txt'), 'utf8');
  const vigMatch = vigContent.match(/--- CIPHERTEXT ---\s+([\s\S]+?)\s+------------------/);
  assert(!!vigMatch, 'Crypto 4 ciphertext parsed');
  if (vigMatch) {
    const cipher = vigMatch[1].trim();
    const key = "RAHASIA";
    let plain = '';
    let kIdx = 0;
    for (let i = 0; i < cipher.length; i++) {
      const c = cipher[i];
      if (c >= 'A' && c <= 'Z') {
        const shift = key.charCodeAt(kIdx % key.length) - 65;
        plain += String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        kIdx++;
      } else if (c >= 'a' && c <= 'z') {
        const shift = key.charCodeAt(kIdx % key.length) - 65;
        plain += String.fromCharCode(((c.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        kIdx++;
      } else {
        plain += c;
      }
    }
    assert(plain.includes('CTF{sandi_vigenere_kunci_rahasia}'), 'Crypto 4 (Vigenère with key RAHASIA) decodes flag');
  }

  // Forensics 1: Metadata EXIF in bukti_gambar.jpg
  const img1Buf = fs.readFileSync(path.join(downloadsDir, 'bukti_gambar.jpg'));
  assert(img1Buf.includes('CTF{metadata_exif_gambar_ditemukan}'), 'Forensics 1 contains embedded EXIF & COM metadata flag');

  // Forensics 2: PNG header repair in berkas_rusak.png
  const pngBuf = fs.readFileSync(path.join(downloadsDir, 'berkas_rusak.png'));
  assert(pngBuf.slice(0, 8).every(b => b === 0), 'Forensics 2 begins with corrupted 8 null bytes');
  const b64Token = Buffer.from("CTF{magic_bytes_png_berhasil_diperbaiki}").toString('base64');
  assert(pngBuf.includes(b64Token), 'Forensics 2 contains embedded Base64 token in text chunk');
  const decodedF2 = Buffer.from(b64Token, 'base64').toString('utf8');
  assert(decodedF2 === "CTF{magic_bytes_png_berhasil_diperbaiki}", 'Forensics 2 Base64 token decodes to authentic flag');

  // Forensics 3: Appended ZIP in foto_penyamaran.jpg
  const jpgStegoBuf = fs.readFileSync(path.join(downloadsDir, 'foto_penyamaran.jpg'));
  const zipMagic = Buffer.from([0x50, 0x4B, 0x03, 0x04]);
  const zipIdx = jpgStegoBuf.indexOf(zipMagic);
  assert(zipIdx > 0, `Forensics 3 contains embedded ZIP at offset 0x${zipIdx.toString(16).toUpperCase()}`);
  
  // Extract and decompress embedded zip entry without external tools
  let zipExtracted = false;
  try {
    // Find local file header
    const zipData = jpgStegoBuf.slice(zipIdx);
    // Parse zip local header: offset 26 has filename length, offset 28 has extra length
    const fileNameLen = zipData.readUInt16LE(26);
    const extraLen = zipData.readUInt16LE(28);
    const compMethod = zipData.readUInt16LE(8);
    const compSize = zipData.readUInt32LE(18);
    const dataOffset = 30 + fileNameLen + extraLen;
    const compData = zipData.slice(dataOffset, dataOffset + compSize);
    
    let uncompressedData;
    if (compMethod === 8) {
      uncompressedData = zlib.inflateRawSync(compData).toString('utf8');
    } else {
      uncompressedData = compData.toString('utf8');
    }
    if (uncompressedData.includes('CTF{arsip_zip_tersembunyi_di_gambar}')) {
      zipExtracted = true;
    }
  } catch (e) {
    // fallback test
  }
  assert(zipExtracted, 'Forensics 3 appended ZIP archive successfully decompressed to reveal flag');

  // Forensics 4: PCAP Packet capture
  const pcapBuf = fs.readFileSync(path.join(downloadsDir, 'rekaman_jaringan.pcap'));
  assert(pcapBuf.includes('CTF{analisis_paket_jaringan_http_wireshark}'), 'Forensics 4 PCAP contains plaintext HTTP stream flag');

  console.log("\n3. SERVER API, CHALLENGES, AND SECURITY SUITE");
  const env = { ...process.env, PORT: '3099' };
  const srv = spawn('node', ['server.js'], { cwd: ctfRoot, env });

  srv.stderr.on('data', d => {
    // Ignore harmless warnings
    const s = d.toString();
    if (!s.includes('libpcap')) {
      console.error(`[SERVER LOG]: ${s}`);
    }
  });

  // Wait for server boot
  await new Promise(r => setTimeout(r, 1200));

  function request(options, postData = null) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      });
      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }

  try {
    // /api/me (Unauthenticated visit on first landing)
    const meRes = await request({ hostname: 'localhost', port: 3099, path: '/api/me', method: 'GET' });
    assert(meRes.status === 200, 'GET /api/me returns 200 OK');
    const meData = JSON.parse(meRes.body);
    assert(meData.user === null, 'Unauthenticated visitor does not default to player1 (user is null)');

    // Unauthenticated flag submission rejected with 401
    const anonSub = JSON.stringify({ challengeId: 'crypto-1', flag: 'CTF{test}' });
    const anonRes = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/submit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(anonSub) }
    }, anonSub);
    assert(anonRes.status === 401, 'Unauthenticated submission safely blocked with 401 Unauthorized');

    // /api/challenges
    const chRes = await request({ hostname: 'localhost', port: 3099, path: '/api/challenges', method: 'GET' });
    assert(chRes.status === 200, 'GET /api/challenges returns 200 OK');
    const chData = JSON.parse(chRes.body);
    assert(chData.length === 12, 'All 12 challenges returned');
    assert(!chData.some(c => c.flag), 'Raw flags strictly hidden/sanitized from public API');

    // /api/scoreboard & analytics
    const sbRes = await request({ hostname: 'localhost', port: 3099, path: '/api/scoreboard', method: 'GET' });
    assert(sbRes.status === 200, 'GET /api/scoreboard returns 200 OK');
    const anRes = await request({ hostname: 'localhost', port: 3099, path: '/api/analytics', method: 'GET' });
    assert(anRes.status === 200, 'GET /api/analytics returns 200 OK');
    const anData = JSON.parse(anRes.body);
    assert(anData.topUser && typeof anData.topUser.username === 'string', 'Analytics topUser fallback is well-formed');

    // Web 1
    const web1Res = await request({ hostname: 'localhost', port: 3099, path: '/challenges/web/1', method: 'GET' });
    assert(web1Res.headers['x-flag-rahasia'] === 'CTF{inspeksi_header_tersembunyi}', 'Web-1 transmits flag via X-Flag-Rahasia header');

    // Web 2
    const web2Robots = await request({ hostname: 'localhost', port: 3099, path: '/challenges/web/2/robots.txt', method: 'GET' });
    assert(web2Robots.body.includes('brankas-rahasia-78923'), 'Web-2 robots.txt exposes hidden vault');
    const web2Vault = await request({ hostname: 'localhost', port: 3099, path: '/challenges/web/2/brankas-rahasia-78923', method: 'GET' });
    assert(web2Vault.body.includes('CTF{jejak_robots_txt_terbongkar}'), 'Web-2 vault displays secret flag');

    // Web 3 (Cookie Path & Role check)
    const web3Initial = await request({ hostname: 'localhost', port: 3099, path: '/challenges/web/3', method: 'GET' });
    const setCookie = web3Initial.headers['set-cookie'] ? web3Initial.headers['set-cookie'].join(';') : '';
    assert(setCookie.includes('Path=/'), 'Web-3 sets peran_pengguna cookie with root Path=/');
    const web3Admin = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/challenges/web/3',
      method: 'GET',
      headers: { 'Cookie': 'peran_pengguna=admin' }
    });
    assert(web3Admin.body.includes('CTF{manipulasi_cookie_admin_sukses}'), 'Web-3 grants admin access and flag when role=admin');

    // Web 4 (SQLi variations)
    const sqliPayloads = [
      "' OR '1'='1",
      "' OR 1=1 --",
      "' OR 'a'='a",
      "admin'#"
    ];
    let sqliAllPassed = true;
    for (const payload of sqliPayloads) {
      const p = 'username=' + encodeURIComponent(payload) + '&password=x';
      const r = await request({
        hostname: 'localhost',
        port: 3099,
        path: '/challenges/web/4/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(p) }
      }, p);
      if (!r.body.includes('CTF{bypass_sqli_login_berhasil}')) {
        sqliAllPassed = false;
        console.error(`  [DEBUG] Payload failed: ${payload}`);
      }
    }
    assert(sqliAllPassed, 'Web-4 accepts standard SQLi bypass variations (\' OR \'1\'=\'1, \' OR \'a\'=\'a, admin\'#)');

    // Path traversal security check
    const travRes = await request({ hostname: 'localhost', port: 3099, path: '/api/download/..%2f..%2fpackage.json', method: 'GET' });
    assert(travRes.status === 400, 'Security: Path traversal attempt on file download safely rejected (400)');

    // Submission flow with clean test user
    const newUserPayload = JSON.stringify({ username: 'audit_bot_' + Date.now().toString(36), name: 'Audit Bot' });
    const uRes = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/user/create',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(newUserPayload) }
    }, newUserPayload);
    const authCookie = uRes.headers['set-cookie'] ? uRes.headers['set-cookie'][0].split(';')[0] : '';
    assert(uRes.status === 200, 'Test user registered');

    // Submit invalid flag
    const badSub = JSON.stringify({ challengeId: 'crypto-1', flag: 'CTF{wrong}' });
    const badRes = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/submit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(badSub), 'Cookie': authCookie }
    }, badSub);
    assert(JSON.parse(badRes.body).success === false, 'Invalid flag submission correctly rejected');

    // Submit valid flag
    const goodSub = JSON.stringify({ challengeId: 'crypto-1', flag: 'CTF{sandi_caesar_rot13_dasar}' });
    const goodRes = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/submit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(goodSub), 'Cookie': authCookie }
    }, goodSub);
    const goodData = JSON.parse(goodRes.body);
    assert(goodData.success === true && goodData.points === 100, 'Valid flag submission accepted and rewarded points');

    // Submit duplicate flag
    const dupRes = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/submit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(goodSub), 'Cookie': authCookie }
    }, goodSub);
    assert(JSON.parse(dupRes.body).success === false, 'Duplicate challenge solve blocked');

    // Logout flow
    const logoutRes = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/user/logout',
      method: 'POST',
      headers: { 'Cookie': authCookie }
    });
    assert(logoutRes.status === 200, 'POST /api/user/logout succeeds (200 OK)');

    // Login with existing username
    const botUserObj = JSON.parse(newUserPayload);
    const loginPayload = JSON.stringify({ username: botUserObj.username });
    const loginRes = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/user/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
    }, loginPayload);
    assert(loginRes.status === 200, 'POST /api/user/login succeeds with registered username');
    const loginData = JSON.parse(loginRes.body);
    assert(loginData.user && loginData.user.username === botUserObj.username, 'Logged in user data matches');

  } finally {
    srv.kill();
    // Restore pristine data state
    fs.writeFileSync(solvesPath, solvesBackup, 'utf8');
    fs.writeFileSync(usersPath, usersBackup, 'utf8');
    console.log("\n[STATE ROLLBACK] Database files restored to original pristine state.");
  }

  console.log("\n===============================================================");
  console.log(`TEST SUITE RESULTS: ${results.passed} PASSED, ${results.failed} FAILED`);
  console.log("===============================================================");

  if (results.failed > 0) {
    process.exit(1);
  }
}

runCTFTestSuite().catch(err => {
  console.error("Test execution encountered an error:", err);
  process.exit(1);
});
