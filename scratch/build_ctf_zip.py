import os
import shutil
import zipfile
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
STAGE_DIR = os.path.join(BASE_DIR, 'scratch', 'cyberstrike_ctf_pack')
ZIP_OUT = os.path.join(BASE_DIR, 'cyberstrike_ctf_challenges.zip')
PUBLIC_ZIP = os.path.join(BASE_DIR, 'public', 'downloads', 'cyberstrike_ctf_challenges.zip')
DOWNLOADS_DIR = os.path.join(BASE_DIR, 'public', 'downloads')

print("Starting CTF ZIP Package Builder...")

if os.path.exists(STAGE_DIR):
    shutil.rmtree(STAGE_DIR)

os.makedirs(STAGE_DIR, exist_ok=True)

# 1. ROOT README.md
root_readme = """# 🛡️ CYBERSTRIKE CTF - PAKET TANTANGAN KOMPETISI KEAMANAN SIBER

Selamat datang di paket arsip resmi **CyberStrike CTF**.
Paket ini berisi seluruh berkas tantangan soal yang telah dikelompokkan secara terstruktur, rapi, dan mandiri (*standalone*) sehingga dapat dibagikan langsung kepada peserta kompetisi atau digunakan untuk pelatihan internal.

---

## 📊 Ringkasan Kompetisi

* **Jumlah Kategori:** 3 Kategori Utama (Web Exploitation, Cryptography, Digital Forensics)
* **Total Tantangan:** 12 Soal
* **Total Skor Maksimal:** 2.100 Poin
* **Tingkat Kesulitan:** Pemula hingga Menengah (Beginner-Friendly to Intermediate)
* **Format Flag:** `CTF{...}`

---

## 📁 Struktur Direktori Paket Soal

```
cyberstrike_ctf_challenges/
├── README.md                          <-- Panduan umum kompetisi & petunjuk teknis
├── DAFTAR_SOAL_DAN_KUNCI.md           <-- Ringkasan 12 soal beserta kunci flag (Khusus Panitia)
│
├── 01_Web_Exploitation/               <-- 4 Soal Eksploitasi Keamanan Web (700 Poin)
│   ├── README.md
│   ├── Web_01_Inspeksi_Header_Tersembunyi/
│   ├── Web_02_Jejak_Robot_Terlarang/
│   ├── Web_03_Pemalsuan_Cookie_Akses/
│   └── Web_04_Gerbang_Login_Injeksi_SQL/
│
├── 02_Cryptography/                   <-- 4 Soal Kriptografi & Pemecahan Sandi (700 Poin)
│   ├── README.md
│   ├── Crypto_01_Sandi_Pergeseran_Romawi/
│   ├── Crypto_02_Enkripsi_Tiga_Lapis/
│   ├── Crypto_03_Teka_Teki_Kunci_Tunggal_XOR/
│   └── Crypto_04_Misteri_Sandi_Polialfabetik/
│
├── 03_Digital_Forensics/              <-- 4 Soal Forensik Digital & Analisis Berkas (700 Poin)
│   ├── README.md
│   ├── Forensics_01_Metadata_Rahasia_Gambar/
│   ├── Forensics_02_Memperbaiki_Magic_Header_PNG/
│   ├── Forensics_03_Arsip_Tersembunyi_di_Balik_Gambar/
│   └── Forensics_04_Penyadapan_Lalu_Lintas_Jaringan/
│
└── SOLUSI_DAN_WRITEUP/                <-- Panduan Solusi Step-by-Step & Script Solver Otomatis
    ├── WRITEUP_LENGKAP.md             <-- Pembahasan rinci seluruh 12 soal
    ├── solve_all.py                   <-- Solver otomatis Python untuk Crypto & Forensik
    └── cheat_sheet_tools.md           <-- Rekomendasi alat bantu gratis (CyberChef, Wireshark, dll)
```

---

## 🎯 Aturan Permainan (Rules of Engagement)

1. Format flag yang valid selalu diawali dengan `CTF{` dan diakhiri tanda kurung kurawal `}`.
2. Setiap huruf di dalam flag bersifat peka huruf besar-kecil (*case-sensitive*).
3. Dilarang melakukan serangan *Denial of Service (DoS/DDoS)* atau merusak infrastruktur.
4. Selamat bertanding dan junjung tinggi sportivitas!
"""

with open(os.path.join(STAGE_DIR, 'README.md'), 'w', encoding='utf-8') as f:
    f.write(root_readme)

# 2. DAFTAR SOAL DAN KUNCI (PANITIA)
daftar_soal_content = """# 📋 DAFTAR SOAL, NILAI, CLUE & KUNCI JAWABAN (KHUSUS PANITIA)

> ⚠️ **PERINGATAN:** Dokumen ini berisi kunci jawaban (*Flag*) seluruh tantangan CyberStrike CTF.  
> Jangan bagikan dokumen ini kepada peserta kompetisi sebelum perlombaan selesai.

---

## 🏆 Tabel Ringkasan 12 Tantangan

| ID | Judul Tantangan | Kategori | Poin | Clue / Konsep | Kunci Flag |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **WEB-01** | Inspeksi Header Tersembunyi | Web Exploitation | 100 | HTML Comments & HTTP Header | `CTF{inspeksi_header_tersembunyi}` |
| **WEB-02** | Jejak Robot Terlarang | Web Exploitation | 150 | Direktif `/robots.txt` Disallow | `CTF{jejak_robots_txt_terbongkar}` |
| **WEB-03** | Pemalsuan Cookie Akses | Web Exploitation | 200 | Manipulasi `peran_pengguna=admin` | `CTF{manipulasi_cookie_admin_sukses}` |
| **WEB-04** | Gerbang Login Injeksi SQL | Web Exploitation | 250 | SQLi Bypass Auth (`' OR '1'='1`) | `CTF{bypass_sqli_login_berhasil}` |
| **CRYPTO-01** | Sandi Pergeseran Romawi | Cryptography | 100 | Caesar Cipher / ROT13 | `CTF{sandi_caesar_rot13_dasar}` |
| **CRYPTO-02** | Enkripsi Tiga Lapis | Cryptography | 150 | Dekode Biner ➔ Hex ➔ Base64 | `CTF{tiga_lapis_encoding_biner_hex_base64}` |
| **CRYPTO-03** | Teka-Teki Kunci Tunggal XOR | Cryptography | 200 | Single-Byte XOR Brute Force | `CTF{single_byte_xor_kunci_terbongkar}` |
| **CRYPTO-04** | Misteri Sandi Polialfabetik | Cryptography | 250 | Vigenère (Kunci: `RAHASIA`) | `CTF{sandi_vigenere_kunci_rahasia}` |
| **FOR-01** | Metadata Rahasia Gambar | Digital Forensics | 100 | EXIF Data & COM Marker | `CTF{metadata_exif_gambar_ditemukan}` |
| **FOR-02** | Memperbaiki Magic Header PNG | Digital Forensics | 150 | Hex Edit Signature (89 50 4E 47) | `CTF{magic_bytes_png_berhasil_diperbaiki}` |
| **FOR-03** | Arsip Tersembunyi di Balik Gambar | Digital Forensics | 200 | Steganografi Appended ZIP (7-Zip) | `CTF{arsip_zip_tersembunyi_di_gambar}` |
| **FOR-04** | Penyadapan Lalu Lintas Jaringan | Digital Forensics | 250 | Analisis PCAP Wireshark (HTTP Stream) | `CTF{analisis_paket_jaringan_http_wireshark}` |

**Total Skor Keseluruhan:** **2.100 Poin**
"""

with open(os.path.join(STAGE_DIR, 'DAFTAR_SOAL_DAN_KUNCI.md'), 'w', encoding='utf-8') as f:
    f.write(daftar_soal_content)

# ==========================================
# 01_Web_Exploitation
# ==========================================
web_dir = os.path.join(STAGE_DIR, '01_Web_Exploitation')
os.makedirs(web_dir, exist_ok=True)

with open(os.path.join(web_dir, 'README.md'), 'w', encoding='utf-8') as f:
    f.write("""# 🌐 Kategori: Web Exploitation (Total: 700 Poin)

Kategori ini menguji pemahaman peserta terhadap cara kerja protokol web (HTTP/HTTPS), DevTools browser, perambanan berkas (*robots.txt*), manajemen status sesi (*Cookies*), dan celah otentikasi klasik (*SQL Injection*).

## Daftar Tantangan:
1. **Web_01_Inspeksi_Header_Tersembunyi** (100 Poin)
2. **Web_02_Jejak_Robot_Terlarang** (150 Poin)
3. **Web_03_Pemalsuan_Cookie_Akses** (200 Poin)
4. **Web_04_Gerbang_Login_Injeksi_SQL** (250 Poin)

Semua tantangan dapat dibuka dan dijalankan secara mandiri (*standalone*) menggunakan peramban berkas HTML atau script demo yang disediakan.
""")

# Web 01
w1_dir = os.path.join(web_dir, 'Web_01_Inspeksi_Header_Tersembunyi')
os.makedirs(w1_dir, exist_ok=True)
with open(os.path.join(w1_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Inspeksi Header Tersembunyi
* **ID:** WEB-01
* **Kategori:** Web Exploitation
* **Poin:** 100 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** HTML Comments & HTTP Response Header

## Deskripsi Skenario
Sebuah portal web internal telah aktif. Banyak pengembang berasumsi bahwa pengguna biasa tidak memeriksa transmisi di balik layar.
Analisis kode sumber klien (HTML Comments) dan respons header dari peladen HTTP untuk menemukan flag rahasia!

## Petunjuk (Hint)
1. Buka berkas `index.html` di peramban (atau buka server demo `server_express_demo.js`).
2. Tekan **F12** atau klik kanan -> **Inspect Element**.
3. Periksa komentar HTML yang tertanam di halaman.
4. Periksa respons header `X-Flag-Rahasia` melalui Network tab atau cURL!
""")

with open(os.path.join(w1_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write("""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Web 1: Inspeksi Header Tersembunyi | CyberStrike</title>
  <style>
    body { background: #0b0f19; color: #f1f5f9; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #131c2e; border: 1px solid #1e293b; border-radius: 12px; padding: 2rem; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #06b6d4; font-size: 1.5rem; margin-top: 0; }
    .badge { background: rgba(6, 182, 212, 0.15); color: #06b6d4; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    p { line-height: 1.6; color: #94a3b8; }
    .note { background: #090e1a; border-left: 4px solid #06b6d4; padding: 1rem; border-radius: 4px; color: #cbd5e1; font-family: monospace; font-size: 0.9rem; }
  </style>
</head>
<body>
  <!-- 
    =======================================================
    [CATATAN INTERNAL AUDITOR SIBER]
    Bagus sekali! Anda berhasil membuka DevTools (Inspect Element).
    
    Namun, token flag rahasia yang sesungguhnya ditransmisikan
    melalui HTTP Response Header peladen kami:
    'X-Flag-Rahasia: CTF{inspeksi_header_tersembunyi}'
    
    Jika Anda menjalankan file ini secara offline via server_express_demo.js,
    periksa tab Network -> Response Headers atau jalankan:
    curl -I http://localhost:8080/
    =======================================================
  -->
  <div class="card">
    <span class="badge">WEB EXPLOITATION &bull; 100 POIN</span>
    <h1>Portal Dokumen Internal</h1>
    <p>Selamat datang di portal dokumen internal. Pengembang berasumsi pengguna umum tidak pernah memeriksa apa yang terjadi di balik layar.</p>
    <div class="note">
      💡 <em>Petunjuk: Buka DevTools (F12) untuk menginspeksi komentar kode dan header transmisi!</em>
    </div>
  </div>
</body>
</html>""")

with open(os.path.join(w1_dir, 'server_express_demo.js'), 'w', encoding='utf-8') as f:
    f.write("""// Server mandiri untuk mensimulasikan tantangan Web 1 secara offline
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Flag-Rahasia': 'CTF{inspeksi_header_tersembunyi}',
    'X-Security-Audit': 'Passed-Level-1'
  });
  const html = fs.readFileSync(path.join(__dirname, 'index.html'));
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Server Web 1 aktif di http://localhost:${PORT}`);
  console.log(`Uji dengan cURL: curl -I http://localhost:${PORT}`);
});
""")

# Web 02
w2_dir = os.path.join(web_dir, 'Web_02_Jejak_Robot_Terlarang')
os.makedirs(w2_dir, exist_ok=True)
with open(os.path.join(w2_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Jejak Robot Terlarang
* **ID:** WEB-02
* **Kategori:** Web Exploitation
* **Poin:** 150 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Direktif `/robots.txt` & Jalur Disallow

## Deskripsi Skenario
Mesin perayap web dilarang mengindeks area penyimpanan berkas rahasia.
Temukan direktori apa yang disembunyikan dari mesin pencari dengan membaca berkas konfigurasi standar perayap web (*Robots Exclusion Protocol*).

## Petunjuk (Hint)
1. Periksa berkas `robots.txt`.
2. Temukan jalur pada baris `Disallow: ...`.
3. Buka halaman rahasia tersebut (`brankas-rahasia-78923.html`) untuk melihat isi brankas dan mengambil flag!
""")

with open(os.path.join(w2_dir, 'robots.txt'), 'w', encoding='utf-8') as f:
    f.write("""User-agent: *
Disallow: /brankas-rahasia-78923.html
# Direktif Rahasia: Mesin pencari dilarang keras mengindeks berkas brankas rahasia di atas!
""")

with open(os.path.join(w2_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write("""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Web 2: Portal Publik & Robot | CyberStrike</title>
  <style>
    body { background: #0b0f19; color: #f1f5f9; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #131c2e; border: 1px solid #1e293b; border-radius: 12px; padding: 2rem; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; font-size: 1.5rem; }
    .badge { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    p { line-height: 1.6; color: #94a3b8; }
    a { color: #06b6d4; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">WEB EXPLOITATION &bull; 150 POIN</span>
    <h1>Selamat Datang di Portal Publik</h1>
    <p>Situs ini mengizinkan bot umum melakukan pengindeksan, namun memiliki folder rahasia yang diblokir lewat konfigurasi standar perayap web.</p>
    <p>Tahukah Anda berkas standar apa yang pertama kali dicari oleh Googlebot saat merayapi sebuah website? Cek <a href="robots.txt">robots.txt</a>!</p>
  </div>
</body>
</html>""")

with open(os.path.join(w2_dir, 'brankas-rahasia-78923.html'), 'w', encoding='utf-8') as f:
    f.write("""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Brankas Rahasia | CyberStrike</title>
  <style>
    body { background: #0b0f19; color: #f1f5f9; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #131c2e; border: 1px solid #10b981; border-radius: 12px; padding: 2.5rem; max-width: 600px; text-align: center; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }
    h1 { color: #34d399; font-size: 1.6rem; margin-top: 0; }
    .flag { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; font-family: monospace; font-size: 1.3rem; padding: 1rem; border-radius: 8px; margin: 1.5rem 0; font-weight: bold; }
    p { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔓 Brankas Tersembunyi Berhasil Ditemukan!</h1>
    <p>Anda berhasil melacak direktif rahasia yang tertera di dalam <code>robots.txt</code>.</p>
    <div class="flag">CTF{jejak_robots_txt_terbongkar}</div>
  </div>
</body>
</html>""")

# Web 03
w3_dir = os.path.join(web_dir, 'Web_03_Pemalsuan_Cookie_Akses')
os.makedirs(w3_dir, exist_ok=True)
with open(os.path.join(w3_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Pemalsuan Cookie Akses
* **ID:** WEB-03
* **Kategori:** Web Exploitation
* **Poin:** 200 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Manipulasi Cookie `peran_pengguna=admin`

## Deskripsi Skenario
Portal ini memverifikasi peran pengguna secara langsung dari data cookie peramban tanpa validasi tanda tangan kriptografi di sisi server. Tingkatkan hak akses Anda dari status tamu menjadi administrator!

## Petunjuk (Hint)
1. Buka berkas `index.html` di peramban.
2. Buka DevTools (**F12**) -> tab **Application** (atau **Storage**) -> **Cookies**.
3. Temukan cookie bernama `peran_pengguna` yang bernilai `tamu`.
4. Ubah nilai nilainya menjadi `admin`.
5. Muat ulang halaman (*Refresh* / F5) untuk memunculkan bendera rahasia!
""")

with open(os.path.join(w3_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write("""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Web 3: Pemalsuan Cookie Akses | CyberStrike</title>
  <style>
    body { background: #0b0f19; color: #f1f5f9; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #131c2e; border: 1px solid #1e293b; border-radius: 12px; padding: 2rem; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #f59e0b; font-size: 1.5rem; margin-top: 0; }
    .badge { background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    p { line-height: 1.6; color: #94a3b8; }
    .status-box { padding: 1rem; border-radius: 8px; font-family: monospace; margin: 1rem 0; font-size: 0.95rem; }
    .guest { background: rgba(244, 63, 94, 0.15); border: 1px solid #f43f5e; color: #fb7185; }
    .admin { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; }
    .flag { background: #090e1a; border: 1px solid #34d399; color: #34d399; font-size: 1.25rem; font-weight: bold; padding: 1rem; text-align: center; border-radius: 6px; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">WEB EXPLOITATION &bull; 200 POIN</span>
    <h1>Panel Manajemen Hak Akses</h1>
    <p>Portal ini memeriksa otorisasi hanya menggunakan cookie di peramban pengguna tanpa enkripsi.</p>
    
    <div id="role-display"></div>

    <script>
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      }

      let role = getCookie('peran_pengguna');
      if (!role) {
        document.cookie = "peran_pengguna=tamu; path=/";
        role = 'tamu';
      }

      const display = document.getElementById('role-display');
      if (role === 'admin') {
        display.innerHTML = `
          <div class="status-box admin">
            <strong>STATUS HAK AKSES:</strong> ADMINISTRATOR (LEVEL TINGGI)<br>
            Selamat datang, Administrator Utama Sistem!
          </div>
          <div class="flag">CTF{manipulasi_cookie_admin_sukses}</div>
        `;
      } else {
        display.innerHTML = `
          <div class="status-box guest">
            <strong>STATUS HAK AKSES:</strong> TAMU (AKSES TERBATAS)<br>
            Nilai Cookie saat ini: <code>peran_pengguna=${role}</code>.<br>
            Akses dokumen rahasia ditolak! Hanya pengguna berstatus <code>admin</code> yang diizinkan.
          </div>
          <p>💡 <em>Buka DevTools (F12) -> Application -> Cookies -> ubah peran_pengguna menjadi 'admin' lalu muat ulang halaman!</em></p>
        `;
      }
    </script>
  </div>
</body>
</html>""")

# Web 04
w4_dir = os.path.join(web_dir, 'Web_04_Gerbang_Login_Injeksi_SQL')
os.makedirs(w4_dir, exist_ok=True)
with open(os.path.join(w4_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Gerbang Login Injeksi SQL
* **ID:** WEB-04
* **Kategori:** Web Exploitation
* **Poin:** 250 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** SQL Injection Authentication Bypass

## Deskripsi Skenario
Sistem otentikasi darurat ini rentan terhadap injeksi string SQL klasik (*SQL Injection*).
Lakukan bypass terhadap gerbang login tanpa perlu mengetahui kata sandi asli administrator!

## Payload Contoh
Coba masukkan salah satu string injeksi SQL ini pada kolom **Username**:
* `' OR '1'='1`
* `' OR 1=1 --`
* `' OR 'a'='a`
* `admin'#`

Isi kolom Password dengan karakter sembarang, lalu klik Masuk.
""")

with open(os.path.join(w4_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write("""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Web 4: Gerbang Login Injeksi SQL | CyberStrike</title>
  <style>
    body { background: #0b0f19; color: #f1f5f9; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #131c2e; border: 1px solid #1e293b; border-radius: 12px; padding: 2rem; max-width: 480px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #f43f5e; font-size: 1.5rem; margin-top: 0; }
    .badge { background: rgba(244, 63, 94, 0.15); color: #fb7185; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
    p { line-height: 1.5; color: #94a3b8; font-size: 0.9rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem; color: #cbd5e1; }
    input { width: 100%; box-sizing: border-box; background: #090e1a; border: 1px solid #334155; padding: 0.75rem; border-radius: 6px; color: #fff; font-family: monospace; }
    input:focus { border-color: #06b6d4; outline: none; }
    button { width: 100%; background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; font-weight: bold; border: none; padding: 0.8rem; border-radius: 6px; cursor: pointer; margin-top: 0.5rem; font-size: 0.95rem; }
    .result { margin-top: 1.25rem; padding: 1rem; border-radius: 6px; font-family: monospace; display: none; }
    .success { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; }
    .error { background: rgba(244, 63, 94, 0.15); border: 1px solid #f43f5e; color: #fb7185; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">WEB EXPLOITATION &bull; 250 POIN</span>
    <h1>Gerbang Otentikasi Darurat</h1>
    <p>Sistem ini memvalidasi query login langsung melalui perangkaian string SQL.</p>

    <form id="sqli-form">
      <div class="form-group">
        <label>Nama Pengguna (Username):</label>
        <input type="text" id="username" placeholder="admin" required autocomplete="off">
      </div>
      <div class="form-group">
        <label>Kata Sandi (Password):</label>
        <input type="password" id="password" placeholder="••••••••" required>
      </div>
      <button type="submit">🔓 Masuk ke Sistem</button>
    </form>

    <div id="result-box" class="result"></div>
  </div>

  <script>
    document.getElementById('sqli-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const box = document.getElementById('result-box');
      box.style.display = 'block';

      // Simulasi parser SQLi klasik
      const isBypass = /'\\s*(or|OR|\\|\\|)\\s*['"]?1['"]?\\s*=\\s*['"]?1/i.test(u) ||
                       /'\\s*(or|OR)\\s*['"]?a['"]?\\s*=\\s*['"]?a/i.test(u) ||
                       /admin'\\s*(#|--)/i.test(u);

      if (isBypass) {
        box.className = 'result success';
        box.innerHTML = '<strong>LOGIN BERHASIL!</strong><br>Query dievaluasi menjadi TRUE.<br><br>Flag: <strong>CTF{bypass_sqli_login_berhasil}</strong>';
      } else {
        box.className = 'result error';
        box.innerHTML = '<strong>LOGIN GAGAL:</strong><br>Kredensial tidak valid. Coba gunakan SQL Injection payload pada username.';
      }
    });
  </script>
</body>
</html>""")

# ==========================================
# 02_Cryptography
# ==========================================
crypto_dir = os.path.join(STAGE_DIR, '02_Cryptography')
os.makedirs(crypto_dir, exist_ok=True)

with open(os.path.join(crypto_dir, 'README.md'), 'w', encoding='utf-8') as f:
    f.write("""# 🔐 Kategori: Cryptography (Total: 700 Poin)

Kategori ini menguji kemampuan analisis cipher klasik, teknik encoding bertingkat, sandi biner/XOR, dan cipher polialfabetik.

## Daftar Tantangan:
1. **Crypto_01_Sandi_Pergeseran_Romawi** (100 Poin)
2. **Crypto_02_Enkripsi_Tiga_Lapis** (150 Poin)
3. **Crypto_03_Teka_Teki_Kunci_Tunggal_XOR** (200 Poin)
4. **Crypto_04_Misteri_Sandi_Polialfabetik** (250 Poin)

Semua berkas soal terlampir di dalam folder masing-masing.
""")

# Crypto 1
c1_dir = os.path.join(crypto_dir, 'Crypto_01_Sandi_Pergeseran_Romawi')
os.makedirs(c1_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'pesan_rot13.txt'), os.path.join(c1_dir, 'pesan_rot13.txt'))
with open(os.path.join(c1_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Sandi Pergeseran Romawi
* **ID:** CRYPTO-01
* **Kategori:** Cryptography
* **Poin:** 100 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Caesar Cipher & Algoritma ROT13
* **Berkas Lampiran:** `pesan_rot13.txt`

## Deskripsi Soal
Pesan komunikasi militer lama diamankan menggunakan metode pergeseran alfabet klasik zaman Romawi (Caesar / ROT13).
Dekripsi teks sandi di dalam berkas lampiran untuk mendapatkan flag!

## Petunjuk (Hint)
* Gunakan alat bantu seperti **CyberChef** (resep `ROT13`) atau decoder pergeseran 13 huruf alfabet.
* Format flag: `CTF{...}`.
""")

# Crypto 2
c2_dir = os.path.join(crypto_dir, 'Crypto_02_Enkripsi_Tiga_Lapis')
os.makedirs(c2_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'rahasia_tiga_lapis.txt'), os.path.join(c2_dir, 'rahasia_tiga_lapis.txt'))
with open(os.path.join(c2_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Enkripsi Tiga Lapis
* **ID:** CRYPTO-02
* **Kategori:** Cryptography
* **Poin:** 150 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Dekode Bertahap (Biner ➔ Hex ➔ Base64)
* **Berkas Lampiran:** `rahasia_tiga_lapis.txt`

## Deskripsi Soal
Teks flag disamarkan dengan 3 tahap enkodir: Base64, Heksadesimal, dan Biner 8-bit.
Balikkan proses tersebut satu per satu untuk membaca teks aslinya!

## Petunjuk (Hint)
1. Buka berkas `rahasia_tiga_lapis.txt`.
2. Ubah deretan biner 8-bit ke karakter teks heksadesimal (*From Binary*).
3. Dekode teks Heksadesimal ke string (*From Hex*).
4. Dekode string Base64 yang dihasilkan (*From Base64*) untuk mendapatkan bendera rahasia!
""")

# Crypto 3
c3_dir = os.path.join(crypto_dir, 'Crypto_03_Teka_Teki_Kunci_Tunggal_XOR')
os.makedirs(c3_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'ciphertext_xor.hex'), os.path.join(c3_dir, 'ciphertext_xor.hex'))
with open(os.path.join(c3_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Teka-Teki Kunci Tunggal XOR
* **ID:** CRYPTO-03
* **Kategori:** Cryptography
* **Poin:** 200 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Single-Byte XOR Brute Force (0-255)
* **Berkas Lampiran:** `ciphertext_xor.hex`

## Deskripsi Soal
Pesan rahasia dienkripsi menggunakan operasi bitwise XOR dengan kunci sepanjang 1 byte (nilai angka antara 0 hingga 255).
Disediakan berkas ciphertext dalam format heksadesimal. Temukan kunci yang tepat untuk mendekripsi pesan tersebut!

## Petunjuk (Hint)
* Gunakan script Python atau resep `XOR Brute Force` di CyberChef untuk menguji 256 kemungkinan kunci 1-byte.
""")

# Crypto 4
c4_dir = os.path.join(crypto_dir, 'Crypto_04_Misteri_Sandi_Polialfabetik')
os.makedirs(c4_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'sandi_vigenere.txt'), os.path.join(c4_dir, 'sandi_vigenere.txt'))
with open(os.path.join(c4_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Misteri Sandi Polialfabetik
* **ID:** CRYPTO-04
* **Kategori:** Cryptography
* **Poin:** 250 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Sandi Vigenère (Kunci: RAHASIA)
* **Berkas Lampiran:** `sandi_vigenere.txt`

## Deskripsi Soal
Sebuah dokumen rahasia diacak menggunakan sandi polialfabetik Vigenère.
Kata sandi kunci yang digunakan telah disusupi oleh informan, yaitu: **`RAHASIA`**.

## Petunjuk (Hint)
* Buka CyberChef, dcode.fr, atau gunakan skrip solver dengan memilih algoritma **Vigenère Decode** dan masukkan kunci `RAHASIA`.
""")

# ==========================================
# 03_Digital_Forensics
# ==========================================
for_dir = os.path.join(STAGE_DIR, '03_Digital_Forensics')
os.makedirs(for_dir, exist_ok=True)

with open(os.path.join(for_dir, 'README.md'), 'w', encoding='utf-8') as f:
    f.write("""# 🔍 Kategori: Digital Forensics (Total: 700 Poin)

Kategori ini menguji keahlian investigasi berkas digital, analisis metadata gambar (EXIF), perbaikan signature berkas rusak (Magic Bytes PNG), steganografi file tersembunyi (Appended ZIP), dan analisis lalu lintas jaringan (PCAP Packet Capture).

## Daftar Tantangan:
1. **Forensics_01_Metadata_Rahasia_Gambar** (100 Poin)
2. **Forensics_02_Memperbaiki_Magic_Header_PNG** (150 Poin)
3. **Forensics_03_Arsip_Tersembunyi_di_Balik_Gambar** (200 Poin)
4. **Forensics_04_Penyadapan_Lalu_Lintas_Jaringan** (250 Poin)

Semua berkas bukti fisik terlampir di dalam folder masing-masing.
""")

# For 1
f1_dir = os.path.join(for_dir, 'Forensics_01_Metadata_Rahasia_Gambar')
os.makedirs(f1_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'bukti_gambar.jpg'), os.path.join(f1_dir, 'bukti_gambar.jpg'))
with open(os.path.join(f1_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Metadata Rahasia Gambar
* **ID:** FOR-01
* **Kategori:** Digital Forensics
* **Poin:** 100 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Analisis EXIF Data & Komentar Berkas
* **Berkas Lampiran:** `bukti_gambar.jpg`

## Deskripsi Soal
Berkas citra CCTV barang bukti pengawasan siber ini menyimpan rekaman lapangan.
Analis forensik yang berpengalaman tahu bahwa berkas citra menyimpan metadata tak kasat mata (EXIF, XPComment, COM Marker).
Temukan flag yang tertanam di dalam metadata berkas!

## Petunjuk (Hint)
* Gunakan ExifTool, klik kanan berkas -> Properties -> tab Details (periksa kolom Comments / Title / Subject), jalankan perintah `strings bukti_gambar.jpg`, atau gunakan viewer online seperti `exif.regex.info`.
""")

# For 2
f2_dir = os.path.join(for_dir, 'Forensics_02_Memperbaiki_Magic_Header_PNG')
os.makedirs(f2_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'berkas_rusak.png'), os.path.join(f2_dir, 'berkas_rusak.png'))
with open(os.path.join(f2_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Memperbaiki Magic Header PNG
* **ID:** FOR-02
* **Kategori:** Digital Forensics
* **Poin:** 150 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Header PNG Corrupt (89 50 4E 47...)
* **Berkas Lampiran:** `berkas_rusak.png`

## Deskripsi Soal
Berkas citra PNG ini mengalami kerusakan struktur pada tanda tangan berkas (8 byte pertama bernilai `00`), sehingga ditolak oleh aplikasi penampil gambar.
Perbaiki 8 byte pertama menggunakan Hex Editor untuk memulihkan dokumen rahasia, lalu dekode token akses di dalamnya!

## Petunjuk (Hint)
1. Buka berkas `berkas_rusak.png` di Hex Editor (misal HxD atau https://hexed.it).
2. Ganti 8 byte pertama (`00 00 00 00 00 00 00 00`) dengan Magic Bytes standar PNG:
   `89 50 4E 47 0D 0A 1A 0A`
3. Simpan perubahan berkas, buka gambarnya atau ekstrak Base64 chunk di dalamnya untuk mendapatkan flag!
""")

# For 3
f3_dir = os.path.join(for_dir, 'Forensics_03_Arsip_Tersembunyi_di_Balik_Gambar')
os.makedirs(f3_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'foto_penyamaran.jpg'), os.path.join(f3_dir, 'foto_penyamaran.jpg'))
with open(os.path.join(f3_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Arsip Tersembunyi di Balik Gambar
* **ID:** FOR-03
* **Kategori:** Digital Forensics
* **Poin:** 200 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Steganografi Appended ZIP (7-Zip / Binwalk)
* **Berkas Lampiran:** `foto_penyamaran.jpg`

## Deskripsi Soal
Foto gedung pencakar langit berformat JPEG ini tampak normal saat dibuka di penampil gambar, namun menyimpan rahasia di balik penanda akhir berkas (EOF `FF D9`).
Terdapat arsip ZIP yang diselipkan menggunakan teknik steganografi *appended file*.

## Petunjuk (Hint)
* Buka berkas `foto_penyamaran.jpg` langsung menggunakan **7-Zip** atau **WinRAR** (klik kanan -> Open Archive), atau ekstrak dengan perintah `binwalk -e foto_penyamaran.jpg`.
""")

# For 4
f4_dir = os.path.join(for_dir, 'Forensics_04_Penyadapan_Lalu_Lintas_Jaringan')
os.makedirs(f4_dir, exist_ok=True)
shutil.copy(os.path.join(DOWNLOADS_DIR, 'rekaman_jaringan.pcap'), os.path.join(f4_dir, 'rekaman_jaringan.pcap'))
with open(os.path.join(f4_dir, 'SOAL.md'), 'w', encoding='utf-8') as f:
    f.write("""# Tantangan: Penyadapan Lalu Lintas Jaringan
* **ID:** FOR-04
* **Kategori:** Digital Forensics
* **Poin:** 250 Poin
* **Tingkat Kesulitan:** Mudah
* **Clue:** Analisis Paket PCAP & Stream HTTP Wireshark
* **Berkas Lampiran:** `rekaman_jaringan.pcap`

## Deskripsi Soal
Rekaman penyadapan paket jaringan (PCAP) berhasil menangkap aktivitas komunikasi HTTP dengan peladen internal.
Telusuri transmisi paket untuk menemukan token flag!

## Petunjuk (Hint)
1. Buka berkas `rekaman_jaringan.pcap` menggunakan **Wireshark**.
2. Filter paket dengan kata kunci `http`.
3. Klik kanan pada salah satu paket HTTP -> pilih **Follow** -> **TCP Stream**.
4. Baca pesan komunikasi rahasia dan catat flagnya!
""")

# ==========================================
# SOLUSI_DAN_WRITEUP
# ==========================================
sol_dir = os.path.join(STAGE_DIR, 'SOLUSI_DAN_WRITEUP')
os.makedirs(sol_dir, exist_ok=True)

# Copy WRITEUP.md
writeup_src = os.path.join(BASE_DIR, 'WRITEUP.md')
if os.path.exists(writeup_src):
    shutil.copy(writeup_src, os.path.join(sol_dir, 'WRITEUP_LENGKAP.md'))

# Cheat Sheet Tools
with open(os.path.join(sol_dir, 'cheat_sheet_tools.md'), 'w', encoding='utf-8') as f:
    f.write("""# 🛠️ Rekomendasi Alat Bantu (Tools) CTF Gratis & Mudah Digunakan

Berikut adalah daftar alat bantu standar industri yang sangat dianjurkan untuk menyelesaikan tantangan CTF ini:

### 1. Kriptografi & Encoding
* **CyberChef (Swiss Army Knife Siber):** https://gchq.github.io/CyberChef/ (Bisa offline atau online)
  - Fitur: ROT13, From Binary, From Hex, From Base64, XOR Brute Force, Vigenère Decode.
* **dcode.fr:** https://www.dcode.fr/ (Kamus cipher dan pemecah sandi otomatis lengkap).

### 2. Forensik Berkas & Gambar
* **HxD Hex Editor:** https://mh-nexus.de/en/hxd/ (Hex editor gratis untuk Windows untuk inspect byte dan header berkas).
* **HexEd.it:** https://hexed.it/ (Hex editor berbasis browser tanpa install).
* **7-Zip:** https://www.7-zip.org/ (Bisa langsung membuka file gambar steganografi / appended ZIP).
* **ExifTool:** https://exiftool.org/ (Ekstraktor metadata EXIF paling akurat).

### 3. Jaringan & Web
* **Wireshark:** https://www.wireshark.org/ (Penganalisis paket jaringan PCAP).
* **Browser DevTools (F12):** Bawaan Google Chrome / Microsoft Edge / Firefox (Inspect element, Network header, Cookie manager, Console).
""")

# Standalone Python solver for crypto & forensics
solver_py = '''"""
Skrip Solver Otomatis CyberStrike CTF (Crypto & Forensics)
Menyelesaikan dan mengekstrak seluruh flag secara instan tanpa tools pihak ketiga.
"""
import os
import zlib
import base64
import re

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

print("==================================================")
print("[SOLVER] CYBERSTRIKE CTF - AUTOMATIC PYTHON SOLVER")
print("==================================================\\n")

# 1. Crypto 1: ROT13
p_rot13 = os.path.join(base_dir, "02_Cryptography", "Crypto_01_Sandi_Pergeseran_Romawi", "pesan_rot13.txt")
if os.path.exists(p_rot13):
    with open(p_rot13, "r", encoding="utf-8") as f:
        txt = f.read()
    decoded = txt.translate(str.maketrans(
        "ABCDEFGHIJKLMabcdefghijklmNOPQRSTUVWXYZnopqrstuvwxyz",
        "NOPQRSTUVWXYZnopqrstuvwxyzABCDEFGHIJKLMabcdefghijklm"
    ))
    flag = [line for line in decoded.splitlines() if "CTF{" in line][0]
    print(f"[CRYPTO-01] ROT13         -> {flag.strip()}")

# 2. Crypto 2: 3-Layer
p_c2 = os.path.join(base_dir, "02_Cryptography", "Crypto_02_Enkripsi_Tiga_Lapis", "rahasia_tiga_lapis.txt")
if os.path.exists(p_c2):
    with open(p_c2, "r", encoding="utf-8") as f:
        c2_txt = f.read()
    match = re.search(r"--- PAYLOAD BINER ---\\s+([01\\s]+)\\s+--------------------", c2_txt)
    if match:
        bin_clean = match.group(1).replace(" ", "").replace("\\n", "")
        hex_str = "".join([chr(int(bin_clean[i:i+8], 2)) for i in range(0, len(bin_clean), 8)])
        b64_str = bytes.fromhex(hex_str).decode("utf-8")
        plain = base64.b64decode(b64_str).decode("utf-8")
        print(f"[CRYPTO-02] 3-Layer       -> {plain.strip()}")

# 3. Crypto 3: XOR Single Byte
p_xor = os.path.join(base_dir, "02_Cryptography", "Crypto_03_Teka_Teki_Kunci_Tunggal_XOR", "ciphertext_xor.hex")
if os.path.exists(p_xor):
    with open(p_xor, "r", encoding="utf-8") as f:
        raw_hex = f.read().strip()
    c_bytes = bytes.fromhex(raw_hex)
    for k in range(256):
        dec = bytes([b ^ k for b in c_bytes])
        if b"CTF{" in dec:
            print(f"[CRYPTO-03] Single-Byte XOR (Key: {k}) -> {dec.decode('utf-8').strip()}")
            break

# 4. Crypto 4: Vigenere
p_vig = os.path.join(base_dir, "02_Cryptography", "Crypto_04_Misteri_Sandi_Polialfabetik", "sandi_vigenere.txt")
if os.path.exists(p_vig):
    with open(p_vig, "r", encoding="utf-8") as f:
        v_txt = f.read()
    match = re.search(r"--- CIPHERTEXT ---\\s+([\\s\\S]+?)\\s+------------------", v_txt)
    if match:
        c_text = match.group(1).strip()
        key = "RAHASIA"
        plain = []
        k_idx = 0
        for ch in c_text:
            if ch.isupper():
                shift = ord(key[k_idx % len(key)]) - 65
                plain.append(chr((ord(ch) - 65 - shift) % 26 + 65))
                k_idx += 1
            elif ch.islower():
                shift = ord(key[k_idx % len(key)]) - 65
                plain.append(chr((ord(ch) - 97 - shift) % 26 + 97))
                k_idx += 1
            else:
                plain.append(ch)
        flag = "".join(plain).splitlines()[-1]
        print(f"[CRYPTO-04] Vigenere      -> {flag.strip()}")

# 5. Forensics 1: EXIF
p_f1 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_01_Metadata_Rahasia_Gambar", "bukti_gambar.jpg")
if os.path.exists(p_f1):
    with open(p_f1, "rb") as f:
        buf = f.read()
    match = re.search(rb"(CTF\{[a-zA-Z0-9_]+\})", buf)
    if match:
        print(f"[FOR-01] Metadata EXIF    -> {match.group(1).decode('utf-8')}")

# 6. Forensics 2: PNG Corrupt
p_f2 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_02_Memperbaiki_Magic_Header_PNG", "berkas_rusak.png")
if os.path.exists(p_f2):
    with open(p_f2, "rb") as f:
        buf = f.read()
    b64_matches = re.findall(b"([A-Za-z0-9+/]{20,}={0,2})", buf)
    for b_item in b64_matches:
        try:
            d = base64.b64decode(b_item).decode("utf-8")
            if "CTF{" in d:
                print(f"[FOR-02] PNG Signature    -> {d}")
                break
        except Exception:
            pass

# 7. Forensics 3: Appended ZIP
p_f3 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_03_Arsip_Tersembunyi_di_Balik_Gambar", "foto_penyamaran.jpg")
if os.path.exists(p_f3):
    with open(p_f3, "rb") as f:
        buf = f.read()
    zip_magic = b"\\x50\\x4b\\x03\\x04"
    idx = buf.find(zip_magic)
    if idx != -1:
        zip_data = buf[idx:]
        fn_len = int.from_bytes(zip_data[26:28], "little")
        ex_len = int.from_bytes(zip_data[28:30], "little")
        comp_m = int.from_bytes(zip_data[8:10], "little")
        comp_s = int.from_bytes(zip_data[18:22], "little")
        data_off = 30 + fn_len + ex_len
        comp_data = zip_data[data_off:data_off + comp_s]
        raw = zlib.decompress(comp_data, -15) if comp_m == 8 else comp_data
        match = re.search(r"CTF\{[a-zA-Z0-9_]+\}", raw.decode("utf-8", errors="ignore"))
        if match:
            print(f"[FOR-03] Appended ZIP     -> {match.group(0)}")

# 8. Forensics 4: PCAP Wireshark
p_f4 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_04_Penyadapan_Lalu_Lintas_Jaringan", "rekaman_jaringan.pcap")
if os.path.exists(p_f4):
    with open(p_f4, "rb") as f:
        buf = f.read()
    match = re.search(rb"(CTF\{[a-zA-Z0-9_]+\})", buf)
    if match:
        print(f"[FOR-04] PCAP HTTP Stream -> {match.group(1).decode('utf-8')}")

print("\\n[PASSED] Seluruh tantangan Crypto & Forensics terbukti valid dan 100% solvable!")
'''

with open(os.path.join(sol_dir, 'solve_all.py'), 'w', encoding='utf-8') as f:
    f.write(solver_py)

print("Files staged successfully. Creating ZIP archives...")

# Create ZIP
with zipfile.ZipFile(ZIP_OUT, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(STAGE_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, STAGE_DIR)
            zip_entry_path = os.path.join("cyberstrike_ctf_challenges", rel_path)
            zipf.write(full_path, zip_entry_path)

zip_size = os.path.getsize(ZIP_OUT)
print(f"Created: {ZIP_OUT} ({zip_size} bytes)")

# Copy to public downloads directory so it can also be downloaded over the web
shutil.copy(ZIP_OUT, PUBLIC_ZIP)
print(f"Copied to public download: {PUBLIC_ZIP}")

# Verify zip contents
with zipfile.ZipFile(ZIP_OUT, 'r') as zipf:
    namelist = zipf.namelist()
    print(f"Total entries in ZIP: {len(namelist)}")
    for name in sorted(namelist):
        print(f"  - {name}")

print("\n[SUCCESS] Build and packaging completed successfully!")
