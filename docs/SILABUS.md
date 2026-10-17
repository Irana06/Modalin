# Silabus Latihan LKS Web Technologies

Untuk 2 murid kelas 10 RPL (1 peserta, 1 cadangan), menuju LKS Februari 2027.
Modalin dipakai sebagai **kunci jawaban** di tiap fase, bukan dibaca dari awal sampai akhir.

## Cara mengajar tiap pertemuan

1. **Demo** (pengajar mengetik, murid memperhatikan)
2. **Ketik bersama** (murid mengikuti langkah demi langkah)
3. **Ulang tanpa melihat** (murid menulis ulang sendiri, boleh membuka dokumentasi resmi saja)
4. **Catat waktunya.** Yang dilatih untuk lomba adalah mengingat dan kecepatan.

## Urutan fase

| Fase | Minggu | Materi | Acuan di Modalin | Materi rinci |
| --- | --- | --- | --- | --- |
| 0. Fondasi | 1 | JavaScript modern, HTTP dan JSON, Postman, PHP OOP dasar, Git | `frontend/src/lib/format.js`, `backend/app/Enums/LoanStatus.php` | [Minggu 1](silabus/minggu-01.md) |
| 1. API dasar | 2-4 | Route, migration, model + relasi, controller CRUD, Form Request, format response | `routes/api.php`, `Support/ApiResponse.php`, `Admin/LoanProductController.php` | Menyusul |
| 2. Login dan role | 5-6 | Sanctum, kolom role, Gate, Policy, handler error, rate limit | `AuthController.php`, `AppServiceProvider.php`, `LoanApplicationPolicy.php` | Menyusul |
| 3. Logika bisnis | 7-8 | UUID, soft delete, alur status, aturan 3x omzet, rumus anuitas, audit log, seeder | `LoanApplication::decide()`, `Installment::schedule()`, `StoreLoanApplicationRequest.php` | Menyusul |
| Cek 1 | 9 | Tulis ulang seluruh backend dari Laravel kosong dalam 4 jam | Seluruh `backend/` | Menyusul |
| 4. React dasar | 10-11 | Komponen, props, state, form, `useEffect`, React Router, Tailwind | `pages/Login.jsx`, `pages/NotFound.jsx` | Menyusul |
| 5. Menyambungkan | 12-13 | axios + interceptor, AuthContext, guard route, layout per role, tabel + cari + filter + pagination | `lib/api.js`, `lib/auth.jsx`, `components/AppLayout.jsx`, `pages/Applications.jsx` | Menyusul |
| 6. Halaman lengkap | 14 | Form + simulasi, modal keputusan, timeline, responsif, animasi | `pages/ApplyLoan.jsx`, `pages/ApplicationDetail.jsx`, `components/ui.jsx` | Menyusul |
| 7. Simulasi lomba | 15-16 | Soal 8 jam dari nol, tema berbeda dengan pola yang sama | Rubrik di [KISI-KISI.md](KISI-KISI.md) | Menyusul |

Kalau seleksi tingkat kota jatuh di Desember atau Januari, padatkan fase 4 sampai 6. Backend yang rapi dan teruji di Postman sudah 45% nilai.
