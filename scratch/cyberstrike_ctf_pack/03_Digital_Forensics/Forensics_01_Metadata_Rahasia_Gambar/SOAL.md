# Tantangan: Metadata Rahasia Gambar
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
