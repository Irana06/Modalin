# Delivery Gate anti-slop

Pemeriksaan aplikasi Modalin (frontend React) memakai aturan [anti-slop](https://github.com/miqdadbadjuber/anti-slop) mode *during*.
Arah desain: `docs/DESIGN.md`. Dial: ENERGY 2 / RHYTHM 2 / MOTION 1.

## Hard Gate

| Aturan | Hasil | Bukti |
| --- | --- | --- |
| R-02 em dash | PASS | `grep "—"` di `frontend/src`, `backend/app`, `docs/*.md`: 0 hasil |
| R-03 mobile | PASS | `scrollWidth` = 375 pada lebar 375px di 11 halaman; tabel lebar diganti kartu di bawah `xl` |
| R-17 angka | PASS | Semua angka berasal dari API atau seeder. Tidak ada statistik pemasaran |
| R-18 testimoni | PASS | Tidak ada bagian testimoni |
| R-23 aset | PASS | Logo berupa teks "Modalin". Tidak ada foto atau avatar buatan |
| R-24 navigasi | PASS | Navbar landing menggulir ke `#simulasi`, `#alur`, `#syarat` yang memang ada. Menu sidebar hanya halaman yang ada, difilter per role |
| R-25 kontras | PASS | `ink-muted` di atas `paper` 5,2:1, `shu-deep` di atas `shu-soft` 5,2:1, teks putih di atas `shu` 4,6:1, `night-muted` di atas `ink` 7,6:1 |
| R-26 kontrol mati | PASS | Setiap tombol memanggil API atau mengubah state. Lihat klik-uji di bawah |
| R-27 state UI | PASS | Semua daftar memakai `DataState`: skeleton saat memuat, pesan + "Coba lagi" saat error, pesan kosong + "Hapus filter" |
| R-28 FAQ | PASS | Tidak ada FAQ |
| R-32 keyboard | PASS | Modal memakai `<dialog>` (Escape menutup), outline fokus 2px `shu-deep`, menu HP tertutup dengan Escape, pilihan produk berupa radio yang bisa dipilih dengan keyboard |
| R-33 patch script | PASS | Semua fitur ditulis langsung di source |
| R-34 tema | PASS | Hanya satu tema, tidak ada toggle |
| R-35 klik-uji | PASS | Lihat daftar di bawah |
| R-36, R-38 klaim palsu | PASS | Kartu contoh di hero diberi label "Contoh tampilan status" |
| R-37 arah desain | PASS | `docs/DESIGN.md`, diturunkan dari shicomp |

## Purpose-Gate

| Teknik | Alasan |
| --- | --- |
| Motif kawung (R-07) | Motif identitas: batik Jawa untuk produk UMKM lokal. Hanya di 1 band per halaman |
| Bayangan (R-12) | Hanya di elemen yang mengambang di atas konten: kartu contoh hero, modal, toast |
| Ikon (R-04) | Hanya centang dan silang di timeline, untuk status yang tidak boleh hanya bergantung pada warna. Tidak memakai library ikon |
| Badge (R-09) | Hanya status pengajuan, karena status memang data |
| Garis tipis sebelum label hero | Mengikuti gaya shicomp, dan labelnya menambah informasi yang tidak ada di judul |

## Penyimpangan yang disengaja

- **R-21 dark mode tidak dibuat.** Aturannya meminta toggle kalau tidak ada alasan kuat untuk satu tema. Alasan yang dipakai: identitas kertas-tinta dari shicomp, dan dark mode tidak dinilai di rubrik LKS sehingga menambah beban hafalan murid. Ini keputusan pemilik project.

## Klik-uji (R-35)

Dijalankan di browser terhadap API Laravel + MySQL hasil seeder:

- Login kosong: muncul "Email wajib diisi." dan "Password wajib diisi."
- Login verifikator dari akun demo: masuk ke `/app/pengajuan`, tab "Menunggu verifikasi" terpilih
- Kartu pengajuan: membuka detail. "Lolos verifikasi" membuka modal, "Ya" menyimpan, toast muncul, timeline maju ke "Persetujuan manajer"
- Admin "Cairkan dana": jadwal 24 bulan dengan tanggal jatuh tempo muncul. "Tandai lunas": toast "Cicilan ke-1 tercatat lunas."
- Produk, "Tambah produk", "Simpan" kosong: 6 pesan validasi. Escape menutup modal
- Daftar UMKM baru: 9 pesan validasi saat kosong. Setelah diisi: masuk ke beranda dengan pesan "Belum ada pengajuan"
- Ajukan Rp30.000.000 dengan omzet Rp9.000.000: "Melebihi plafon Rp3.000.000." dan pesan error. Rp20.000.000: cicilan Rp1.776.976, terkirim, beranda menampilkan status "Menunggu verifikasi"
- Buka "Ajukan" lagi: tampil "Anda masih punya pengajuan yang berjalan"
- URL tidak dikenal: halaman "Halaman tidak ditemukan"
- Console browser: tidak ada error
