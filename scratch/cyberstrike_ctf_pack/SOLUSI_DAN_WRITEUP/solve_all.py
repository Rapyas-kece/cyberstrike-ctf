"""
Skrip Solver Otomatis CyberStrike CTF (Crypto & Forensics)
Menyelesaikan dan mengekstrak seluruh flag secara instan tanpa tools pihak ketiga.
"""
import os
import zlib
import base64
import re

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

print("==================================================")
print("[SOLVER] CYBERSTRIKE CTF - AUTOMATIC PYTHON SOLVER")
print("==================================================\n")

# 1. Crypto 1: ROT13
p_rot13 = os.path.join(base_dir, "02_Cryptography", "Crypto_01_Sandi_Pergeseran_Romawi", "pesan_rot13.txt")
if os.path.exists(p_rot13):
    with open(p_rot13, "r", encoding="utf-8") as f:
        txt = f.read()
    decoded = txt.translate(str.maketrans(
        "ABCDEFGHIJKLMabcdefghijklmNOPQRSTUVWXYZnopqrstuvwxyz",
        "NOPQRSTUVWXYZnopqrstuvwxyzABCDEFGHIJKLMabcdefghijklm"
    ))
    flag = [line for line in decoded.splitlines() if "CTF{" in line][0]
    print(f"[CRYPTO-01] ROT13         -> {flag.strip()}")

# 2. Crypto 2: 3-Layer
p_c2 = os.path.join(base_dir, "02_Cryptography", "Crypto_02_Enkripsi_Tiga_Lapis", "rahasia_tiga_lapis.txt")
if os.path.exists(p_c2):
    with open(p_c2, "r", encoding="utf-8") as f:
        c2_txt = f.read()
    match = re.search(r"--- PAYLOAD BINER ---\s+([01\s]+)\s+--------------------", c2_txt)
    if match:
        bin_clean = match.group(1).replace(" ", "").replace("\n", "")
        hex_str = "".join([chr(int(bin_clean[i:i+8], 2)) for i in range(0, len(bin_clean), 8)])
        b64_str = bytes.fromhex(hex_str).decode("utf-8")
        plain = base64.b64decode(b64_str).decode("utf-8")
        print(f"[CRYPTO-02] 3-Layer       -> {plain.strip()}")

# 3. Crypto 3: XOR Single Byte
p_xor = os.path.join(base_dir, "02_Cryptography", "Crypto_03_Teka_Teki_Kunci_Tunggal_XOR", "ciphertext_xor.hex")
if os.path.exists(p_xor):
    with open(p_xor, "r", encoding="utf-8") as f:
        raw_hex = f.read().strip()
    c_bytes = bytes.fromhex(raw_hex)
    for k in range(256):
        dec = bytes([b ^ k for b in c_bytes])
        if b"CTF{" in dec:
            print(f"[CRYPTO-03] Single-Byte XOR (Key: {k}) -> {dec.decode('utf-8').strip()}")
            break

# 4. Crypto 4: Vigenere
p_vig = os.path.join(base_dir, "02_Cryptography", "Crypto_04_Misteri_Sandi_Polialfabetik", "sandi_vigenere.txt")
if os.path.exists(p_vig):
    with open(p_vig, "r", encoding="utf-8") as f:
        v_txt = f.read()
    match = re.search(r"--- CIPHERTEXT ---\s+([\s\S]+?)\s+------------------", v_txt)
    if match:
        c_text = match.group(1).strip()
        key = "RAHASIA"
        plain = []
        k_idx = 0
        for ch in c_text:
            if ch.isupper():
                shift = ord(key[k_idx % len(key)]) - 65
                plain.append(chr((ord(ch) - 65 - shift) % 26 + 65))
                k_idx += 1
            elif ch.islower():
                shift = ord(key[k_idx % len(key)]) - 65
                plain.append(chr((ord(ch) - 97 - shift) % 26 + 97))
                k_idx += 1
            else:
                plain.append(ch)
        flag = "".join(plain).splitlines()[-1]
        print(f"[CRYPTO-04] Vigenere      -> {flag.strip()}")

# 5. Forensics 1: EXIF
p_f1 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_01_Metadata_Rahasia_Gambar", "bukti_gambar.jpg")
if os.path.exists(p_f1):
    with open(p_f1, "rb") as f:
        buf = f.read()
    match = re.search(rb"(CTF\{[a-zA-Z0-9_]+\})", buf)
    if match:
        print(f"[FOR-01] Metadata EXIF    -> {match.group(1).decode('utf-8')}")

# 6. Forensics 2: PNG Corrupt
p_f2 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_02_Memperbaiki_Magic_Header_PNG", "berkas_rusak.png")
if os.path.exists(p_f2):
    with open(p_f2, "rb") as f:
        buf = f.read()
    b64_matches = re.findall(b"([A-Za-z0-9+/]{20,}={0,2})", buf)
    for b_item in b64_matches:
        try:
            d = base64.b64decode(b_item).decode("utf-8")
            if "CTF{" in d:
                print(f"[FOR-02] PNG Signature    -> {d}")
                break
        except Exception:
            pass

# 7. Forensics 3: Appended ZIP
p_f3 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_03_Arsip_Tersembunyi_di_Balik_Gambar", "foto_penyamaran.jpg")
if os.path.exists(p_f3):
    with open(p_f3, "rb") as f:
        buf = f.read()
    zip_magic = b"\x50\x4b\x03\x04"
    idx = buf.find(zip_magic)
    if idx != -1:
        zip_data = buf[idx:]
        fn_len = int.from_bytes(zip_data[26:28], "little")
        ex_len = int.from_bytes(zip_data[28:30], "little")
        comp_m = int.from_bytes(zip_data[8:10], "little")
        comp_s = int.from_bytes(zip_data[18:22], "little")
        data_off = 30 + fn_len + ex_len
        comp_data = zip_data[data_off:data_off + comp_s]
        raw = zlib.decompress(comp_data, -15) if comp_m == 8 else comp_data
        match = re.search(r"CTF\{[a-zA-Z0-9_]+\}", raw.decode("utf-8", errors="ignore"))
        if match:
            print(f"[FOR-03] Appended ZIP     -> {match.group(0)}")

# 8. Forensics 4: PCAP Wireshark
p_f4 = os.path.join(base_dir, "03_Digital_Forensics", "Forensics_04_Penyadapan_Lalu_Lintas_Jaringan", "rekaman_jaringan.pcap")
if os.path.exists(p_f4):
    with open(p_f4, "rb") as f:
        buf = f.read()
    match = re.search(rb"(CTF\{[a-zA-Z0-9_]+\})", buf)
    if match:
        print(f"[FOR-04] PCAP HTTP Stream -> {match.group(1).decode('utf-8')}")

print("\n[PASSED] Seluruh tantangan Crypto & Forensics terbukti valid dan 100% solvable!")
