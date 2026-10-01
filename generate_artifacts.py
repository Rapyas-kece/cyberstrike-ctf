import os
import io
import struct
import zipfile
import base64
from PIL import Image, ImageDraw, ImageFont, ExifTags, PngImagePlugin

DOWNLOADS_DIR = os.path.join(os.path.dirname(__file__), "public", "downloads")
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets", "source_images")
os.makedirs(DOWNLOADS_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

print(f"Membuat file soal di {DOWNLOADS_DIR}...")

# ==========================================
# 1. KRIPTOGRAFI 1: Sandi Pergeseran Romawi (ROT13)
# ==========================================
def rot13(text):
    out = []
    for c in text:
        if 'a' <= c <= 'z':
            out.append(chr((ord(c) - ord('a') + 13) % 26 + ord('a')))
        elif 'A' <= c <= 'Z':
            out.append(chr((ord(c) - ord('A') + 13) % 26 + ord('A')))
        else:
            out.append(c)
    return "".join(out)

crypto1_plain = """[PESAN TERENKRIPSI - KLASIFIKASI RAHASIA]
Pemberitahuan Sistem:
Pesan rahasia ini diamankan menggunakan algoritma pergeseran alfabet klasik zaman Romawi (Caesar Cipher dengan pergeseran 13 huruf atau ROT13).
Gunakan decoder ROT13 untuk membaca teks asli dan mendapatkan flag berikut:

FLAG: CTF{sandi_caesar_rot13_dasar}

Semoga berhasil!
"""

crypto1_cipher = rot13(crypto1_plain)
with open(os.path.join(DOWNLOADS_DIR, "pesan_rot13.txt"), "w", encoding="utf-8") as f:
    f.write(crypto1_cipher)

print("[OK] Kriptografi 1: pesan_rot13.txt berhasil dibuat")

# ==========================================
# 2. KRIPTOGRAFI 2: Enkripsi Tiga Lapis
# ==========================================
flag2 = "CTF{tiga_lapis_encoding_biner_hex_base64}"
step1_b64 = base64.b64encode(flag2.encode('utf-8')).decode('utf-8')
step2_hex = step1_b64.encode('utf-8').hex()
step3_bin = " ".join(f"{b:08b}" for b in step2_hex.encode('utf-8'))

crypto2_content = f"""[DOKUMEN RAHASIA - ENKODING TIGA TAHAP]
Petunjuk:
Teks flag telah disamarkan melewati 3 tahapan enkodir:
1. Base64 Encoding
2. Representasi Heksadesimal
3. Konversi Biner 8-bit

Lakukan proses sebaliknya secara berurutan:
Biner (8-bit) ➔ Teks Heksadesimal ➔ Dekode Base64 ➔ Plaintext Flag!

--- PAYLOAD BINER ---
{step3_bin}
--------------------
"""
with open(os.path.join(DOWNLOADS_DIR, "rahasia_tiga_lapis.txt"), "w", encoding="utf-8") as f:
    f.write(crypto2_content)

print("[OK] Kriptografi 2: rahasia_tiga_lapis.txt berhasil dibuat")

# ==========================================
# 3. KRIPTOGRAFI 3: Teka-Teki Kunci Tunggal XOR
# ==========================================
flag3 = "CTF{single_byte_xor_kunci_terbongkar}"
xor_key = 0x5A  # 90 decimal

cipher_bytes = bytes([b ^ xor_key for b in flag3.encode('utf-8')])
cipher_hex = cipher_bytes.hex()

# Simpan hanya ciphertext hex (peserta harus menulis solver / brute force sendiri)
with open(os.path.join(DOWNLOADS_DIR, "ciphertext_xor.hex"), "w", encoding="utf-8") as f:
    f.write(cipher_hex)

# Hapus xor_solver_hint.py jika ada agar tidak membocorkan kode pemecah soal
hint_path = os.path.join(DOWNLOADS_DIR, "xor_solver_hint.py")
if os.path.exists(hint_path):
    os.remove(hint_path)

print("[OK] Kriptografi 3: ciphertext_xor.hex berhasil dibuat (tanpa spoiler script)")

# ==========================================
# 4. KRIPTOGRAFI 4: Sandi Polialfabetik Vigenère
# ==========================================
def vigenere_encrypt(plain, key):
    key = key.upper()
    out = []
    k_idx = 0
    for c in plain:
        if 'a' <= c <= 'z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            out.append(chr((ord(c) - ord('a') + shift) % 26 + ord('a')))
            k_idx += 1
        elif 'A' <= c <= 'Z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            out.append(chr((ord(c) - ord('A') + shift) % 26 + ord('A')))
            k_idx += 1
        else:
            out.append(c)
    return "".join(out)

raw_vigenere_text = "CATATAN RAHASIA OPERASI: KODE VERIFIKASI ADALAH CTF{sandi_vigenere_kunci_rahasia}. SIMPAN DENGAN AMAN."
cipher_vigenere = vigenere_encrypt(raw_vigenere_text, "RAHASIA")

crypto4_content = f"""[MEMORANDUM SANDI - KLASIFIKASI TERBATAS]
Petunjuk:
Pesan ini dienkripsi menggunakan sandi Vigenère polialfabetik klasik.
Kata kunci dekripsi adalah: RAHASIA (huruf kapital semua).

--- CIPHERTEXT ---
{cipher_vigenere}
------------------
"""

with open(os.path.join(DOWNLOADS_DIR, "sandi_vigenere.txt"), "w", encoding="utf-8") as f:
    f.write(crypto4_content)

print("[OK] Kriptografi 4: sandi_vigenere.txt berhasil dibuat")

# ==========================================
# 5. DIGITAL FORENSIK 1: Metadata Rahasia Gambar
# ==========================================
flag_forensics1 = "CTF{metadata_exif_gambar_ditemukan}"

cctv_src = os.path.join(ASSETS_DIR, "cctv_evidence.jpg")
if os.path.exists(cctv_src):
    img1 = Image.open(cctv_src).convert('RGB')
    img1 = img1.resize((1280, 720), Image.Resampling.LANCZOS)
else:
    img1 = Image.new('RGB', (1280, 720), color=(10, 15, 26))

draw1 = ImageDraw.Draw(img1)
try:
    font_large = ImageFont.truetype("consolab.ttf", 24)
    font_med = ImageFont.truetype("consolab.ttf", 18)
    font_small = ImageFont.truetype("consolab.ttf", 14)
except Exception:
    font_large = font_med = font_small = None

# CCTV Tactical HUD overlay (murni tampilan rekaman pengawasan tanpa membocorkan isi flag)
draw1.rectangle([20, 20, 1260, 700], outline=(56, 189, 248), width=2)
# Top left badge
draw1.rectangle([35, 35, 460, 95], fill=(15, 23, 42, 220), outline=(56, 189, 248), width=1)
draw1.text((50, 42), "SISTEM PENGAWASAN CCTV #001", font=font_med, fill=(56, 189, 248))
draw1.text((50, 68), "LOKASI: DATA CENTER - VAULT ROOM", font=font_small, fill=(203, 213, 225))

# Bottom banner status (tidak menyebutkan flag secara eksplisit)
draw1.rectangle([35, 635, 1245, 685], fill=(15, 23, 42, 230), outline=(56, 189, 248), width=1)
draw1.text((50, 642), "STATUS: REKAMAN RESMI TERENKRIPSI - CHAIN OF CUSTODY AKTIF", font=font_small, fill=(56, 189, 248))
draw1.text((50, 662), "ID PERANGKAT: HIK-DS2CD2143G2 | FIRMWARE v4.2.1-SEC", font=font_small, fill=(148, 163, 184))

# Setup EXIF tags - flag tersimpan di metadata teknis, bukan di judul/tooltip Windows
exif1 = img1.getexif()
exif1[0x010E] = f"Barang Bukti Forensik #001 | Token Flag: {flag_forensics1}" # ImageDescription
exif1[0x013B] = "Unit Forensik Digital CyberStrike" # Artist
exif1[0x0131] = "CyberStrike Forensic Suite v4.2" # Software
exif1[0x010F] = "Hikvision Digital CCTV" # Make
exif1[0x0110] = "DS-2CD2143G2-IS Network Camera" # Model
exif1[0x9003] = "2026:09:29 02:44:12" # DateTimeOriginal

# Windows Explorer XP Tags (tanpa membocorkan flag di hover tooltip)
exif1[0x9C9B] = "Barang Bukti #001 - Citra Pengawasan CCTV Ruang Vault".encode('utf-16le') # XPTitle
exif1[0x9C9C] = "Analisis metadata citra digital menggunakan ExifTool atau strings.".encode('utf-16le') # XPComment
exif1[0x9C9D] = "CyberStrike Digital Forensics Investigator".encode('utf-16le') # XPAuthor
exif1[0x9C9F] = "Rekaman Barang Bukti Forensik".encode('utf-16le') # XPSubject

# Save to buffer with EXIF
buf1 = io.BytesIO()
img1.save(buf1, format='JPEG', quality=95, exif=exif1)
jpeg_bytes1 = buf1.getvalue()

# Inject COM marker (FF FE)
com_data1 = f"Dokumen Forensik Resmi | Token Verifikasi: {flag_forensics1}".encode('utf-8')
com_marker1 = b"\xff\xfe" + struct.pack(">H", len(com_data1) + 2) + com_data1

app_end = 2
if jpeg_bytes1.startswith(b"\xff\xd8"):
    if jpeg_bytes1[2] == 0xFF:
        marker_len = struct.unpack(">H", jpeg_bytes1[4:6])[0]
        app_end = 4 + marker_len

final_jpeg1 = jpeg_bytes1[:app_end] + com_marker1 + jpeg_bytes1[app_end:]

with open(os.path.join(DOWNLOADS_DIR, "bukti_gambar.jpg"), "wb") as f:
    f.write(final_jpeg1)

print("[OK] Digital Forensik 1: bukti_gambar.jpg berhasil dibuat (Flag aman di dalam metadata EXIF/COM)")

# ==========================================
# 6. DIGITAL FORENSIK 2: Memperbaiki Magic Header PNG
# ==========================================
flag_forensics2 = "CTF{magic_bytes_png_berhasil_diperbaiki}"
# Token disamarkan dalam Base64 agar flag tidak langsung terbaca secara gamblang
b64_token2 = base64.b64encode(flag_forensics2.encode('utf-8')).decode('utf-8')

doc_src = os.path.join(ASSETS_DIR, "cyber_document.jpg")
if os.path.exists(doc_src):
    img2 = Image.open(doc_src).convert('RGB')
    img2 = img2.resize((1280, 720), Image.Resampling.LANCZOS)
else:
    img2 = Image.new('RGB', (1280, 720), color=(10, 15, 30))

draw2 = ImageDraw.Draw(img2)
# Gambar token clearance dalam bentuk Base64 yang rapi (tidak langsung menuliskan flag polos)
draw2.rectangle([40, 615, 1240, 685], fill=(10, 15, 30, 240), outline=(16, 185, 129), width=2)
draw2.text((60, 626), "SECURITY CLEARANCE ACCESS TOKEN (BASE64):", font=font_small, fill=(52, 211, 153))
draw2.text((60, 646), f"{b64_token2}", font=font_med, fill=(255, 255, 255))
draw2.text((60, 668), "Petunjuk: Dekode token Base64 di atas untuk mendapatkan plaintext flag resmi.", font=font_small, fill=(148, 163, 184))

buf2 = io.BytesIO()
png_info = PngImagePlugin.PngInfo()
png_info.add_text("Token-Akses", b64_token2)
png_info.add_text("Comment", "Security Clearance Token (Base64). Decode with Base64 to reveal flag.")
img2.save(buf2, format='PNG', pnginfo=png_info)
valid_png = buf2.getvalue()

# Rusak 8 byte pertama (Magic Bytes diubah jadi 00 00 00 00 00 00 00 00)
# Peserta harus memperbaikinya dengan Hex Editor untuk membuka gambar
corrupted_png = b"\x00\x00\x00\x00\x00\x00\x00\x00" + valid_png[8:]

with open(os.path.join(DOWNLOADS_DIR, "berkas_rusak.png"), "wb") as f:
    f.write(corrupted_png)

print("[OK] Digital Forensik 2: berkas_rusak.png berhasil dibuat (Header rusak 00, Token Base64 aman)")

# ==========================================
# 7. DIGITAL FORENSIK 3: Arsip Tersembunyi di Balik Gambar
# ==========================================
flag_forensics3 = "CTF{arsip_zip_tersembunyi_di_gambar}"

photo_src = os.path.join(ASSETS_DIR, "corporate_photo.jpg")
if os.path.exists(photo_src):
    img3 = Image.open(photo_src).convert('RGB')
    img3 = img3.resize((1280, 720), Image.Resampling.LANCZOS)
else:
    img3 = Image.new('RGB', (1280, 720), color=(30, 27, 75))

buf3 = io.BytesIO()
img3.save(buf3, format='JPEG', quality=92)
cover_jpeg = buf3.getvalue()

if not cover_jpeg.endswith(b"\xff\xd9"):
    cover_jpeg = cover_jpeg + b"\xff\xd9"

zip_buf = io.BytesIO()
with zipfile.ZipFile(zip_buf, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr("flag_rahasia.txt", f"Selamat! Anda berhasil mengekstrak arsip tersembunyi.\n\nFLAG: {flag_forensics3}\n")
    z.writestr("catatan_stego.txt", "Teknik penyematan arsip ZIP setelah tanda EOF JPEG (FF D9) adalah metode steganografi klasik (Appended File Steganography).\n")

zip_bytes = zip_buf.getvalue()
combined_stego = cover_jpeg + zip_bytes

with open(os.path.join(DOWNLOADS_DIR, "foto_penyamaran.jpg"), "wb") as f:
    f.write(combined_stego)

print("[OK] Digital Forensik 3: foto_penyamaran.jpg berhasil dibuat (JPEG Asli + Appended ZIP)")

# ==========================================
# 8. DIGITAL FORENSIK 4: Penyadapan Lalu Lintas Jaringan (PCAP Standar Scapy)
# ==========================================
flag_forensics4 = "CTF{analisis_paket_jaringan_http_wireshark}"

from scapy.all import Ether, IP, TCP, Raw, wrpcap

client_mac = "00:0c:29:12:34:56"
server_mac = "00:50:56:ab:cd:ef"
client_ip = "192.168.1.105"
server_ip = "192.168.1.200"
client_port = 49200
server_port = 80

body_json = f'{{"status":"sukses","pesan":"Akses Diberikan","token_akses":"{flag_forensics4}"}}\n'.encode('utf-8')
resp_headers = (
    f"HTTP/1.1 200 OK\r\n"
    f"Server: nginx/1.24.0\r\n"
    f"Date: Tue, 29 Sep 2026 05:40:00 GMT\r\n"
    f"Content-Type: application/json\r\n"
    f"Content-Length: {len(body_json)}\r\n"
    f"Connection: close\r\n\r\n"
).encode('utf-8')
http_resp = resp_headers + body_json

http_req = (
    b"POST /api/v1/auth/login HTTP/1.1\r\n"
    b"Host: portal-internal.siber.local\r\n"
    b"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Wireshark/4.2\r\n"
    b"Content-Type: application/json\r\n"
    b"Content-Length: 33\r\n\r\n"
    b'{"user":"analis","aksi":"otentikasi"}'
)

base_time = 1774700000.0
c_to_s = Ether(src=client_mac, dst=server_mac)/IP(src=client_ip, dst=server_ip)
s_to_c = Ether(src=server_mac, dst=client_mac)/IP(src=server_ip, dst=client_ip)

pkts = []
# 1. TCP SYN
p1 = c_to_s/TCP(sport=client_port, dport=server_port, flags="S", seq=1000)
p1.time = base_time + 0.01; pkts.append(p1)

# 2. TCP SYN-ACK
p2 = s_to_c/TCP(sport=server_port, dport=client_port, flags="SA", seq=5000, ack=1001)
p2.time = base_time + 0.02; pkts.append(p2)

# 3. TCP ACK
p3 = c_to_s/TCP(sport=client_port, dport=server_port, flags="A", seq=1001, ack=5001)
p3.time = base_time + 0.03; pkts.append(p3)

# 4. HTTP POST Request
p4 = c_to_s/TCP(sport=client_port, dport=server_port, flags="PA", seq=1001, ack=5001)/Raw(http_req)
p4.time = base_time + 0.05; pkts.append(p4)

# 5. Server TCP ACK
p5 = s_to_c/TCP(sport=server_port, dport=client_port, flags="A", seq=5001, ack=1001 + len(http_req))
p5.time = base_time + 0.06; pkts.append(p5)

# 6. HTTP 200 OK Response
p6 = s_to_c/TCP(sport=server_port, dport=client_port, flags="PA", seq=5001, ack=1001 + len(http_req))/Raw(http_resp)
p6.time = base_time + 0.08; pkts.append(p6)

# 7. Client TCP ACK
p7 = c_to_s/TCP(sport=client_port, dport=server_port, flags="A", seq=1001 + len(http_req), ack=5001 + len(http_resp))
p7.time = base_time + 0.09; pkts.append(p7)

# 8. Server TCP FIN-ACK
p8 = s_to_c/TCP(sport=server_port, dport=client_port, flags="FA", seq=5001 + len(http_resp), ack=1001 + len(http_req))
p8.time = base_time + 0.10; pkts.append(p8)

# 9. Client TCP FIN-ACK
p9 = c_to_s/TCP(sport=client_port, dport=server_port, flags="FA", seq=1001 + len(http_req), ack=5001 + len(http_resp) + 1)
p9.time = base_time + 0.11; pkts.append(p9)

# 10. Server Final TCP ACK
p10 = s_to_c/TCP(sport=server_port, dport=client_port, flags="A", seq=5001 + len(http_resp) + 1, ack=1001 + len(http_req) + 1)
p10.time = base_time + 0.12; pkts.append(p10)

pcap_target = os.path.join(DOWNLOADS_DIR, "rekaman_jaringan.pcap")
wrpcap(pcap_target, pkts)

print("[OK] Digital Forensik 4: rekaman_jaringan.pcap berhasil dibuat dengan Scapy (10 paket standar)")
print("Semua file artefak soal berhasil diperbarui dengan foto dan metadata berkualitas tinggi!")
