# Silabus Latihan LKS Web Technologies

Untuk 2 murid kelas 10 RPL (1 peserta, 1 cadangan) yang baru mulai belajar PHP, menuju LKS Februari 2027.
Modalin dipakai sebagai **kunci jawaban** di tiap fase, bukan dibaca dari awal sampai akhir.

**Pengajar baru? Baca dulu [Cara Mengajar](silabus/CARA-MENGAJAR.md).** Setiap modul berisi teks penjelasan yang bisa langsung disampaikan, demo dengan output-nya, pertanyaan untuk murid, latihan, dan kunci jawaban.

## Urutan fase

| Fase | Minggu | Materi | Acuan di Modalin | Modul |
| --- | --- | --- | --- | --- |
| 0a. PHP dasar | 1-2 | Variabel, kondisi, perulangan, array, fungsi, class, enum | `Enums/LoanStatus.php`, `Models/LoanApplication.php` | [PHP Dasar](silabus/php-dasar.md) + [Tes](silabus/tes/tes-php-dasar.md) |
| 0b. JavaScript, HTTP, Git | 3 | Method array, `async/await`, status code, Postman, Git + SSH | `frontend/src/lib/format.js`, `frontend/src/lib/api.js` | [JavaScript, HTTP, Git](silabus/js-http-git.md) |
| 1. API dasar | 4-5 | Route, migration, model + relasi, controller CRUD, Form Request, format response | `routes/api.php`, `Support/ApiResponse.php`, `Admin/LoanProductController.php` | Menyusul |
| 2. Login dan role | 6-7 | Sanctum, kolom role, Gate, Policy, handler error, rate limit | `AuthController.php`, `AppServiceProvider.php`, `LoanApplicationPolicy.php` | Menyusul |
| 3. Logika bisnis | 8-9 | UUID, soft delete, alur status, aturan 3x omzet, rumus anuitas, audit log, seeder | `LoanApplication::decide()`, `Installment::schedule()`, `StoreLoanApplicationRequest.php` | Menyusul |
| Cek 1 | 10 | Tulis ulang seluruh backend dari Laravel kosong dalam 4 jam | Seluruh `backend/` | Menyusul |
| 4. React dasar | 11-12 | Komponen, props, state, form, `useEffect`, React Router, Tailwind | `pages/Login.jsx`, `pages/NotFound.jsx` | Menyusul |
| 5. Menyambungkan | 13-14 | axios + interceptor, AuthContext, guard route, layout per role, tabel + cari + filter + pagination | `lib/api.js`, `lib/auth.jsx`, `components/AppLayout.jsx`, `pages/Applications.jsx` | Menyusul |
| 6. Halaman lengkap | 15 | Form + simulasi, modal keputusan, timeline, responsif, animasi | `pages/ApplyLoan.jsx`, `pages/ApplicationDetail.jsx`, `components/ui.jsx` | Menyusul |
| 7. Simulasi lomba | 16-17 | Soal 8 jam dari nol, tema berbeda dengan pola yang sama | Rubrik di [KISI-KISI.md](KISI-KISI.md) | Menyusul |

Mulai pertengahan Oktober, 17 minggu berakhir sekitar pertengahan Februari. Kalau seleksi tingkat kota lebih awal, padatkan fase 4 sampai 6. Backend yang rapi dan teruji di Postman sudah 45% nilai.
