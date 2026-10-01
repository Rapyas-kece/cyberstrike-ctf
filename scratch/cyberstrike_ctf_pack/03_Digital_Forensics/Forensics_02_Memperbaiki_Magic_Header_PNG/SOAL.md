# Tantangan: Memperbaiki Magic Header PNG
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
