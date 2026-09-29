const express = require('express');
const router = express.Router();

// Helper CSS styles for Forensics Challenges
const challengePageTemplate = (title, clue, content) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Lab Digital Forensik</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card: #131c2e;
      --border: #1e293b;
      --neon-green: #10b981;
      --neon-cyan: #06b6d4;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #052e16, var(--bg));
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
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.15);
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
      background: rgba(16, 185, 129, 0.15);
      color: var(--neon-green);
      border: 1px solid rgba(16, 185, 129, 0.3);
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #fff, var(--neon-green));
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
    .hex-display {
      background: #0b1120;
      padding: 1.25rem;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #34d399;
      word-break: break-all;
      margin: 1rem 0;
      border: 1px solid rgba(16, 185, 129, 0.2);
      max-height: 200px;
      overflow-y: auto;
      line-height: 1.8;
    }
    .tool-section {
      background: rgba(16, 185, 129, 0.08);
      border: 1px dashed rgba(16, 185, 129, 0.3);
      padding: 1.25rem;
      border-radius: 8px;
      margin: 1.25rem 0;
    }
    .tool-section h4 {
      color: #34d399;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }
    button {
      background: linear-gradient(135deg, #10b981, #059669);
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
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
      margin: 0.5rem 0;
    }
    .download-link:hover { background: rgba(16, 185, 129, 0.25); }
    .back-btn {
      display: inline-block;
      margin-top: 1.5rem;
      color: var(--neon-green);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .back-btn:hover { text-decoration: underline; }
    .evidence-img {
      max-width: 100%;
      border-radius: 8px;
      border: 2px solid rgba(16, 185, 129, 0.3);
      margin: 1rem 0;
    }
    .info-tag {
      display: inline-block;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
    .file-info {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;
      background: #0b1120;
      padding: 1rem;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      margin: 1rem 0;
    }
    .file-info dt { color: #64748b; }
    .file-info dd { color: #a5f3fc; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Laboratorium Digital Forensik</span>
    <h1>${title}</h1>
    <p class="clue-tag">Petunjuk Teknis: <strong style="color: #34d399;">${clue}</strong></p>
    ${content}
    <div>
      <a href="/" class="back-btn">&larr; Kembali ke Platform CTF</a>
    </div>
  </div>
</body>
</html>
`;

// ==========================================================
// Tantangan Forensics 1: Metadata Rahasia Gambar
// ==========================================================
router.get('/1', (req, res) => {
  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #34d399;">Analisis Barang Bukti Digital #001</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Foto barang bukti digital ini tampak polos jika hanya dilihat langsung di layar. 
        Namun berkas citra menyimpan metadata tak kasat mata — informasi tersembunyi yang tertanam 
        dalam struktur berkas JPEG seperti data EXIF, komentar COM marker, dan metadata lainnya.
      </p>
      <img src="/downloads/bukti_gambar.jpg" alt="Barang Bukti Digital" class="evidence-img">
      <dl class="file-info">
        <dt>Nama Berkas:</dt><dd>bukti_gambar.jpg</dd>
        <dt>Format:</dt><dd>JPEG (Joint Photographic Experts Group)</dd>
        <dt>Area Investigasi:</dt><dd>EXIF Metadata, COM Marker, File Properties</dd>
      </dl>
    </div>

    <div class="tool-section">
      <h4>🔬 Alat Analisis Metadata</h4>
      <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">
        Klik untuk mengekstrak metadata tersembunyi dari berkas gambar:
      </p>
      <button onclick="analyzeMetadata()">Jalankan Analisis Metadata</button>
      <div id="meta-result" class="result-box"></div>
    </div>

    <a href="/api/download/bukti_gambar.jpg" class="download-link">
      📥 Unduh Barang Bukti (bukti_gambar.jpg)
    </a>

    <script>
      async function analyzeMetadata() {
        const el = document.getElementById('meta-result');
        el.style.display = 'block';
        el.innerHTML = '<span style="color: #fbbf24;">⏳ Menganalisis struktur berkas JPEG & Metadata EXIF...</span>';

        try {
          const resp = await fetch('/downloads/bukti_gambar.jpg');
          const buffer = await resp.arrayBuffer();
          const bytes = new Uint8Array(buffer);

          let results = '<strong style="color: #34d399;">📋 Hasil Ekstraksi Metadata Berkas Citra:</strong><br><br>';

          // Check JPEG signature
          if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
            results += '<span class="info-tag">OK</span> Tanda tangan JPEG valid (FF D8)<br><br>';
          }

          // Search for EXIF tags & strings
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawText = decoder.decode(bytes);

          // Find EXIF data
          results += '<div style="background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.4); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">';
          results += '<strong style="color: #06b6d4;">📷 Struktur Metadata Berkas (Inspeksi Header):</strong><br><br>';
          results += '<strong>Kamera:</strong> Hikvision Digital CCTV (DS-2CD2143G2-IS)<br>';
          results += '<strong>Dimensi:</strong> 1280 x 720 piksel (RGB)<br>';
          results += '<strong>Waktu Pengambilan:</strong> 2026-09-29 02:44:12 UTC<br>';
          results += '<strong>Perangkat Lunak:</strong> CyberStrike Forensic Suite v4.2<br>';
          results += '<strong>Segmen Data Terdeteksi:</strong> APP1 (EXIF Tagged Header) & COM Marker (0xFF 0xFE)<br>';
          results += '<span style="color: #fbbf24; font-size: 0.85rem;">🔒 Catatan: Terdapat komentar dan tag tersembunyi yang disematkan di dalam berkas.</span>';
          results += '</div>';

          // Search for COM marker (FF FE) presence
          let comFound = false;
          for (let i = 0; i < bytes.length - 2; i++) {
            if (bytes[i] === 0xFF && bytes[i + 1] === 0xFE) {
              results += '<div style="background: rgba(16, 185, 129, 0.2); padding: 0.75rem; border-radius: 6px; border: 1px solid #10b981;">';
              results += '<span class="info-tag">TERDETEKSI</span> <strong style="color: #34d399;">Komentar Tersembunyi (COM Marker) pada Offset 0x' + i.toString(16).toUpperCase() + '</strong><br>';
              results += '<span style="font-size: 0.85rem; color: #cbd5e1;">Gunakan alat baris perintah seperti <code>exiftool bukti_gambar.jpg</code> atau <code>strings bukti_gambar.jpg</code> pada berkas yang diunduh untuk membaca isi komentar lengkapnya.</span>';
              results += '</div>';
              comFound = true;
              break;
            }
          }

          results += '<br><p style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.5rem;">' +
            'Tips: Di komputer Anda, klik kanan berkas <code>bukti_gambar.jpg</code> → <strong>Properties</strong> → tab <strong>Details</strong> untuk melihat metadata ini langsung di Windows Explorer.</p>';

          el.innerHTML = results;
        } catch (e) {
          el.innerHTML = '<span style="color: #f87171;">Error: ' + e.message + '</span>';
        }
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Gunakan ExifTool, klik kanan Properties → Details, atau jalankan <code>strings bukti_gambar.jpg</code> untuk menemukan flag.</em>
    </p>
  `;

  res.send(challengePageTemplate("Metadata Rahasia Gambar", "Analisis EXIF Data & Komentar Berkas", content));
});

// ==========================================================
// Tantangan Forensics 2: Memperbaiki Magic Header PNG
// ==========================================================
router.get('/2', (req, res) => {
  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #34d399;">Pemulihan Integritas Berkas PNG</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Berkas citra PNG ini mengalami kerusakan struktur dan ditolak oleh aplikasi penampil gambar.
        Tanda tangan Magic Bytes awal berkas (8 byte pertama) telah diubah menjadi nol (00 00 00 00 00 00 00 00).
      </p>
      <dl class="file-info">
        <dt>Berkas Rusak:</dt><dd>berkas_rusak.png</dd>
        <dt>Status Saat Ini:</dt><dd style="color: #f87171; font-weight: 700;">Ditolak Penampil Gambar (Header Corrupt 00)</dd>
        <dt>Magic Bytes PNG Asli:</dt><dd style="color: #34d399; font-weight: 700;">89 50 4E 47 0D 0A 1A 0A</dd>
      </dl>

      <div id="corrupted-preview" style="background: rgba(239, 68, 68, 0.08); border: 2px dashed rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 1.75rem 1rem; text-align: center; margin-top: 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🖼️❌</div>
        <h4 style="color: #f87171; font-size: 1rem; margin-bottom: 0.25rem;">Citra Tidak Dapat Dibuka (Magic Bytes Bernilai Nol)</h4>
        <p style="color: #94a3b8; font-size: 0.85rem; max-width: 520px; margin: 0 auto;">
          Semua aplikasi penampil gambar biasa menolak berkas ini karena 8 byte pertama tidak memiliki tanda tangan resmi PNG (<code>89 50 4E 47 0D 0A 1A 0A</code>).
        </p>
      </div>
    </div>

    <div class="tool-section">
      <h4>🔬 Hex Viewer & Repair Tool</h4>
      <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">
        Klik untuk melihat hex dump berkas dan memperbaiki header:
      </p>
      <button onclick="viewHexDump()">Tampilkan Hex Dump (32 byte pertama)</button>
      <div id="hex-result" class="result-box"></div>
      <button onclick="repairAndShow()" style="background: linear-gradient(135deg, #059669, #0d9488);">
        Perbaiki Header & Tampilkan Gambar
      </button>
      <div id="repair-result" class="result-box"></div>
      <div id="repaired-image-container" style="margin-top: 1rem; display: none;">
        <img id="repaired-image" class="evidence-img" alt="Gambar yang diperbaiki">
      </div>
    </div>

    <a href="/api/download/berkas_rusak.png" class="download-link">
      📥 Unduh Berkas Rusak (berkas_rusak.png)
    </a>

    <script>
      let fileBytes = null;

      async function loadFile() {
        if (fileBytes) return fileBytes;
        const resp = await fetch('/downloads/berkas_rusak.png');
        const buffer = await resp.arrayBuffer();
        fileBytes = new Uint8Array(buffer);
        return fileBytes;
      }

      async function viewHexDump() {
        const bytes = await loadFile();
        const el = document.getElementById('hex-result');
        el.style.display = 'block';

        let hex = '<strong style="color: #34d399;">Hex Dump (32 byte pertama):</strong><br><br>';
        hex += '<div style="font-family: JetBrains Mono, monospace; font-size: 0.8rem;">';
        const isValid = (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47);
        for (let i = 0; i < 32 && i < bytes.length; i++) {
          const h = bytes[i].toString(16).toUpperCase().padStart(2, '0');
          const isCorrupted = (i < 8 && bytes[i] === 0);
          const isFixedMagic = (i < 8 && bytes[i] !== 0);
          let color = '#a5f3fc';
          if (isCorrupted) color = '#f87171; font-weight: 700; text-decoration: underline';
          else if (isFixedMagic) color = '#34d399; font-weight: 700';
          hex += '<span style="color: ' + color + ';">' + h + '</span> ';
          if ((i + 1) % 16 === 0) hex += '<br>';
        }
        hex += '</div>';
        if (isValid) {
          hex += '<br><span style="color: #34d399; font-weight: bold;">✓ Magic Bytes PNG valid (89 50 4E 47 0D 0A 1A 0A). Berkas dapat dibuka.</span>';
        } else {
          hex += '<br><span style="color: #f87171; font-weight: bold;">⚠ 8 byte pertama (warna merah) = RUSAK (00 00 00 00 00 00 00 00).</span>';
          hex += '<br><span style="color: #34d399;">✓ Ganti 8 byte pertama dengan Magic Bytes standar PNG: <strong>89 50 4E 47 0D 0A 1A 0A</strong> menggunakan Hex Editor, atau klik tombol perbaikan di bawah.</span>';
        }
        el.innerHTML = hex;
      }

      async function repairAndShow() {
        const bytes = await loadFile();
        const repaired = new Uint8Array(bytes);

        // PNG magic bytes
        const pngMagic = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        for (let i = 0; i < 8; i++) {
          repaired[i] = pngMagic[i];
        }

        const blob = new Blob([repaired], { type: 'image/png' });
        const url = URL.createObjectURL(blob);

        const el = document.getElementById('repair-result');
        el.style.display = 'block';
        el.innerHTML = '<strong style="color: #34d399;">✅ Berkas PNG Terverifikasi & Ditampilkan:</strong><br>' +
          'Header Magic Bytes: 89 50 4E 47 0D 0A 1A 0A (Portable Network Graphics)';

        const corruptEl = document.getElementById('corrupted-preview');
        if (corruptEl) corruptEl.style.display = 'none';

        const imgContainer = document.getElementById('repaired-image-container');
        imgContainer.style.display = 'block';
        document.getElementById('repaired-image').src = url;
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Buka berkas di Hex Editor (HxD atau hexed.it). Ganti 8 byte pertama yang bernilai 00 dengan magic bytes standar PNG: 89 50 4E 47 0D 0A 1A 0A.</em>
    </p>
  `;

  res.send(challengePageTemplate("Memperbaiki Magic Header PNG", "Header PNG Corrupt (89 50 4E 47...)", content));
});

// ==========================================================
// Tantangan Forensics 3: Arsip Tersembunyi di Balik Gambar
// ==========================================================
router.get('/3', (req, res) => {
  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #34d399;">Analisis Steganografi: Deteksi Arsip Tersemat</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Foto JPEG penyamaran ini berukuran mencurigakan — lebih besar dari gambar biasa dengan dimensi serupa. 
        Teknik steganografi klasik memungkinkan penyematan arsip ZIP setelah penanda akhir gambar JPEG (FF D9).
      </p>
      <img src="/downloads/foto_penyamaran.jpg" alt="Foto Penyamaran" class="evidence-img">
      <dl class="file-info">
        <dt>Nama Berkas:</dt><dd>foto_penyamaran.jpg</dd>
        <dt>Teknik:</dt><dd>Appended ZIP setelah EOF JPEG (FF D9)</dd>
        <dt>Tools:</dt><dd>7-Zip, WinRAR, binwalk, atau foremost</dd>
      </dl>
    </div>

    <div class="tool-section">
      <h4>🔬 Analisis Struktur Berkas</h4>
      <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">
        Klik untuk menganalisis struktur internal berkas dan mendeteksi data tersembunyi:
      </p>
      <button onclick="analyzeStego()">Deteksi Arsip Tersembunyi</button>
      <div id="stego-result" class="result-box"></div>
      <button onclick="extractZip()" style="background: linear-gradient(135deg, #059669, #0d9488); margin-top: 0.5rem;">
        Ekstrak & Baca Isi Arsip ZIP
      </button>
      <div id="extract-result" class="result-box"></div>
    </div>

    <a href="/api/download/foto_penyamaran.jpg" class="download-link">
      📥 Unduh Foto Penyamaran (foto_penyamaran.jpg)
    </a>

    <script>
      let stegoBytes = null;
      let zipOffset = -1;

      async function loadStego() {
        if (stegoBytes) return stegoBytes;
        const resp = await fetch('/downloads/foto_penyamaran.jpg');
        const buffer = await resp.arrayBuffer();
        stegoBytes = new Uint8Array(buffer);
        return stegoBytes;
      }

      async function analyzeStego() {
        const bytes = await loadStego();
        const el = document.getElementById('stego-result');
        el.style.display = 'block';

        let html = '<strong style="color: #34d399;">📋 Hasil Analisis Struktur:</strong><br><br>';
        html += '<span class="info-tag">INFO</span> Ukuran total berkas: ' + bytes.length + ' bytes<br><br>';

        // Check JPEG header
        if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
          html += '<span class="info-tag">OK</span> Header JPEG valid (FF D8)<br>';
        }

        // Find JPEG EOF (FF D9)
        let jpegEnd = -1;
        for (let i = bytes.length - 2; i >= 0; i--) {
          if (bytes[i] === 0xFF && bytes[i+1] === 0xD9) {
            // search from beginning for the first FF D9 that is followed by zip signature
            break;
          }
        }
        // Search for ZIP signature (PK = 50 4B 03 04)
        for (let i = 2; i < bytes.length - 4; i++) {
          if (bytes[i] === 0x50 && bytes[i+1] === 0x4B && bytes[i+2] === 0x03 && bytes[i+3] === 0x04) {
            zipOffset = i;
            html += '<span class="info-tag" style="background: rgba(244, 63, 94, 0.2); color: #f87171;">ANOMALI</span> ';
            html += 'Tanda tangan arsip ZIP (PK\\x03\\x04) terdeteksi pada offset <strong style="color: #fbbf24;">0x' + i.toString(16).toUpperCase() + '</strong> (' + i + ' bytes)<br><br>';
            
            const jpegSize = i;
            const zipSize = bytes.length - i;
            html += '<div style="background: rgba(16, 185, 129, 0.15); padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.3);">';
            html += 'Data JPEG: ' + jpegSize + ' bytes<br>';
            html += 'Data ZIP tersembunyi: <strong style="color: #f87171;">' + zipSize + ' bytes</strong><br>';
            html += 'Kesimpulan: Arsip ZIP diselipkan setelah penanda EOF gambar JPEG!';
            html += '</div>';
            break;
          }
        }

        if (zipOffset === -1) {
          html += '<span style="color: #f87171;">Tidak ditemukan tanda tangan arsip tersembunyi.</span>';
        }

        el.innerHTML = html;
      }

      async function extractZip() {
        if (zipOffset === -1) {
          await analyzeStego();
          if (zipOffset === -1) {
            alert('Jalankan analisis terlebih dahulu!');
            return;
          }
        }

        const el = document.getElementById('extract-result');
        el.style.display = 'block';

        let html = '<strong style="color: #34d399;">📦 Arsip Tersembunyi Berhasil Dikonfirmasi:</strong><br><br>';
        html += '<div style="background: rgba(16, 185, 129, 0.15); padding: 1rem; border-radius: 6px; border: 1px solid #10b981; margin-bottom: 0.75rem;">';
        html += '<strong style="color: #38bdf8;">Daftar Berkas Terdeteksi di Dalam Arsip ZIP:</strong><br>';
        html += '• 📄 <code>flag_rahasia.txt</code> (Dokumen teks berisi token flag rahasia)<br>';
        html += '• 📄 <code>catatan_stego.txt</code> (Dokumen penjelasan teknik steganografi)<br><br>';
        html += '<span style="color: #fbbf24;">⚡ Tugas Peserta:</span> Ekstrak berkas <code>foto_penyamaran.jpg</code> yang Anda unduh menggunakan <strong>7-Zip / WinRAR</strong> (klik kanan → <em>Open Archive</em>) atau perintah terminal <code>binwalk -e foto_penyamaran.jpg</code> untuk membuka dan membaca isi flag aslinya!';
        html += '</div>';

        el.innerHTML = html;
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Buka berkas foto_penyamaran.jpg langsung menggunakan 7-Zip atau WinRAR, atau ekstrak dengan <code>binwalk -e foto_penyamaran.jpg</code>.</em>
    </p>
  `;

  res.send(challengePageTemplate("Arsip Tersembunyi di Balik Gambar", "Steganografi Appended ZIP (7-Zip / Binwalk)", content));
});

// ==========================================================
// Tantangan Forensics 4: Penyadapan Lalu Lintas Jaringan
// ==========================================================
router.get('/4', (req, res) => {
  const content = `
    <div class="content-box">
      <h3 style="margin-bottom: 0.75rem; color: #34d399;">Analisis Penyadapan Paket Jaringan</h3>
      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
        Rekaman penyadapan paket jaringan (PCAP) berhasil menangkap aktivitas komunikasi HTTP 
        dengan peladen internal. Berkas capture ini berisi rekaman TCP handshake, 
        permintaan HTTP POST, dan respons server yang mengandung data sensitif.
      </p>
      <dl class="file-info">
        <dt>Berkas PCAP:</dt><dd>rekaman_jaringan.pcap</dd>
        <dt>Protokol:</dt><dd>TCP/HTTP (Port 80)</dd>
        <dt>Tools:</dt><dd>Wireshark, tcpdump, tshark</dd>
        <dt>Metode:</dt><dd>Follow TCP Stream / Filter HTTP</dd>
      </dl>
    </div>

    <div class="tool-section">
      <h4>🔬 Parser PCAP Interaktif</h4>
      <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">
        Klik untuk membaca dan menganalisis isi paket jaringan dari berkas PCAP:
      </p>
      <button onclick="analyzePCAP()">Analisis Paket Jaringan</button>
      <div id="pcap-result" class="result-box"></div>
    </div>

    <a href="/api/download/rekaman_jaringan.pcap" class="download-link">
      📥 Unduh Rekaman Jaringan (rekaman_jaringan.pcap)
    </a>

    <script>
      async function analyzePCAP() {
        const el = document.getElementById('pcap-result');
        el.style.display = 'block';
        el.innerHTML = '<span style="color: #fbbf24;">⏳ Membaca berkas PCAP...</span>';

        try {
          const resp = await fetch('/downloads/rekaman_jaringan.pcap');
          const buffer = await resp.arrayBuffer();
          const bytes = new Uint8Array(buffer);

          let html = '<strong style="color: #34d399;">📋 Hasil Analisis PCAP:</strong><br><br>';

          // Check PCAP magic number
          const magic = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
          if (magic === 0xd4c3b2a1 || magic === 0xa1b2c3d4) {
            html += '<span class="info-tag">OK</span> Format PCAP valid (magic: 0x' + magic.toString(16) + ')<br>';
          }

          html += '<span class="info-tag">INFO</span> Ukuran berkas: ' + bytes.length + ' bytes<br><br>';

          // Search for HTTP content in raw bytes
          const textDecoder = new TextDecoder('utf-8', { fatal: false });
          const rawText = textDecoder.decode(bytes);

          // Find HTTP request
          const httpReqIdx = rawText.indexOf('POST /api/');
          if (httpReqIdx !== -1) {
            const reqEnd = rawText.indexOf('\\r\\n\\r\\n', httpReqIdx);
            html += '<div style="background: rgba(56, 189, 248, 0.1); padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem; border: 1px solid rgba(56, 189, 248, 0.3);">';
            html += '<strong style="color: #38bdf8;">📤 Paket HTTP Request Terdeteksi:</strong><br>';
            html += '<pre style="font-size: 0.8rem; margin-top: 0.5rem; white-space: pre-wrap; color: #a5f3fc;">';
            
            // Extract the POST request
            const postMatch = rawText.match(/POST \\/[^\\x00]+?\\}[^\\x00]*?\\n/);
            if (postMatch) {
              html += postMatch[0].replace(/</g, '&lt;').substring(0, 300);
            } else {
              html += 'POST /api/v1/auth/login HTTP/1.1 ...';
            }
            html += '</pre></div>';
          }

          html += '<div style="background: rgba(16, 185, 129, 0.15); padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.3);">';
          html += '<strong style="color: #34d399;">📥 Aliran Transmisi HTTP Terdeteksi (TCP Stream):</strong><br>';
          html += '<p style="color: #cbd5e1; font-size: 0.85rem; margin-top: 0.5rem;">';
          html += 'Terdeteksi 10 paket transmisi standar: Handshake TCP 3-arah, permintaan otentikasi HTTP POST ke <code>/api/v1/auth/login</code>, respons HTTP 200 OK berformat JSON dari peladen, dan penutupan koneksi TCP FIN-ACK.';
          html += '</p>';
          html += '<p style="color: #fbbf24; font-size: 0.85rem; margin-top: 0.5rem;">';
          html += '⚡ <strong>Tugas Analis:</strong> Buka berkas <code>rekaman_jaringan.pcap</code> yang Anda unduh di <strong>Wireshark</strong>, terapkan filter <code>http</code>, lalu klik kanan paket ➔ <strong>Follow ➔ TCP Stream</strong> untuk membaca payload JSON dari peladen dan mendapatkan token akses rahasia.';
          html += '</p></div>';

          html += '<p style="color: #94a3b8; font-size: 0.85rem; margin-top: 1rem;">';
          html += 'Untuk analisis lebih mendalam, buka berkas PCAP di Wireshark dan gunakan filter <code>http</code>, ';
          html += 'lalu klik kanan → Follow → TCP Stream.</p>';

          el.innerHTML = html;
        } catch (e) {
          el.innerHTML = '<span style="color: #f87171;">Error: ' + e.message + '</span>';
        }
      }
    </script>

    <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 1.5rem;">
      💡 <em>Petunjuk: Buka berkas rekaman_jaringan.pcap menggunakan Wireshark. Filter paket dengan <code>http</code> lalu klik kanan dan pilih "Follow → TCP Stream".</em>
    </p>
  `;

  res.send(challengePageTemplate("Penyadapan Lalu Lintas Jaringan", "Analisis Paket PCAP & Stream HTTP Wireshark", content));
});

module.exports = router;
