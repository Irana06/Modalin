# Modalin

Platform pengajuan pembiayaan UMKM: pelaku usaha mengajukan pinjaman, lalu pengajuan diperiksa verifikator, diputuskan manajer, dan dicairkan admin.
Dibuat sebagai project referensi latihan **LKS SMK Web Technologies** (soal "Digital Pembiayaan UMKM Nasional", DIY 2026).

| Folder | Isi |
| --- | --- |
| `backend/` | Laravel 12 REST API, MySQL, Sanctum |
| `frontend/` | React 19 SPA, Vite, Tailwind CSS 4, React Router |
| `docs/` | Analisis kisi-kisi, ERD, arah desain, mockup, koleksi Postman |

## Menjalankan di komputer sendiri

Butuh PHP 8.2+, Composer, Node.js 20+, dan MySQL (Laragon atau XAMPP).

```bash
# 1. Backend (buat dulu database kosong bernama "modalin")
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# 2. Frontend (terminal lain)
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. Vite meneruskan `/api` ke `http://127.0.0.1:8000`, jadi tidak perlu mengatur CORS.

### Akun demo

Password semua akun: `password`

| Email | Peran |
| --- | --- |
| `umkm@modalin.test` | Pelaku usaha (punya pengajuan menunggu persetujuan) |
| `verifikator@modalin.test` | Verifikator |
| `manajer@modalin.test` | Manajer |
| `admin@modalin.test` | Admin |

### Tes

```bash
cd backend
php artisan test
```

Tes mencakup rumus cicilan, aturan plafon 3x omzet, alur approval tiga tahap, akses antar pengguna, dan rate limit login.

## Alur status

```
submitted ──verifikator──▶ verified ──manajer──▶ approved ──admin──▶ disbursed
     └─────────────┴──────────────────┴───────▶ rejected (wajib ada catatan)
```

Jadwal cicilan (anuitas) dibuat otomatis saat dana dicairkan. Rumusnya ada di `Installment::schedule()` dan disalin ke `frontend/src/lib/format.js` untuk simulator.

## Endpoint API

Semua response berbentuk `{ success, message, data }` atau `{ success, message, errors }`.

| Method | URL | Akses |
| --- | --- | --- |
| POST | `/api/register` | Publik, 5x/menit |
| POST | `/api/login` | Publik, 5x/menit per email |
| GET | `/api/loan-products` | Publik |
| POST | `/api/logout`, GET `/api/me` | Login |
| GET | `/api/loan-applications?status=&search=&loan_product_id=&page=` | Login (UMKM hanya miliknya) |
| POST | `/api/loan-applications` | UMKM, 5x/menit |
| GET | `/api/loan-applications/{id}` | Pemilik atau petugas |
| POST | `/api/loan-applications/{id}/decision` | Peran sesuai tahap |
| GET, POST, PUT, DELETE | `/api/admin/loan-products` | Admin |
| GET, POST, PUT, DELETE | `/api/admin/users` | Admin |
| GET | `/api/admin/audit-logs?action=` | Admin |
| POST | `/api/admin/installments/{id}/pay` | Admin |

Koleksi Postman: [docs/modalin.postman_collection.json](docs/modalin.postman_collection.json).

## Dokumen

- [Silabus latihan](docs/SILABUS.md): urutan 17 minggu dengan panduan mengajar, dimulai dari [PHP Dasar](docs/silabus/php-dasar.md)
- [Analisis kisi-kisi](docs/KISI-KISI.md): pemetaan rubrik ke kode dan saran pembagian waktu 8 jam
- [ERD](docs/ERD.md)
- [Arah desain](docs/DESIGN.md)
- [Mockup UI](docs/mockup/index.html)
