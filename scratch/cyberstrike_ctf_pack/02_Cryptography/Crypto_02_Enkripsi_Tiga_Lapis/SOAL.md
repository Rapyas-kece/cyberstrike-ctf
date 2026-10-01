# Tantangan: Enkripsi Tiga Lapis
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
