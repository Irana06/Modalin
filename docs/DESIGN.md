# Arah Desain Modalin

Mengikuti gaya [miravatech](https://github.com/Irana06/miravatech): **Sumi & Ai**, tinta hitam di atas kertas washi, dengan biru indigo (ai) sebagai satu-satunya aksen. Tata letaknya editorial: nomor bagian, kata Jepang yang ditulis vertikal, judul besar yang tipis, dan garis 1px sebagai pemisah.

**Design read:** aplikasi pembiayaan UMKM untuk pelaku usaha dan petugas, gaya editorial tinta dan kertas, dial ENERGY 2 / RHYTHM 3 / MOTION 2.

## Palet

Sama dengan palet miravatech, ditambah satu warna untuk error.

| Token | Hex | Dipakai untuk |
| --- | --- | --- |
| `paper` | `#f5f3ee` | Latar halaman |
| `paper-deep` | `#ece9e2` | Sidebar, band simulasi, hover baris tabel |
| `surface` | `#fbfaf7` | Kartu, input |
| `line` / `line-strong` | `#dcd8cf` / `#bdb8ad` | Garis pemisah dan border input |
| `ink` | `#161616` | Teks utama, tombol utama, garis di bawah judul |
| `ink-muted` / `ink-subtle` | `#57544e` / `#6b6760` | Teks sekunder (6,8:1) dan label kecil (5,1:1) di atas `paper` |
| `ai` / `ai-deep` / `ai-soft` | `#2c3a8f` / `#1e2866` / `#e4e6ef` | Aksen tunggal: hover tombol utama, tahap yang sedang berjalan, kode pengajuan, tautan |
| `night` / `night-muted` | `#141414` / `#a19e96` | Band gelap (alur di landing, panel login, footer) |
| `beni` / `beni-soft` | `#a52a22` / `#f6e4e1` | Khusus error, penolakan, dan tombol hapus. Bukan bagian palet merek |

Status pengajuan memakai palet yang sama: menunggu = `ai-soft`, siap dicairkan = `ai`, dana cair = `ink`, ditolak = `beni-soft`.

## Tipografi

- **Geist Sans** untuk semua teks. Judul memakai berat 300 (tipis) dengan tracking rapat, teks biasa 400, label 500.
- **Geist Mono** untuk label kecil berhuruf kapital (`01 / ALUR`), kode pengajuan, nomor cicilan, dan IP di audit log.
- **Mincho** dari sistem (Yu Mincho di Windows, Hiragino Mincho di macOS) untuk aksen kanji. Tidak ada webfont Jepang yang dimuat.

## Aksen Jepang

Kata vertikal (tategaki) di samping judul bagian, satu kata per bagian:

| Bagian | Kanji | Arti |
| --- | --- | --- |
| Alur | 流れ | alur |
| Simulasi | 試算 | hitungan percobaan |
| Produk | 商品 | produk |
| Syarat | 条件 | syarat |
| Tahap alur | 申請 · 審査 · 承認 · 融資 | pengajuan · pemeriksaan · persetujuan · pembiayaan |

Semua kanji bersifat dekoratif (`aria-hidden`), artinya selalu sudah tertulis dalam bahasa Indonesia di dekatnya.

## Komponen

- Semua sudut tajam (radius 0). Bentuk bulat hanya untuk titik status dan penanda timeline.
- Tombol setinggi 48px. Tombol utama hitam dan berubah indigo saat hover, tombol garis terisi hitam saat hover, panah di dalam tombol bergeser ke kanan.
- Judul halaman: label mono, judul tipis 32-44px, lalu garis hitam 1px yang tergambar dari kiri.
- Bayangan hanya untuk modal, toast, dan panel keputusan petugas (bayangan blok 6px agar panel itu paling menonjol).

## Gerak

Semua kurva memakai `ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`), durasi 0,4 sampai 1,4 detik.

| Interaksi | Dipakai di |
| --- | --- |
| Judul naik dari balik mask | Hero landing, login, daftar, 404 |
| Garis 1px tergambar dari kiri | Di bawah judul halaman, bagian alur, form daftar |
| Konten naik pelan saat discroll (`Reveal`) | Bagian landing dan form daftar |
| Sapuan tinta dari kiri saat hover (`ink-wash`) | Menu sidebar, pilihan produk di form pengajuan |
| Garis bawah menyapu dari kiri (`link-sweep`) | Navigasi landing, tautan teks, tombol keluar |
| Garis tab tumbuh dari kiri | Tab status pengajuan, tab produk di simulasi |
| Panel geser dari kanan | Menu di layar HP |

Semua animasi mati saat `prefers-reduced-motion`. Konten yang muncul saat discroll hanya disembunyikan setelah JavaScript berjalan (kelas `motion-ready`), jadi halaman tetap terbaca tanpa JS.

## Yang sengaja tidak dibuat

- Dark mode: identitasnya tinta di atas kertas, dan dark mode tidak dinilai di rubrik LKS.
- Testimoni dan statistik: belum ada data nyata.
- Logo gambar: nama "Modalin" ditulis dengan Geist, ditambah satu kotak kecil indigo.

## Catatan untuk mockup

[docs/mockup/index.html](mockup/index.html) adalah mockup versi pertama dengan gaya shicomp (kertas hangat dan aksen merah). Struktur halamannya masih sama, tapi warna dan tipografinya sudah diganti oleh dokumen ini.
