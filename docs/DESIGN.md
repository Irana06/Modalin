# Arah Desain Modalin

Diturunkan dari gaya [shicomp](https://github.com/Irana06/shicomp): kertas hangat, tinta coklat, satu aksen merah.

**Design read:** aplikasi pembiayaan UMKM untuk pelaku usaha dan petugas, gaya kertas dan tinta yang hangat, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## Palet

| Token | Hex | Dipakai untuk |
| --- | --- | --- |
| `paper` | `#fbf5ef` | Latar halaman |
| `paper-deep` | `#f5e9de` | Sidebar, latar sekunder |
| `surface` | `#fffcf9` | Kartu, input |
| `line` / `line-strong` | `#eddccd` / `#e3cdbd` | Garis dan border input |
| `ink` | `#35231c` | Teks utama, tombol gelap, band motif |
| `ink-muted` | `#76625a` | Teks sekunder (kontras 5:1 di atas `paper`) |
| `shu` / `shu-deep` | `#d53b3a` / `#b32e2d` | Aksen tunggal: CTA utama, tahap yang sedang berjalan. Teks kecil merah selalu pakai `shu-deep` |
| `shu-soft` | `#fce4e1` | Latar badge status yang sedang berjalan |
| `daun` / `daun-soft` | `#2f6b45` / `#e2efe5` | Khusus status selesai (dana cair). Warna fungsional, bukan bagian palet merek |

## Tipografi

- **Zen Maru Gothic** (judul): huruf membulat yang ramah, dipakai shicomp. Untuk aplikasi keuangan, kesan ramah ini mengurangi kesan "bank yang kaku".
- **Zen Kaku Gothic New** (teks): pasangan Zen Maru, tetap terbaca jelas di tabel angka.

## Motif identitas

**Kawung** di band gelap (`ink`). Motif batik Jawa yang menggantikan seigaiha dari shicomp, karena Modalin bertema UMKM lokal. Hanya dipakai di 1 band per halaman: simulasi cicilan di landing dan panel samping login.

## Komponen

- Radius 12px untuk kartu, 8px untuk tombol dan input, 6px untuk badge. Tidak ada yang berbentuk pil, kecuali titik status.
- Bayangan hanya untuk elemen yang mengambang: modal, toast, dan kartu contoh di hero.
- Timeline status (dari halaman Cek Status shicomp) menjadi pola utama untuk menampilkan alur approval.

## Gerak

MOTION 1: transisi hover, fade 150ms saat pindah layar, skeleton saat memuat, spinner di tombol. Semuanya dimatikan saat `prefers-reduced-motion`.

## Yang sengaja tidak dibuat

- Dark mode: identitas kertas-tinta sudah tetap, dan tidak dinilai di rubrik.
- Testimoni, statistik, dan FAQ: belum ada data nyata.
- Logo gambar: memakai nama "Modalin" dalam font judul sampai ada logo resmi.
