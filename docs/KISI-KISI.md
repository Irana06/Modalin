# Analisis Kisi-kisi LKS Web Technologies DIY 2026

Sumber: *Petunjuk Teknis & Kisi-kisi LKS SMK Tingkat Provinsi DIY 2026, Bidang Web Technologies*.
Dokumen ini memetakan setiap tuntutan kisi-kisi ke bagian Modalin yang memenuhinya.

## Inti soal

Membangun **"Digital Pembiayaan UMKM Nasional"**: pelaku usaha mengajukan pembiayaan secara daring, lalu pengajuan disetujui bertingkat.
Bentuknya **REST API (backend)** ditambah **Single Page Application (frontend)**, dikerjakan sendiri dalam **8 jam selama 2 hari**.

Empat kata kunci dari pendahuluan, dan keempatnya muncul lagi di rubrik:
1. Manajemen basis data
2. Alur persetujuan bertingkat (*approval flow*)
3. Perhitungan finansial (amortisasi)
4. Keamanan berbasis RBAC

## Rubrik, diurutkan dari bobot terbesar

| Bobot | Aspek | Yang dicari juri | Di Modalin |
| --- | --- | --- | --- |
| **25%** | REST API | Endpoint lengkap dan berfungsi, JSON seragam `success`, `message`, `data` / `errors` | Semua response lewat `ApiResponse` dan satu handler exception di `bootstrap/app.php`, jadi error 401/403/404/422/429/500 pun berformat sama |
| **20%** | Business logic | Approval flow, aturan 3x omzet, cicilan akurat | `LoanApplication::decide()` untuk perpindahan status, `StoreLoanApplicationRequest` untuk plafon, `Installment::schedule()` untuk anuitas, dan tes PHPUnit untuk ketiganya |
| **20%** | Frontend SPA | Route dan sidebar dinamis per role, loading state, error global, validasi UI | Menu dari satu daftar per role, `RequireRole` untuk proteksi route, interceptor axios untuk error global, validasi sebelum kirim |
| **15%** | Database | ERD tepat, UUID, soft delete, audit log | `docs/ERD.md`, `HasUuids` di semua model, `SoftDeletes` di 4 tabel master, tabel `audit_logs` |
| **15%** | Security | Policy/Gate, Sanctum, Form Request, rate limiting | `LoanApplicationPolicy` + Gate `admin`, token Sanctum, Form Request di setiap input, throttle di login, register, dan pengajuan |
| **5%** | Clean code | Penamaan jelas, logika terpisah sesuai MVC | Controller tipis, aturan bisnis di model dan Form Request |

**Strategi:** REST API dan logika bisnis sudah 45%. Kalau waktu mepet, backend yang rapi dan teruji di Postman lebih bernilai daripada tampilan yang cantik tapi datanya belum tersambung.

## Kemampuan desain (bagian D.1)

| Tuntutan | Di Modalin |
| --- | --- |
| Tata warna harmonis, cocok untuk finansial/UMKM | Palet kertas-tinta + satu aksen merah, lihat `docs/DESIGN.md` |
| Layout proporsional | Sidebar + konten untuk aplikasi, landing dengan alur cerita produk |
| Animasi fungsional, tidak berlebihan | Spinner di tombol, skeleton saat memuat, fade saat pindah halaman, hover |
| Optimasi aset | Tidak ada gambar besar. Font di-*self-host* lewat `@fontsource` (hanya subset latin yang terunduh) |
| Rapi, konsisten, responsif | Komponen kecil yang dipakai ulang, dicek di lebar 375px |

## Kemampuan programming (bagian D.2)

| Tuntutan | Di Modalin |
| --- | --- |
| Validasi client dan server, error handling | Validasi di form React, Form Request di Laravel, pesan 422 ditampilkan per field |
| Data table: pagination, pencarian, filter, format mata uang | Daftar pengajuan, produk, pengguna, audit log. Format `Rp25.000.000` |
| ERD, UUID, migration | 7 tabel + `personal_access_tokens` (diubah ke `uuidMorphs`) |
| CRUD, approval bertingkat, auth dan otorisasi, rumus cicilan | CRUD produk dan pengguna (admin), CRUD pengajuan (UMKM), approval 3 tahap |

## Aturan yang memengaruhi cara belajar

- **Mulai dari instalasi framework kosong.** Template dan boilerplate dilarang, jadi murid harus hafal struktur dasarnya.
- **Internet hanya untuk `composer install`, `npm install`, dan dokumentasi resmi.** AI, StackOverflow, dan repo GitHub orang lain dilarang. Karena itu Modalin memakai library sesedikit mungkin: hanya `react-router`, `axios`, Tailwind, dan font.
- **Akun GitHub + SSH key wajib disiapkan sebelum lomba.** Latih alur `git add`, `commit`, `push` sampai lancar.
- **Simpan di folder yang ditentukan panitia** (contoh `D:/XX_ADVANCED_LKS2026`). Tidak ada perpanjangan waktu untuk commit atau export database.
- **Postman/Insomnia disebut di daftar perangkat**, jadi kemungkinan juri menguji API langsung. Modalin menyertakan koleksi Postman di `docs/`.

## Hal yang ambigu (tanyakan saat technical meeting)

1. **"3x omzet"**: omzet bulanan atau tahunan? Modalin memakai bulanan, disimpan di satu konstanta `LoanApplication::MAX_REVENUE_MULTIPLIER`.
2. **Jumlah tahap approval dan nama role.** Modalin memakai verifikator, manajer, lalu admin untuk pencairan.
3. **Metode bunga**: anuitas atau flat? Kata "amortisasi" mengarah ke anuitas, dan itu yang dipakai.
4. **Boleh pakai library UI** (misalnya shadcn) **atau starter kit** (Breeze)? Modalin tidak memakai keduanya.

## Pembagian waktu yang disarankan (8 jam)

| Hari | Jam | Target |
| --- | --- | --- |
| 1 | 1 | Migration, model, relasi, seeder |
| 1 | 2 | Auth Sanctum, format response, handler error |
| 1 | 3 | Endpoint pengajuan + Form Request + aturan plafon + approval + cicilan |
| 1 | 4 | Policy/Gate, audit log, rate limit, cek semua endpoint di Postman |
| 2 | 1 | Setup React, axios + interceptor, login, layout + sidebar per role |
| 2 | 2 | Daftar pengajuan (tabel, cari, filter, pagination) + detail + tombol keputusan |
| 2 | 3 | Form pengajuan + simulasi cicilan + halaman admin |
| 2 | 4 | Landing page, responsif, rapikan, commit terakhir |
