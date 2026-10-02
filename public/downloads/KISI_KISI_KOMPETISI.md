# 🎯 KISI-KISI & PANDUAN MATERI KOMPETISI CYBERSTRIKE CTF

> **Catatan untuk Peserta**: Dokumen ini merupakan silabus acuan resmi mengenai konsep dasar, topik keilmuan, dan perangkat bantu yang diujikan dalam kompetisi **CyberStrike CTF**. Dokumen ini dirancang untuk memandu arah belajar dan eksplorasi logika Anda secara mandiri tanpa memberikan langkah teknis instan ataupun jawaban langsung (*zero-spoiler*).

---

## 📌 Ringkasan Distribusi Tantangan

Kompetisi mencakup **12 Tantangan** yang terbagi rata ke dalam 3 domain utama keamanan siber:

| Kategori | Jumlah Soal | Rentang Poin | Fokus Utama Investigasi |
| :--- | :---: | :---: | :--- |
| **Web Exploitation** | 4 Soal | 100 – 250 Poin | Analisis protokol HTTP, Crawler Web, Manajemen Sesi Klien, Logika Otentikasi Form |
| **Cryptography** | 4 Soal | 100 – 250 Poin | Sandi Pergeseran Klasik, Rantai Encoding Multi-Format, Aljabar Bitwise XOR, Polialfabetik |
| **Digital Forensics** | 4 Soal | 100 – 250 Poin | Metadata Citra Digital, Integritas Struktur Biner Berkas, Steganografi Carving, Analisis Paket Jaringan |

Format Flag Resmi: `CTF{...}`

---

## 🌐 1. Kategori: Web Exploitation (Eksploitasi Web)

Kategori ini menguji pemahaman peserta terhadap bagaimana aplikasi web bekerja di balik layar, interaksi antara peramban (klien) dan peladen (*server*), serta kerapuhan logika implementasi fitur web.

```
       [ Browser Klien ]  <====== (Request / Response) ======>  [ Server Aplikasi ]
      /        |        \                                              |
 [Elements] [Network] [Storage/Cookies]                           [Database Engine]
```

### Topik 1.1: Inspeksi Transmisi Protokol HTTP & Dokumen Klien
* **Fondasi Teori**:
  * Siklus hidup *HTTP Request* dan *HTTP Response*.
  * Struktur pesan HTTP: Status Line, Request/Response Headers, dan Message Body.
  * Kebiasaan pengembang web yang kerap meninggalkan catatan teknis (*developer comments*) pada dokumen kode sumber klien (HTML/JavaScript).
* **Kemampuan yang Diuji**:
  * Menavigasi pohon DOM dan membaca kode sumber dokumen web klien.
  * Memeriksa metadata transmisi HTTP yang tidak dirender langsung secara visual pada antarmuka web, khususnya *Custom HTTP Response Headers*.
* **Kata Kunci Penyelidikan**: *HTTP Headers, Custom Headers (X-...), HTML Comments (`<!-- -->`), Inspector, Network Tab*.

---

### Topik 1.2: Navigasi Web Crawler & Direktif Robot
* **Fondasi Teori**:
  * Mekanisme kerja mesin perayap web (*web crawler / spiders*) dalam mengindeks konten internet.
  * Standar protokol eksklusi mesin pencari (`robots.txt`) dan aturan direktif `User-agent`, `Allow`, serta `Disallow`.
  * Kesalahan umum menganggap direktif `Disallow` sebagai mekanisme keamanan, padahal berkas tersebut bersifat terbuka untuk publik.
* **Kemampuan yang Diuji**:
  * Menemukan dan membaca berkas konfigurasi penjelajahan standar web crawler.
  * Menginterpretasikan jalur direktori rahasia atau sensitif yang sengaja diinstruksikan untuk tidak diindeks oleh mesin pencari.
* **Kata Kunci Penyelidikan**: *Robots Exclusion Protocol, Search Engine Indexing, robots.txt, Disallow Directive, Hidden Endpoints*.

---

### Topik 1.3: Manajemen State, Sesi, & Otorisasi Berbasis Klien
* **Fondasi Teori**:
  * Sifat protokol HTTP yang tanpa status (*stateless*) dan bagaimana peramban menggunakan *Cookies* untuk mengingat identitas pengguna.
  * Bahaya arsitektur keamanan yang mempercayai parameter otorisasi / peran (*role-based access control*) yang disimpan langsung di sisi klien tanpa tanda tangan kriptografis (*signature*) atau validasi *server-side session*.
* **Kemampuan yang Diuji**:
  * Mengidentifikasi parameter peran/hak akses pengguna yang tersimpan di dalam memori penyimpanan peramban (*browser storage / cookies*).
  * Melakukan manipulasi nilai parameter sesi untuk menguji respon aplikasi terhadap elevasi hak akses (*privilege escalation*).
* **Kata Kunci Penyelidikan**: *State Management, HTTP Cookie, Key-Value Pair, Client-Side Trust, Role Escalation, Browser Storage*.

---

### Topik 1.4: Integritas Logika Otentikasi & Manipulasi Query Database
* **Fondasi Teori**:
  * Bagaimana server memproses data masukan formulir (*login input*) untuk dikompilasi menjadi kueri database (SQL).
  * Karakteristik evaluasi logika boolean (`AND`, `OR`, `TRUE`, `FALSE`) pada database relasional.
  * Celah penggabungan string langsung (*dynamic string concatenation*) tanpa sanitasi atau *parameterized query* (*prepared statements*).
* **Kemampuan yang Diuji**:
  * Menganalisis bagaimana karakter khusus (seperti tanda petik tunggal `'`) dapat memutus struktur sintaks kueri database asli.
  * Menyusun masukan yang memaksa kondisi evaluasi logika selalu bernilai benar (*tautology*) guna melewati validasi akun.
* **Kata Kunci Penyelidikan**: *SQL Logic Evaluation, Boolean Tautology, Authentication Bypass, Input Sanitization, Dynamic Query Construction*.

---

## 🔐 2. Kategori: Cryptography (Kriptografi)

Kategori ini menguji ketajaman logika matematis, pemahaman representasi data digital, serta teknik pengacakan dan pemulihan pesan rahasia.

```
 [ Pesan Asli (Plaintext) ] ──> [ Algoritma Transformasi / Sandi ] ──> [ Ciphertext / Encoded ]
              ▲                                                               │
              └─────────────── [ Analisis Logika & Balik Proses ] ────────────┘
```

### Topik 2.1: Sandi Pergeseran Alfabet Klasik (Caesar / ROT)
* **Fondasi Teori**:
  * Kriptografi klasik berbasis sandi substitusi monoalfabetik.
  * Aritmatika modulo 26: $C = (P + K) \pmod{26}$, di mana setiap huruf bergeser sejauh nilai kunci tetap ($K$).
  * Sifat simetris pergeseran setengah putaran alfabet (13 langkah) di mana proses enkripsi dan dekripsinya identik.
* **Kemampuan yang Diuji**:
  * Mengenali karakteristik ciphertext yang tetap mempertahankan spasi, tanda baca, serta struktur kalimat normal.
  * Mengembalikan pergeseran huruf alfabet dengan interval tetap untuk memulihkan pesan asli.
* **Kata Kunci Penyelidikan**: *Caesar Shift, Modulo 26, Monoalphabetic Substitution, ROT-n, Symmetry*.

---

### Topik 2.2: Rantai Transformasi Encoding Multi-Format (*Layered Encoding*)
* **Fondasi Teori**:
  * Perbedaan krusial antara **Encoding** (pengubahan bentuk representasi data tanpa kunci rahasia) dan **Enkripsi** (pengamanan data dengan kunci rahasia).
  * Sistem bilangan dan representasi karakter:
    * **Biner (Base-2)**: Deretan 8-bit per karakter ASCII.
    * **Heksadesimal (Base-16)**: Pasangan digit 0–9 dan A–F per byte.
    * **Base64 (Base-64)**: Pengelompokan 6-bit yang dipetakan ke 64 karakter ASCII standar (diakhiri padding `=` jika perlu).
  * Konsep rantai transformasi bertingkat (*pipelined encoding*).
* **Kemampuan yang Diuji**:
  * Mengidentifikasi format representasi data berdasarkan pola karakter (misal: hanya angka 0 & 1, kumpulan pasangan hex, atau karakter alfanumerik base64).
  * Menyusun urutan dekode bertahap secara terbalik (*reverse pipeline*) hingga data kembali ke wujud teks manusia.
* **Kata Kunci Penyelidikan**: *Base-2 (Binary), Base-16 (Hexadecimal), Base64 Encoding, Character Encoding (ASCII), Sequential Decoding*.

---

### Topik 2.3: Operasi Aljabar Bitwise XOR & Ruang Kunci 8-Bit
* **Fondasi Teori**:
  * Operasi logika gerbang *Exclusive OR* (XOR / $\oplus$) pada level bit.
  * Karakteristik matematis involutori: Jika $C = P \oplus K$, maka $P = C \oplus K$ (operasi yang sama digunakan untuk enkripsi dan dekripsi).
  * Analisis ruang kunci terbatas: Kunci berukuran 1-byte (8-bit) hanya memiliki $2^8 = 256$ kemungkinan nilai (dari 0 hingga 255).
* **Kemampuan yang Diuji**:
  * Memahami cara kerja enkripsi XOR byte per byte pada data heksadesimal.
  * Menerapkan strategi pengujian seluruh ruang kunci (*brute force search*) untuk menemukan kunci yang menghasilkan teks bermakna.
* **Kata Kunci Penyelidikan**: *Bitwise XOR Operator, Involutory Property, Single-Byte Key Space (0-255), Hexadecimal Stream, Pattern Recognition*.

---

### Topik 2.4: Sandi Substitusi Polialfabetik (Vigenère)
* **Fondasi Teori**:
  * Sandi substitusi polialfabetik yang menggunakan kata kunci (*keyphrase*) untuk menentukan besar pergeseran huruf yang bervariasi pada setiap posisi.
  * Penggunaan tabel alfabet pergeseran bertingkat (*Tabula Recta*).
  * Perulangan kata kunci (*repeating keystream*) untuk mencocokkan panjang pesan asli.
* **Kemampuan yang Diuji**:
  * Memahami hubungan matematis antara karakter sandi, karakter kunci, dan karakter asli: $P_i = (C_i - K_i) \pmod{26}$.
  * Merekonsiliasi teks sandi menggunakan kata kunci yang diketahui untuk memulihkan dokumen terenkripsi.
* **Kata Kunci Penyelidikan**: *Polyalphabetic Cipher, Tabula Recta, Repeating Keystream, Key Mapping, Vigenère Decryption*.

---

## 🔍 3. Kategori: Digital Forensics (Forensik Digital)

Kategori ini menguji kejelian peserta dalam memeriksa artefak digital, integritas berkas biner, teknik penyembunyian informasi di dalam multimedia, serta rekaman transmisi jaringan.

```
 [ Berkas Digital / Media ] ──> [ Analisis Struktur Biner ] ──> [ Ekstraksi Artefak Tersembunyi ]
  • Metadata EXIF                • Magic Bytes / Signature       • Appended Containers (ZIP)
  • Rekaman Jaringan (PCAP)      • Hex Stream Inspection         • TCP/HTTP Stream Reassembly
```

### Topik 3.1: Eksplorasi Metadata Berkas Multimedia
* **Fondasi Teori**:
  * Konsep metadata (*data about data*) yang disimpan secara otomatis oleh perangkat pembuat dokumen/citra.
  * Standar *Exchangeable Image File Format* (EXIF) pada berkas foto digital.
  * Bidang-bidang metadata teks: *UserComment*, *XPComment*, *ImageDescription*, *Artist*, dan *Camera Equipment Data*.
* **Kemampuan yang Diuji**:
  * Mengekstraksi atribut properti tersembunyi yang melekat pada berkas tanpa merusak integritas konten visual citra.
  * Mengenali keberadaan informasi non-visual di dalam kontainer berkas grafis.
* **Kata Kunci Penyelidikan**: *Image Metadata, EXIF Specification, File Properties, User Comment Fields, Non-visual Artifacts*.

---

### Topik 3.2: Integritas Struktur Biner Berkas & *Magic Bytes*
* **Fondasi Teori**:
  * Konsep tanda tangan berkas (*File Signature / Magic Bytes*), yaitu deretan bita unik pada awal berkas (offset `0x00`) yang digunakan sistem operasi untuk mengidentifikasi format berkas yang sebenarnya (bukan sekadar melihat nama ekstensi).
  * Struktur spesifikasi berkas citra umum (misalnya tanda tangan baku berkas PNG sepanjang 8 byte).
  * Gejala berkas biner rusak (*corrupt file header*) yang mengakibatkan aplikasi penampil berkas menolak memuat data.
* **Kemampuan yang Diuji**:
  * Memeriksa isi mentah berkas dalam format heksadesimal (*Hex stream*).
  * Mengidentifikasi anomali atau kerusakan pada beberapa byte pertama berkas, serta melakukan perbaikan (*patching*) manual pada byte yang rusak agar berkas dapat kembali dibuka dengan normal.
* **Kata Kunci Penyelidikan**: *Magic Numbers, File Signature, Header Integrity, Hex Inspection, Byte Patching, Binary File Structure*.

---

### Topik 3.3: Steganografi Penanda Akhir Berkas (*EOF File Carving*)
* **Fondasi Teori**:
  * Setiap format berkas memiliki penanda akhir dokumen baku (*End of File / EOF marker*), misalnya byte `FF D9` pada format JPEG.
  * Aplikasi penampil gambar standar akan berhenti merender data tepat setelah menemukan penanda EOF tersebut.
  * Teknik penyembunyian berkas (*appended file steganography*), yaitu menyematkan berkas lain (seperti arsip kontainer ZIP atau berkas teks) di belakang batas EOF gambar.
* **Kemampuan yang Diuji**:
  * Menyelidiki ketidakwajaran ukuran berkas citra dibandingkan dengan resolusi visualnya.
  * Mendeteksi keberadaan penanda kontainer arsip sekunder di luar batas penanda akhir berkas utama, dan melakukan ekstraksi berkas (*carving/unzipping*).
* **Kata Kunci Penyelidikan**: *End of File (EOF), JPEG EOF Marker (FF D9), Appended Data, File Carving, Secondary Container, Archive Embedding*.

---

### Topik 3.4: Analisis Lalu Lintas Jaringan & Rekonstruksi Aliran Protokol
* **Fondasi Teori**:
  * Format rekaman penyadapan paket jaringan (*Packet Capture / PCAP*).
  * Struktur tumpukan protokol jaringan (Ethernet ➔ IP ➔ TCP ➔ Application Layer).
  * Karakteristik komunikasi protokol teks terbuka (*clear-text protocols* seperti HTTP) yang tidak menerapkan enkripsi TLS/SSL.
* **Kemampuan yang Diuji**:
  * Membuka dan menavigasi rekaman jejak transmisi jaringan komputer.
  * Menerapkan aturan penyaringan (*display filters*) untuk memisahkan paket data protokol aplikasi yang diminati dari paket lalu lintas jaringan lainnya.
  * Menggabungkan segmen-segmen paket yang terpecah menjadi satu aliran percakapan utuh (*Stream Reassembly*) untuk membaca payload komunikasi.
* **Kata Kunci Penyelidikan**: *Packet Capture (PCAP), Display Filtering, Clear-text HTTP Traffic, TCP Stream Reassembly, Payload Inspection*.

---

## 🛠️ Matriks Kesiapan Perangkat (*Tools Checklist*)

Berikut adalah perangkat yang disarankan untuk disiapkan pada komputer peserta sebelum kompetisi dimulai:

| Kategori | Nama Perangkat | Fungsi / Kegunaan Utama | Platform |
| :--- | :--- | :--- | :--- |
| **Web** | **Chrome / Firefox DevTools** | Inspeksi elemen, monitoring lalu lintas jaringan, pengelolaan cookie | Terbawa di Browser |
| **Web** | **cURL / Postman / ReqBin** | Pengujian transmisi HTTP request/response secara kustom | CLI / Desktop / Web |
| **Crypto** | **CyberChef (GCHQ)** | "Swiss Army Knife" untuk encoding, enkripsi, XOR, dan analisis sandi | Web (Online/Offline) |
| **Crypto** | **Python 3** | Otomasi pengujian logika, konversi basis data, dan kalkulasi matematis | Windows / Mac / Linux |
| **Crypto** | **dcode.fr** | Referensi analisis sandi klasik dan verifikasi alfabetik | Web |
| **Forensik** | **HxD / HexEd.it** | Editor heksadesimal untuk inspeksi dan perbaikan biner berkas mentah | Windows / Web |
| **Forensik** | **ExifTool / File Properties** | Ekstraktor metadata dan pembaca tag komentar berkas | CLI / GUI Windows |
| **Forensik** | **7-Zip / WinRAR** | Pembuka arsip kontainer dan pengujian steganografi terlampir | Desktop |
| **Forensik** | **Wireshark** | Penganalisis paket jaringan dan rekonstruksi stream protokol | Windows / Mac / Linux |

---

## 💡 Pola Pikir & Tips Menghadapi Tantangan CTF

1. **Baca Deskripsi & Clue dengan Cermat**: Setiap kata dalam judul dan deskripsi soal sering kali memuat analogi terselubung mengenai teknik atau algoritma yang digunakan.
2. **Periksa Karakteristik Masukan/Keluaran**:
   * Jika menemukan teks acak dengan huruf besar/kecil yang susunannya menyerupai kata bahasa manusia, kemungkinan itu adalah **sandi pergeseran/substitusi**.
   * Jika hanya melihat kumpulan digit `0` dan `1`, atau angka heksadesimal, periksalah panjang bit dan konversinya.
   * Jika ada berkas citra yang menolak terbuka, jangan langsung berasumsi file tersebut rusak permanen; periksalah tanda tangan awal berkasnya (*magic bytes*).
3. **Pahami Batasan Tanpa Berspekulasi Berlebihan**: Tantangan tingkat pemula-menengah dirancang dengan jalur logika yang bersih dan terstruktur. Hindari melakukan tebak-tebakan acak tanpa hipotesis yang berdasar.
4. **Validasi Format Jawaban**: Pastikan seluruh flag diserahkan sesuai format yang telah ditentukan, yaitu diawali dengan `CTF{` dan diakhiri dengan `}` tanpa ada spasi tambahan di awal atau akhir.

Selamat berlatih dan bertanding di **CyberStrike CTF**! 🚀
