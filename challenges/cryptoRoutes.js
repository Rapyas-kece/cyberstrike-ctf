const express = require('express');
const router = express.Router();

// Helper CSS styles for Crypto Challenges (matching Web lab theme)
const challengePageTemplate = (title, clue, content) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Lab Kriptografi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card: #131c2e;
      --border: #1e293b;
      --neon-purple: #a855f7;
      --neon-cyan: #06b6d4;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #1e1b4b, var(--bg));
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1rem;
    }
    .container {
      max-width: 760px;
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(168, 85, 247, 0.15);
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(168, 85, 247, 0.15);
      color: var(--neon-purple);
      border: 1px solid rgba(168, 85, 247, 0.3);
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #fff, var(--neon-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .clue-tag {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1.75rem;
    }
    .content-box {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .flag-box {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      padding: 1.25rem;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #34d399;
      font-size: 1.15rem;
      text-align: center;
      margin: 1.5rem 0;
      word-break: break-all;
    }
    .cipher-block {
      background: #0b1120;
      padding: 1.25rem;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #c084fc;
      word-break: break-all;
      margin: 1rem 0;
      border: 1px solid rgba(168, 85, 247, 0.2);
      max-height: 200px;
      overflow-y: auto;
    }
    .tool-section {
      background: rgba(168, 85, 247, 0.08);
      border: 1px dashed rgba(168, 85, 247, 0.3);
      padding: 1.25rem;
      border-radius: 8px;
      margin: 1.25rem 0;
    }
    .tool-section h4 {
      color: #c084fc;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }
    textarea {
      width: 100%;
      background: #0b1120;
      border: 1px solid #334155;
      padding: 0.75rem 1rem;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      border-radius: 8px;
      font-size: 0.9rem;
      resize: vertical;
      min-height: 80px;
      outline: none;
    }
    textarea:focus { border-color: var(--neon-purple); }
    button {
      background: linear-gradient(135deg, #a855f7, #6366f1);
      color: #fff;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
      transition: transform 0.15s, opacity 0.2s;
      margin-top: 0.75rem;
    }
    button:hover { opacity: 0.92; transform: translateY(-1px); }
    .result-box {
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 1rem;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      color: #a5f3fc;
      font-size: 0.9rem;
      margin-top: 1rem;
      word-break: break-all;
      display: none;
    }
    .download-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(168, 85, 247, 0.15);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #c084fc;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
      margin: 0.5rem 0;
    }
    .download-link:hover { background: rgba(168, 85, 247, 0.25); }
    .back-btn {
      display: inline-block;
      margin-top: 1.5rem;
      color: var(--neon-purple);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .back-btn:hover { text-decoration: underline; }
    .step-indicator {
      display: inline-block;
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
      font-weight: 800;
      font-size: 0.75rem;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Laboratorium Kriptografi</span>
    <h1>${title}</h1>
    <p class="clue-tag">Petunjuk Teknis: <strong style="color: #c084fc;">${clue}</strong></p>
    ${content}
    <div>
      <a href="/" class="back-btn">&larr; Kembali ke Platform CTF</a>
    </div>
  </div>
</body>
</html>
`;

// ==========================================================
// Tantangan Crypto 1: Sandi Pergeseran Romawi (ROT13)
// ==========================================================
router.get('/1', (req, res) => {
  // ROT13 encrypted text (same as in generate_artifacts.py)
  const encryptedText = `[CRFNA GRERAXEVCFV - XYNFVSVXNFV ENUNFVN]
Crzoreevgnuhna Fvfgrz:
Crfna enunfvn vav qvnznaxna zratthanxna nyybevgzn cretrfrena nysnoeg xynfvx mnzna Ebjnav (Pnrfne Pvcure qratan cretrfrena 13 uhehs ngnh EBG13).
Thhanxna qrpbqre EBG13 haghx zrzoonpn grxf nfyv qna zraqncngxna synt orevxhg:

SYNT: PGS{fnaqv_pnrfne_ebg13_qnfne}

Frzbtb oreunfvy!`;

  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #c084fc;">Terminal Kriptanalisis: Dekripsi Sandi Pergeseran</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Pesan komunikasi militer lama ini diamankan menggunakan metode pergeseran alfabet klasik zaman Romawi. 
        Sandi Caesar dengan pergeseran 13 huruf (ROT13) adalah salah satu metode enkripsi paling sederhana namun sering digunakan 
        untuk menyembunyikan teks.
      </p>
      <div class="cipher-block">${encryptedText.replace(/\n/g, '<br>')}</div>
    </div>

    <div class="tool-section">
      <h4>🔧 Dekoder ROT13 Interaktif</h4>
      <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">
        Tempel teks terenkripsi di bawah, lalu klik tombol untuk mendekode:
      </p>
      <textarea id="rot13-input" placeholder="Tempel ciphertext ROT13 di sini...">${encryptedText}</textarea>
      <button onclick="decodeROT13()">Dekode ROT13</button>
      <div id="rot13-result" class="result-box"></div>
    </div>

    <a href="/api/download/pesan_rot13.txt" class="download-link">
      📥 Unduh Berkas Soal (pesan_rot13.txt)
    </a>

    <script>
      function decodeROT13() {
        const input = document.getElementById('rot13-input').value;
        const decoded = input.replace(/[a-zA-Z]/g, c => {
          const base = c <= 'Z' ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
        const resultEl = document.getElementById('rot13-result');
        resultEl.style.display = 'block';
        resultEl.textContent = decoded;
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Setiap huruf digeser 13 posisi dalam alfabet. A→N, B→O, dst. 
      Gunakan decoder di atas atau CyberChef dengan resep "ROT13".</em>
    </p>
  `;

  res.send(challengePageTemplate("Sandi Pergeseran Romawi", "Caesar Cipher & Algoritma ROT13", content));
});

// ==========================================================
// Tantangan Crypto 2: Enkripsi Tiga Lapis
// ==========================================================
router.get('/2', (req, res) => {
  // Binary from generate_artifacts.py
  const flag = "CTF{tiga_lapis_encoding_biner_hex_base64}";
  const step1_b64 = Buffer.from(flag).toString('base64');
  const step2_hex = Buffer.from(step1_b64).toString('hex');
  const binaryStr = Buffer.from(step2_hex).reduce((acc, byte) => acc + byte.toString(2).padStart(8, '0') + ' ', '').trim();

  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #c084fc;">Terminal Dekoding Multi-Tahap</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Teks flag telah disamarkan melewati 3 tahapan enkodir. Anda harus membalikkan prosesnya secara berurutan.
      </p>
      <div style="margin-bottom: 1rem;">
        <span class="step-indicator">TAHAP 3</span> <strong style="color: #f472b6;">Biner 8-bit</strong> → 
        <span class="step-indicator">TAHAP 2</span> <strong style="color: #fbbf24;">Heksadesimal</strong> → 
        <span class="step-indicator">TAHAP 1</span> <strong style="color: #34d399;">Base64</strong> → 
        <strong style="color: #fff;">Plaintext</strong>
      </div>
      <p style="color: #94a3b8; font-size: 0.85rem;">Payload biner yang perlu didekode:</p>
      <div class="cipher-block" style="font-size: 0.8rem; line-height: 1.8;">${binaryStr}</div>
    </div>

    <div class="tool-section">
      <h4>🔧 Konverter Sandbox Biner & Heksadesimal</h4>
      <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">
        Gunakan alat bantu konversi bertahap untuk menguji langkah dekode Anda sendiri:
      </p>
      <input type="text" id="bin-input" placeholder="Masukkan potongan biner 8-bit (pisahkan spasi)..." style="width: 100%; background: #0b1120; border: 1px solid #334155; padding: 0.6rem 0.8rem; color: #fff; font-family: monospace; border-radius: 6px; font-size: 0.85rem; margin-bottom: 0.5rem;">
      <button onclick="testDecodeBinary()">Konversi Biner ke Teks/Hex</button>
      <div id="sandbox-result" class="result-box"></div>
    </div>

    <a href="/api/download/rahasia_tiga_lapis.txt" class="download-link">
      📥 Unduh Berkas Soal (rahasia_tiga_lapis.txt)
    </a>

    <script>
      function testDecodeBinary() {
        const val = document.getElementById('bin-input').value.trim();
        if (!val) { alert('Masukkan biner terlebih dahulu!'); return; }
        try {
          const bytes = val.split(/\\s+/).map(b => parseInt(b, 2));
          const text = String.fromCharCode(...bytes);
          const el = document.getElementById('sandbox-result');
          el.style.display = 'block';
          el.innerHTML = '<strong style="color: #38bdf8;">Hasil Konversi:</strong><br>' + text.replace(/</g, '&lt;');
        } catch(e) {
          alert('Error: ' + e.message);
        }
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Buka CyberChef dan gunakan resep: 1. From Binary (Delimiter: Space) ➔ 2. From Hex ➔ 3. From Base64 untuk membuka seluruh lapisan.</em>
    </p>
  `;

  res.send(challengePageTemplate("Enkripsi Tiga Lapis", "Dekode Bertahap (Biner ➔ Hex ➔ Base64)", content));
});

// ==========================================================
// Tantangan Crypto 3: Teka-Teki Kunci Tunggal XOR
// ==========================================================
router.get('/3', (req, res) => {
  const flag = "CTF{single_byte_xor_kunci_terbongkar}";
  const xorKey = 0x5A;
  const cipherHex = Buffer.from(flag).map(b => b ^ xorKey).reduce((acc, b) => acc + b.toString(16).padStart(2, '0'), '');

  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #c084fc;">Terminal Pengujian Kunci XOR</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Ciphertext di bawah ini diamankan dengan operasi XOR 1-byte kunci rahasia (antara 0 hingga 255).
        Cari kunci yang tepat melalui analisis frekuensi, scripting Python, atau CyberChef XOR Brute Force.
      </p>
      <p style="color: #94a3b8; font-size: 0.85rem;">Ciphertext (Heksadesimal):</p>
      <div class="cipher-block">${cipherHex}</div>
    </div>

    <div class="tool-section">
      <h4>🔬 Uji Coba Kunci Tunggal (Manual Tester)</h4>
      <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">
        Masukkan nilai kunci (angka desimal 0-255 atau hex 0x00-0xFF) untuk menguji hasil dekripsi dengan kunci tersebut:
      </p>
      <div style="display: flex; gap: 0.5rem; align-items: center; max-width: 320px;">
        <input type="text" id="test-key" placeholder="Contoh: 65 atau 0x41" style="background: #0b1120; border: 1px solid #334155; padding: 0.6rem 0.8rem; color: #fff; font-family: monospace; border-radius: 6px; flex: 1;">
        <button onclick="testSingleKey()" style="white-space: nowrap;">Uji Kunci</button>
      </div>
      <div id="test-result" class="result-box"></div>
    </div>

    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      <a href="/api/download/ciphertext_xor.hex" class="download-link">
        📥 Unduh Ciphertext (ciphertext_xor.hex)
      </a>
    </div>

    <script>
      function testSingleKey() {
        const keyInput = document.getElementById('test-key').value.trim();
        let key = NaN;
        if (keyInput.startsWith('0x') || keyInput.startsWith('0X')) {
          key = parseInt(keyInput, 16);
        } else {
          key = parseInt(keyInput, 10);
        }
        if (isNaN(key) || key < 0 || key > 255) {
          alert('Masukkan angka kunci yang valid antara 0 sampai 255!');
          return;
        }

        const cipherHex = "${cipherHex}";
        const cipherBytes = [];
        for (let i = 0; i < cipherHex.length; i += 2) {
          cipherBytes.push(parseInt(cipherHex.substr(i, 2), 16));
        }

        const decoded = cipherBytes.map(b => b ^ key);
        const text = String.fromCharCode(...decoded);

        const el = document.getElementById('test-result');
        el.style.display = 'block';
        el.innerHTML = '<strong>Kunci Diuji:</strong> ' + key + ' (0x' + key.toString(16).toUpperCase().padStart(2, '0') + ')<br>' +
          '<strong>Hasil Dekripsi:</strong><br><span style="font-family: monospace; color: #38bdf8;">' + text.replace(/</g, '&lt;') + '</span>';
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Gunakan loop dari 0 sampai 255 untuk meng-XOR setiap byte ciphertext. Flag yang benar mengandung format "CTF{...}".</em>
    </p>
  `;

  res.send(challengePageTemplate("Teka-Teki Kunci Tunggal XOR", "Single-Byte XOR Brute Force (0-255)", content));
});

// ==========================================================
// Tantangan Crypto 4: Misteri Sandi Polialfabetik (Vigenère)
// ==========================================================
router.get('/4', (req, res) => {
  // Vigenère encrypt the text (same as generate_artifacts.py)
  function vigenereEncrypt(plain, key) {
    key = key.toUpperCase();
    let out = [], kIdx = 0;
    for (const c of plain) {
      if (c >= 'a' && c <= 'z') {
        const shift = key.charCodeAt(kIdx % key.length) - 65;
        out.push(String.fromCharCode(((c.charCodeAt(0) - 97 + shift) % 26) + 97));
        kIdx++;
      } else if (c >= 'A' && c <= 'Z') {
        const shift = key.charCodeAt(kIdx % key.length) - 65;
        out.push(String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65));
        kIdx++;
      } else {
        out.push(c);
      }
    }
    return out.join('');
  }

  const ciphertext = vigenereEncrypt(
    "CATATAN RAHASIA OPERASI: KODE VERIFIKASI ADALAH CTF{sandi_vigenere_kunci_rahasia}. SIMPAN DENGAN AMAN.",
    "RAHASIA"
  );

  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #c084fc;">Terminal Dekripsi Sandi Vigenère</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Dokumen rahasia ini dienkripsi menggunakan sandi Vigenère polialfabetik klasik. 
        Berbeda dengan Caesar Cipher yang menggunakan satu pergeseran tetap, Vigenère menggunakan kata kunci 
        untuk menentukan pergeseran yang berbeda untuk setiap huruf.
      </p>
      <p style="color: #fbbf24; font-weight: 600; margin-bottom: 0.5rem;">Kata Kunci Dekripsi: <code style="background: rgba(251, 191, 36, 0.15); padding: 0.2rem 0.5rem; border-radius: 4px;">RAHASIA</code></p>
      <div class="cipher-block">${ciphertext}</div>
    </div>

    <div class="tool-section">
      <h4>🔧 Dekoder Vigenère Interaktif</h4>
      <textarea id="vig-input" placeholder="Tempel ciphertext Vigenère di sini...">${ciphertext}</textarea>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem;">
        <label style="color: #94a3b8; font-size: 0.85rem; white-space: nowrap;">Kunci:</label>
        <input type="text" id="vig-key" value="RAHASIA" style="
          flex: 1; background: #0b1120; border: 1px solid #334155; padding: 0.6rem 0.8rem;
          color: #fbbf24; font-family: 'JetBrains Mono', monospace; border-radius: 6px;
          font-size: 0.95rem; font-weight: 700; outline: none;
        ">
      </div>
      <button onclick="decodeVigenere()">Dekripsi Vigenère</button>
      <div id="vig-result" class="result-box"></div>
    </div>

    <a href="/api/download/sandi_vigenere.txt" class="download-link">
      📥 Unduh Berkas Soal (sandi_vigenere.txt)
    </a>

    <script>
      function decodeVigenere() {
        const cipher = document.getElementById('vig-input').value;
        const key = document.getElementById('vig-key').value.toUpperCase();
        if (!key) { alert('Masukkan kata kunci!'); return; }

        let out = [], kIdx = 0;
        for (const c of cipher) {
          if (c >= 'a' && c <= 'z') {
            const shift = key.charCodeAt(kIdx % key.length) - 65;
            out.push(String.fromCharCode(((c.charCodeAt(0) - 97 - shift + 26) % 26) + 97));
            kIdx++;
          } else if (c >= 'A' && c <= 'Z') {
            const shift = key.charCodeAt(kIdx % key.length) - 65;
            out.push(String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65));
            kIdx++;
          } else {
            out.push(c);
          }
        }

        const result = out.join('');
        const el = document.getElementById('vig-result');
        el.style.display = 'block';
        if (result.includes('CTF{')) {
          el.innerHTML = '<strong style="color: #34d399;">🎯 Dekripsi Berhasil!</strong><br><br>' + result;
        } else {
          el.innerHTML = '<span style="color: #fbbf24;">Hasil dekripsi (cek apakah kunci sudah benar):</span><br><br>' + result;
        }
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Gunakan decoder Vigenère (CyberChef atau dcode.fr) dengan memasukkan kunci: RAHASIA.</em>
    </p>
  `;

  res.send(challengePageTemplate("Misteri Sandi Polialfabetik", "Sandi Vigenère (Kunci: RAHASIA)", content));
});

module.exports = router;
