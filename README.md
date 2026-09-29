# 🛡️ CYBERSTRIKE CTF PLATFORM

Platform kompetisi Capture The Flag (CTF) profesional berbahasa Indonesia dengan arsitektur modern (Node.js + Express + Cyber Dark UI), dilengkapi sistem pelacak penyelesaian (**Solve Tracker**) dan mesin analitik perolehan skor tertinggi (**Highest Point Analytics**).

---

## 🚀 Cara Menjalankan Platform

1. Buka terminal di direktori proyek:
   ```bash
   cd d:\ctf
   ```

2. Jalankan server:
   ```bash
   npm start
   ```

3. Buka browser dan akses:
   **[http://localhost:3000](http://localhost:3000)**

---

## 🎯 Kategori & Daftar 12 Soal (Tingkat Pemula / Easy)

### A. Web Exploitation
| ID | Judul Soal | Poin | Petunjuk Teknis (Clue) | Flag |
|---|---|---|---|---|
| `web-1` | **Inspeksi Header Tersembunyi** | 100 | HTML Comments & HTTP Response Header (`X-Flag-Rahasia`) | `CTF{inspeksi_header_tersembunyi}` |
| `web-2` | **Jejak Robot Terlarang** | 150 | Eksplorasi direktif `/robots.txt` & Jalur Disallow | `CTF{jejak_robots_txt_terbongkar}` |
| `web-3` | **Pemalsuan Cookie Akses** | 200 | Manipulasi Nilai Cookie `peran_pengguna=admin` | `CTF{manipulasi_cookie_admin_sukses}` |
| `web-4` | **Gerbang Login Injeksi SQL** | 250 | SQL Injection Login Authentication Bypass (`' OR '1'='1`) | `CTF{bypass_sqli_login_berhasil}` |

---

### B. Cryptography
| ID | Judul Soal | Poin | Petunjuk Teknis (Clue) | Flag |
|---|---|---|---|---|
| `crypto-1` | **Sandi Pergeseran Romawi** | 100 | Caesar Cipher & Algoritma ROT13 | `CTF{sandi_caesar_rot13_dasar}` |
| `crypto-2` | **Enkripsi Tiga Lapis** | 150 | Multi-Stage Decoding (Biner ➔ Hex ➔ Base64) | `CTF{tiga_lapis_encoding_biner_hex_base64}` |
| `crypto-3` | **Teka-Teki Kunci Tunggal XOR** | 200 | Single-Byte XOR Cipher Brute Force (0-255) | `CTF{single_byte_xor_kunci_terbongkar}` |
| `crypto-4` | **Misteri Sandi Polialfabetik** | 250 | Sandi Vigenère Polialfabetik (Kunci: `RAHASIA`) | `CTF{sandi_vigenere_kunci_rahasia}` |

---

### C. Digital Forensics
| ID | Judul Soal | Poin | Petunjuk Teknis (Clue) | Flag |
|---|---|---|---|---|
| `forensics-1` | **Metadata Rahasia Gambar** | 100 | Analisis EXIF Data & Komentar Berkas Citra | `CTF{metadata_exif_gambar_ditemukan}` |
| `forensics-2` | **Memperbaiki Magic Header PNG** | 150 | Pemulihan Signature Magic Bytes PNG (`89 50 4E 47...`) | `CTF{magic_bytes_png_berhasil_diperbaiki}` |
| `forensics-3` | **Arsip Tersembunyi di Balik Gambar** | 200 | Steganografi Ekstraksi Arsip ZIP Tersemat | `CTF{arsip_zip_tersembunyi_di_gambar}` |
| `forensics-4` | **Penyadapan Lalu Lintas Jaringan** | 250 | Analisis Wireshark Packet Capture & HTTP TCP Stream | `CTF{analisis_paket_jaringan_http_wireshark}` |

---

## 💡 Panduan Solusi Lengkap (Writeup)

1. **Web 1**: Klik tautan tantangan web ➔ Tekan `F12` ➔ Buka tab *Network* ➔ Refresh halaman ➔ Klik request dokumen ➔ Periksa tab *Headers* ➔ temukan `X-Flag-Rahasia`.
2. **Web 2**: Kunjungi `/challenges/web/2/robots.txt` ➔ temukan jalur `Disallow: /challenges/web/2/brankas-rahasia-78923` ➔ buka URL tersebut untuk mengambil flag.
3. **Web 3**: Tekan `F12` ➔ Buka tab *Application* ➔ *Cookies* ➔ ubah nilai cookie `peran_pengguna` dari `tamu` menjadi `admin` ➔ refresh halaman (atau gunakan tombol shortcut simulator).
4. **Web 4**: Masukkan `' OR '1'='1` di kolom *Nama Pengguna* dan ketik bebas pada *Kata Sandi* ➔ klik *Masuk ke Mainframe*.
5. **Crypto 1**: Buka berkas `pesan_rot13.txt` ➔ Buka CyberChef ➔ gunakan resep `ROT13`.
6. **Crypto 2**: Buka berkas `rahasia_tiga_lapis.txt` ➔ Konversi biner 8-bit menjadi teks heksadesimal ➔ decode Hex ke teks ➔ decode Base64 untuk membaca flag.
7. **Crypto 3**: Buat script Python singkat:
   ```python
   data = bytes.fromhex(open("ciphertext_xor.hex").read().strip())
   for k in range(256):
       res = bytes([b ^ k for b in data])
       if b"CTF{" in res:
           print(res.decode())
   ```
8. **Crypto 4**: Buka berkas `sandi_vigenere.txt` ➔ Buka CyberChef ➔ pilih resep `Vigenère Decode` ➔ masukkan Passphrase `RAHASIA`.
9. **Forensics 1**: Buka properti berkas `bukti_gambar.jpg` atau jalankan `strings bukti_gambar.jpg | findstr CTF` ➔ temukan komentar flag.
10. **Forensics 2**: Buka `berkas_rusak.png` di Hex Editor (HxD atau https://hexed.it) ➔ ubah 8 byte pertama menjadi `89 50 4E 47 0D 0A 1A 0A` ➔ simpan dan buka gambarnya.
11. **Forensics 3**: Buka `foto_penyamaran.jpg` langsung dengan 7-Zip atau WinRAR ➔ ekstrak berkas `flag_rahasia.txt`.
12. **Forensics 4**: Buka `rekaman_jaringan.pcap` di Wireshark ➔ filter paket `http` ➔ klik kanan paket HTTP ➔ pilih *Follow > TCP Stream* ➔ temukan respons JSON berisi flag.
