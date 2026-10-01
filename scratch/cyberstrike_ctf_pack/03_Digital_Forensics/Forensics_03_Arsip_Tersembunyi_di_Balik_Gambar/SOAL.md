# Tantangan: Arsip Tersembunyi di Balik Gambar
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
