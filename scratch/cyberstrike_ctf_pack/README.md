# 🛡️ CYBERSTRIKE CTF - PAKET TANTANGAN KOMPETISI KEAMANAN SIBER

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
