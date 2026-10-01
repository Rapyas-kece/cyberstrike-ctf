const express = require('express');
const router = express.Router();

// Helper CSS styles for Web Challenges (Cyber Dark Theme - Full Bahasa Indonesia)
const challengePageTemplate = (title, clue, content) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Lab Eksploitasi Web</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card: #131c2e;
      --border: #1e293b;
      --neon-cyan: #06b6d4;
      --neon-purple: #8b5cf6;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #172554, var(--bg));
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1rem;
    }
    .container {
      max-width: 720px;
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(6, 182, 212, 0.15);
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
      background: rgba(6, 182, 212, 0.15);
      color: var(--neon-cyan);
      border: 1px solid rgba(6, 182, 212, 0.3);
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #fff, var(--neon-cyan));
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
    .error-box {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #ef4444;
      padding: 1rem;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      color: #f87171;
      font-size: 0.95rem;
      margin: 1rem 0;
    }
    input[type="text"], input[type="password"] {
      width: 100%;
      background: #0b1120;
      border: 1px solid #334155;
      padding: 0.75rem 1rem;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      border-radius: 8px;
      font-size: 0.95rem;
      margin-top: 0.35rem;
      margin-bottom: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="text"]:focus, input[type="password"]:focus {
      border-color: var(--neon-cyan);
    }
    button {
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      color: #fff;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
      transition: transform 0.15s, opacity 0.2s;
    }
    button:hover { opacity: 0.92; transform: translateY(-1px); }
    .back-btn {
      display: inline-block;
      margin-top: 1.5rem;
      color: var(--neon-cyan);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .back-btn:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Laboratorium Eksploitasi Web</span>
    <h1>${title}</h1>
    <p class="clue-tag">Petunjuk Teknis: <strong style="color: #38bdf8;">${clue}</strong></p>
    ${content}
    <div>
      <a href="/" class="back-btn">&larr; Kembali ke Platform CTF</a>
    </div>
  </div>
</body>
</html>
`;

// ==========================================================
// Tantangan 1: Inspeksi Header Tersembunyi
// ==========================================================
router.get('/1', (req, res) => {
  // Set flag in custom HTTP Response Header
  res.setHeader('X-Flag-Rahasia', 'CTF{inspeksi_header_tersembunyi}');
  res.setHeader('X-Kebijakan-Keamanan', 'Pemeriksaan-Header-HTTP');

  const content = `
    <!-- 
      [CATATAN INTERNAL AUDITOR SIBER]
      Hebat! Anda berhasil membuka DevTools / Inspect Element.
      Namun, token flag rahasia yang sebenarnya ditransmisikan melalui HTTP Response Header server.
      Periksa tab Network -> Headers pada request ini, atau gunakan perintah curl untuk melihat header 'X-Flag-Rahasia'!
    -->
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #38bdf8;">Terminal 01: Gerbang Inspeksi Klien & Server</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Selamat datang analis. Banyak developer lupa bahwa browser mengekspos metadata sisi klien secara transparan, 
        termasuk komentar kode sumber HTML serta header respons HTTP yang dikirimkan oleh server.
      </p>
      <div style="background: #0b1120; padding: 1rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #a5f3fc;">
        Status Sistem: AKTIF ONLINE<br>
        Tingkat Pengamanan: Dasar (Level 1)<br>
        Protokol: HTTP/1.1<br>
        Catatan: Periksa seluruh data yang ditransmisikan antara server dan peramban web Anda.
      </div>
    </div>
    <p style="font-size: 0.9rem; color: #94a3b8;">
      💡 <em>Petunjuk: Buka DevTools (tekan tombol F12 atau Ctrl+Shift+I), periksa tab Elements untuk komentar HTML, dan tab Network / Headers untuk menemukan header <code>X-Flag-Rahasia</code>!</em>
    </p>
  `;

  res.send(challengePageTemplate("Inspeksi Header Tersembunyi", "Periksa HTML Comments & HTTP Response Header", content));
});

// ==========================================================
// Tantangan 2: Jejak Robot Terlarang
// ==========================================================
router.get('/2/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /challenges/web/2/brankas-rahasia-78923
# Direktif: Mesin perayap web dilarang mengindeks direktori brankas rahasia!
`);
});

router.get('/2', (req, res) => {
  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #38bdf8;">Terminal 02: Pertahanan Jalur Pengindeksan</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Administrator telah mengonfigurasi berkas direktif standar untuk melarang bot mesin pencari mengindeks jalur dokumen rahasia.
        Dapatkah Anda menemukan berkas standar yang biasa diakses oleh mesin pencari untuk mengetahui halaman mana yang dilarang?
      </p>
      <div style="background: #0b1120; padding: 1rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #fbbf24;">
        Protokol Aktif: Standard Robots Exclusion Protocol (RFC 9309)<br>
        Jalur Berkas: /challenges/web/2/robots.txt
      </div>
    </div>
    <p style="font-size: 0.9rem; color: #94a3b8;">
      💡 <em>Petunjuk: Buka URL <a href="/challenges/web/2/robots.txt" target="_blank" style="color: #06b6d4;">/challenges/web/2/robots.txt</a> pada browser untuk melihat direktori yang disembunyikan.</em>
    </p>
  `;
  res.send(challengePageTemplate("Jejak Robot Terlarang", "Eksplorasi Berkas Direktif /robots.txt", content));
});

// Hidden vault for Challenge 2
router.get('/2/brankas-rahasia-78923', (req, res) => {
  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #34d399;">AREA TERLARANG: BRANKAS RAHASIA BERHASIL DITEMUKAN</h3>
      <p style="color: #cbd5e1; line-height: 1.6;">
        Anda berhasil mengikuti jejak berkas robots.txt! Mesin pencari dilarang mengunjungi halaman ini, namun berkas robots.txt dapat dibaca secara publik oleh siapapun.
      </p>
      <div class="flag-box">
        CTF{jejak_robots_txt_terbongkar}
      </div>
    </div>
  `;
  res.send(challengePageTemplate("Brankas Rahasia Terbuka", "Akses Jalur Disallow Robots", content));
});

// ==========================================================
// Tantangan 3: Pemalsuan Cookie Akses
// ==========================================================
router.get('/3', (req, res) => {
  let role = req.cookies['peran_pengguna'];
  
  if (!role) {
    role = 'tamu';
    res.cookie('peran_pengguna', 'tamu', { path: '/', httpOnly: false });
  }

  let content = '';

  if (role === 'admin') {
    content = `
      <div class="content-box">
        <h3 style="margin-bottom: 0.75rem; color: #34d399;">TINGKAT OTORISASI: ADMINISTRATOR</h3>
        <p style="color: #cbd5e1; line-height: 1.6;">
          Selamat! Anda berhasil mengubah nilai cookie <code>peran_pengguna</code> menjadi <code>admin</code>. 
          Pemberian hak akses tidak boleh hanya mempercayai cookie dari browser tanpa validasi tanda tangan kriptografi di sisi server!
        </p>
        <div class="flag-box">
          CTF{manipulasi_cookie_admin_sukses}
        </div>
      </div>
    `;
  } else {
    content = `
      <div class="content-box">
        <h3 style="margin-bottom: 0.75rem; color: #f87171;">TINGKAT OTORISASI: TAMU (HAK AKSES TERBATAS)</h3>
        <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
          Saat ini Anda teridentifikasi dengan peran: <strong style="color: #fbbf24;">${role}</strong>.
          Panel kontrol rahasia hanya dapat diakses oleh peran <code style="color: #38bdf8;">admin</code>.
        </p>
        <div style="background: #0b1120; padding: 1rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #94a3b8;">
          Cookie Aktif: <span style="color: #38bdf8;">peran_pengguna=${role}</span><br>
          Metode Verifikasi: Pengecekan Cookie Klien Tanpa Tanda Tangan
        </div>
      </div>
      <p style="font-size: 0.9rem; color: #94a3b8;">
        💡 <em>Petunjuk: Buka DevTools (F12) ➔ tab Application ➔ Cookies. Ubah nilai <code>peran_pengguna</code> dari <code>tamu</code> menjadi <code>admin</code>, lalu refresh halaman!</em>
      </p>
      <div style="margin-top: 1rem;">
        <button onclick="document.cookie='peran_pengguna=admin;path=/'; location.reload();" style="background: #334155; font-size: 0.85rem;">
          [Tombol Cepat: Simulasikan Ubah Cookie Menjadi Admin]
        </button>
      </div>
    `;
  }

  res.send(challengePageTemplate("Pemalsuan Cookie Akses", "Manipulasi Nilai Cookie Sisi Klien", content));
});

// ==========================================================
// Tantangan 4: Gerbang Login Injeksi SQL
// ==========================================================
router.get('/4', (req, res) => {
  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #38bdf8;">Gerbang Otentikasi Mainframe</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1.25rem;">
        Sistem otentikasi darurat ini memvalidasi kredensial pengguna menggunakan logika kueri basis data yang rentan terhadap injeksi string:
      </p>
      <div style="background: #0b1120; padding: 0.75rem 1rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #f472b6; margin-bottom: 1.5rem;">
        SELECT * FROM pengguna WHERE nama_pengguna = '$username' AND kata_sandi = '$password';
      </div>

      <form action="/challenges/web/4/login" method="POST">
        <label style="font-size: 0.85rem; color: #cbd5e1; font-weight: 600;">Nama Pengguna (Username)</label>
        <input type="text" name="username" placeholder="Contoh: admin atau payload injeksi SQL" required autocomplete="off">

        <label style="font-size: 0.85rem; color: #cbd5e1; font-weight: 600;">Kata Sandi (Password)</label>
        <input type="password" name="password" placeholder="Kata sandi (bebas jika berhasil di-bypass)" autocomplete="off">

        <button type="submit">Masuk ke Mainframe</button>
      </form>
    </div>
    <p style="font-size: 0.9rem; color: #94a3b8;">
      💡 <em>Petunjuk: Payload bypass otentikasi SQL Injection klasik: <code>' OR '1'='1</code>, <code>admin' --</code>, atau <code>' OR 1=1 --</code></em>
    </p>
  `;
  res.send(challengePageTemplate("Gerbang Login Injeksi SQL", "Bypass Otentikasi SQL Injection Klasik", content));
});

router.post('/4/login', (req, res) => {
  const { username = '', password = '' } = req.body;
  const cleanUser = username.trim();

  // Emulasi SQL injection login bypass dengan dukungan berbagai pola otentikasi klasik
  const lower = cleanUser.toLowerCase();
  const isSqliBypass = 
    /(?:'|\")\s*(?:or|\|\|)\s*(?:'1'='1|1=1|'a'='a|true)/i.test(cleanUser) ||
    /(?:admin|root)(?:'|\")?\s*(?:--|#|\/\*)/i.test(cleanUser) ||
    lower.includes("' or '1'='1") ||
    lower.includes("' or 1=1") ||
    lower.includes("admin' --") ||
    lower.includes("admin'#") ||
    lower.includes("admin'/*") ||
    lower.includes("' or ''='") ||
    lower.includes("' or 1=1 --") ||
    lower.includes("' or 'a'='a");

  if (isSqliBypass) {
    const content = `
      <div class="content-box">
        <h3 style="margin-bottom: 0.75rem; color: #34d399;">INJEKSI SQL BERHASIL: BYPASS OTENTIKASI TERKONFIRMASI</h3>
        <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
          Kueri basis data bernilai BENAR (TRUE)! Anda berhasil masuk sebagai administrator tanpa perlu mengetahui kata sandi aslinya.
        </p>
        <div class="flag-box">
          CTF{bypass_sqli_login_berhasil}
        </div>
      </div>
      <a href="/challenges/web/4" style="color: #38bdf8; text-decoration: none;">&larr; Kembali ke Gerbang Login</a>
    `;
    return res.send(challengePageTemplate("Bypass SQL Sukses", "Otentikasi Mainframe Ditembus", content));
  }

  // Gagal login
  const content = `
    <div class="content-box">
      <div class="error-box">
        <strong>AKSES DITOLAK:</strong> Kredensial tidak valid untuk nama pengguna: "${cleanUser.replace(/</g, '&lt;')}".
      </div>
      <p style="color: #cbd5e1; margin-top: 1rem;">
        Kueri database tidak mengembalikan data yang cocok. Susun payload agar klausa WHERE selalu bernilai benar!
      </p>
    </div>
    <a href="/challenges/web/4" style="color: #38bdf8; text-decoration: none;">&larr; Coba Lagi</a>
  `;
  res.status(401).send(challengePageTemplate("Gagal Masuk", "Akses Kredensial Ditolak", content));
});

module.exports = router;
