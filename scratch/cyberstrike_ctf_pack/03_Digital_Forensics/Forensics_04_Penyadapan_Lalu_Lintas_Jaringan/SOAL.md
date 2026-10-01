# Tantangan: Penyadapan Lalu Lintas Jaringan
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
