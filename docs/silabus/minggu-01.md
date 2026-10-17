# Minggu 1: Fondasi

**Target minggu ini.** Murid bisa:

1. Mengolah data array dan objek dengan JavaScript modern
2. Menjelaskan request dan response HTTP, lalu mencobanya di Postman
3. Menulis class dan enum PHP sederhana
4. Commit dan push ke GitHub memakai SSH key

**Format:** 3 pertemuan × ±2,5 jam, ditambah tugas rumah ±2 jam.
**Kenapa ini dulu:** semua kode Modalin berdiri di atas 4 hal ini. Murid yang belum lancar `map`, `filter`, dan `async/await` akan tersendat terus di React. Murid yang belum paham status code akan bingung membaca error API.

---

## Persiapan (sebelum pertemuan 1)

Pasang di laptop murid. Daftar ini sama dengan perangkat yang disebut di kisi-kisi:

- [ ] Laragon (PHP 8.2+ dan MySQL)
- [ ] Composer
- [ ] Node.js 20 atau lebih baru
- [ ] Git
- [ ] VS Code
- [ ] Postman
- [ ] Akun GitHub

Cek di terminal. Semua perintah harus menampilkan nomor versi:

```bash
php -v
composer -V
node -v
npm -v
git --version
```

Buat satu folder kerja, misalnya `D:\latihan-lks\minggu-01`. Semua latihan minggu ini disimpan di sana.

---

## Pertemuan 1: JavaScript untuk mengolah data

### Materi (±60 menit)

| Konsep | Contoh singkat |
| --- | --- |
| `const` dan `let` | `const bunga = 12` (tidak berubah), `let sisa = 25000000` (berubah) |
| Template literal | `` `Cicilan ke-${n}` `` |
| Arrow function | `const kali3 = (n) => n * 3` |
| Objek dan array | `{ kode: 'MDL-2026-0001', jumlah: 25000000 }` |
| Destructuring | `const { kode, jumlah } = pengajuan` |
| Spread | `{ ...form, jumlah: 30000000 }` (salin objek, ganti satu field) |
| `map` | ubah setiap item, hasilnya array baru dengan panjang sama |
| `filter` | ambil item yang memenuhi syarat |
| `find` | ambil satu item pertama yang cocok |
| `reduce` | gabungkan semua item jadi satu nilai (total, hitungan) |
| `some` | adakah minimal satu item yang cocok? |
| Format rupiah | `n.toLocaleString('id-ID')` menghasilkan `25.000.000` |

Jalankan file JavaScript dengan `node nama-file.js`.

### Latihan (±75 menit)

Buat file `pengajuan.js` dan salin data ini:

```js
const pengajuan = [
  { kode: 'MDL-2026-0001', usaha: 'Warung Makan Bu Sari', jumlah: 25000000, tenor: 12, status: 'verified' },
  { kode: 'MDL-2026-0002', usaha: 'Kopi Lereng Merapi', jumlah: 75000000, tenor: 24, status: 'submitted' },
  { kode: 'MDL-2026-0003', usaha: 'Batik Tulis Giriloyo', jumlah: 30000000, tenor: 12, status: 'submitted' },
  { kode: 'MDL-2026-0004', usaha: 'Bakpia Ngasem', jumlah: 90000000, tenor: 18, status: 'disbursed' },
  { kode: 'MDL-2026-0005', usaha: 'Laundry Kilat Sleman', jumlah: 60000000, tenor: 24, status: 'rejected' },
]
```

Kerjakan satu per satu, tampilkan hasilnya dengan `console.log`:

1. Buat fungsi `rupiah(n)` yang mengubah `25000000` menjadi `Rp25.000.000`.
2. Buat array berisi kode saja.
3. Ambil pengajuan yang statusnya `submitted`.
4. Cari pengajuan dengan kode `MDL-2026-0004`, lalu tampilkan nama usahanya.
5. Hitung total semua jumlah pinjaman dan tampilkan dalam format rupiah.
6. Cek: adakah pengajuan dengan jumlah di atas Rp80.000.000? (hasilnya `true` atau `false`)
7. Hitung banyaknya pengajuan per status. Hasil yang diharapkan: `{ verified: 1, submitted: 2, disbursed: 1, rejected: 1 }`
8. Tampilkan baris teks untuk pengajuan berstatus `submitted` saja, dengan format: `MDL-2026-0002 · Kopi Lereng Merapi · Rp75.000.000`
9. Ambil `usaha` dan `jumlah` dari pengajuan pertama memakai destructuring.
10. Buat salinan pengajuan pertama dengan `jumlah` diganti menjadi `30000000` memakai spread. Pastikan data aslinya tidak berubah.

**Hubungan ke Modalin:**
- Nomor 1 sama dengan fungsi `rupiah` di `frontend/src/lib/format.js`.
- Nomor 7 sama dengan angka di tab status halaman Pengajuan.
- Nomor 10 adalah cara form React mengubah satu field: `setForm({ ...form, jumlah: v })`.

<details>
<summary>Kunci jawaban pertemuan 1</summary>

```js
const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID')

// 2
console.log(pengajuan.map((p) => p.kode))

// 3
console.log(pengajuan.filter((p) => p.status === 'submitted'))

// 4
console.log(pengajuan.find((p) => p.kode === 'MDL-2026-0004').usaha) // Bakpia Ngasem

// 5
const total = pengajuan.reduce((sum, p) => sum + p.jumlah, 0)
console.log(rupiah(total)) // Rp280.000.000

// 6
console.log(pengajuan.some((p) => p.jumlah > 80000000)) // true

// 7
const perStatus = pengajuan.reduce((acc, p) => ({ ...acc, [p.status]: (acc[p.status] ?? 0) + 1 }), {})
console.log(perStatus)

// 8
pengajuan
  .filter((p) => p.status === 'submitted')
  .map((p) => `${p.kode} · ${p.usaha} · ${rupiah(p.jumlah)}`)
  .forEach((baris) => console.log(baris))

// 9
const { usaha, jumlah } = pengajuan[0]
console.log(usaha, jumlah)

// 10
const salinan = { ...pengajuan[0], jumlah: 30000000 }
console.log(salinan.jumlah, pengajuan[0].jumlah) // 30000000 25000000
```

</details>

---

## Pertemuan 2: HTTP, JSON, Postman, dan `async/await`

### Materi (±50 menit)

**Alur dasar:** browser atau Postman (client) mengirim **request**, lalu server Laravel membalas dengan **response**.

| Bagian request | Contoh |
| --- | --- |
| Method | `GET` ambil data, `POST` kirim data baru, `PUT` ubah data, `DELETE` hapus data |
| URL | `http://127.0.0.1:8000/api/loan-products` |
| Header | `Accept: application/json`, `Authorization: Bearer <token>` |
| Body (JSON) | `{ "email": "umkm@modalin.test", "password": "password" }` |

| Status code | Arti | Kapan muncul di Modalin |
| --- | --- | --- |
| 200 | Berhasil | Ambil data, login benar |
| 201 | Data baru dibuat | Pengajuan terkirim |
| 401 | Belum login atau token salah | `/api/me` tanpa token, password salah |
| 403 | Sudah login, tapi tidak boleh | UMKM membuka menu admin |
| 404 | Data tidak ada | Kode pengajuan salah |
| 422 | Data yang dikirim tidak valid | Form kosong, jumlah melebihi plafon |
| 429 | Terlalu sering | Login salah 6 kali dalam semenit |
| 500 | Server error | Ada bug di backend |

Semua response Modalin berbentuk sama. Bentuk ini juga yang dicari juri untuk bobot 25%:

```json
{ "success": true, "message": "Berhasil masuk.", "data": { "user": {}, "token": "1|abc..." } }
{ "success": false, "message": "Data yang dikirim belum valid.", "errors": { "amount": ["Jumlah pinjaman wajib diisi."] } }
```

### Menyiapkan API Modalin (±20 menit)

Pilih salah satu:

- **Opsi A, jalankan sendiri** (sekalian latihan): ikuti bagian "Menjalankan di komputer sendiri" di [README](../../README.md), cukup bagian backend.
- **Opsi B, pakai laptop pengajar:** pengajar menjalankan `php artisan serve --host=0.0.0.0`, lalu murid memakai alamat IP laptop pengajar sebagai pengganti `127.0.0.1`.

Impor [koleksi Postman Modalin](../modalin.postman_collection.json) ke Postman.

### Latihan Postman (±30 menit)

Kerjakan lalu isi kolom "Status yang didapat". Untuk request yang butuh token, salin token dari response login ke tab **Authorization → Bearer Token**.

| No | Request | Status yang diharapkan | Status yang didapat |
| --- | --- | --- | --- |
| 1 | `GET /api/loan-products` | 200, `data` berisi 3 produk | |
| 2 | `POST /api/login` dengan password `salah` | 401 | |
| 3 | `POST /api/login` dengan `umkm@modalin.test` / `password` | 200, ada `data.token` | |
| 4 | `GET /api/me` tanpa token | 401 | |
| 5 | `GET /api/me` dengan token dari nomor 3 | 200 | |
| 6 | `POST /api/loan-applications` dengan body `{}` dan token UMKM | 422, lihat isi `errors` | |
| 7 | `GET /api/admin/users` dengan token UMKM | 403 | |
| 8 | `GET /api/loan-applications/abc` dengan token UMKM | 404 | |
| 9 | Ulangi nomor 2 sebanyak 6 kali dengan cepat | 429 | |

Diskusikan: apa beda 401 dan 403? Kenapa nomor 6 mengembalikan pesan per field?

### `async/await` dan `fetch` (±40 menit)

Request yang tadi dikirim lewat Postman juga bisa dikirim dari kode. Buat file `api.mjs` (akhiran `.mjs` supaya `await` boleh dipakai langsung di file):

```js
const API = 'http://127.0.0.1:8000/api'
const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID')

const res = await fetch(`${API}/loan-products`, { headers: { Accept: 'application/json' } })
const body = await res.json()
console.log(res.status, body.message)
```

Jalankan dengan `node api.mjs`, lalu kerjakan:

1. Tampilkan setiap produk dengan format `Modal Kerja Mikro: Rp5.000.000 s.d. Rp50.000.000`.
2. Bungkus kode dengan `try/catch`. Matikan server Laravel, lalu pastikan yang tampil adalah pesan `Gagal terhubung ke server`, bukan error merah.
3. Login dengan `fetch` (method `POST`, body JSON), ambil token, lalu panggil `/api/me` dan tampilkan nama usaha milik user.

**Hubungan ke Modalin:** `frontend/src/lib/api.js` melakukan hal yang sama dengan axios. Token disimpan, lalu dikirim otomatis di header `Authorization` setiap request.

<details>
<summary>Kunci jawaban pertemuan 2</summary>

```js
const API = 'http://127.0.0.1:8000/api'
const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID')
const headers = { Accept: 'application/json', 'Content-Type': 'application/json' }

try {
  // 1
  const produk = await fetch(`${API}/loan-products`, { headers }).then((r) => r.json())
  produk.data.forEach((p) => console.log(`${p.name}: ${rupiah(p.min_amount)} s.d. ${rupiah(p.max_amount)}`))

  // 3
  const login = await fetch(`${API}/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: 'umkm@modalin.test', password: 'password' }),
  }).then((r) => r.json())

  const me = await fetch(`${API}/me`, {
    headers: { ...headers, Authorization: `Bearer ${login.data.token}` },
  }).then((r) => r.json())
  console.log(me.data.business.name) // Warung Makan Bu Sari
} catch (error) {
  // 2
  console.log('Gagal terhubung ke server')
}
```

</details>

---

## Pertemuan 3: PHP OOP dasar dan Git

### Materi PHP (±45 menit)

| Konsep | Contoh |
| --- | --- |
| Variabel dan array asosiatif | `$p = ['kode' => 'MDL-2026-0001', 'jumlah' => 25000000];` |
| `foreach` | `foreach ($pengajuan as $p) { ... }` |
| Fungsi dengan tipe | `function rupiah(int $n): string { ... }` |
| Class + constructor property promotion | `public function __construct(public string $nama) {}` |
| Method dan `$this` | `return $this->omzet * 3;` |
| Static method | `Usaha::dariArray($data)` dipanggil tanpa `new` |
| Enum (PHP 8.1) | `enum Status: string { case Submitted = 'submitted'; }` |
| `match` | seperti `switch`, tapi langsung mengembalikan nilai |

Jalankan file PHP dengan `php nama-file.php`.

### Latihan PHP (±60 menit)

Buat file `pengajuan.php`:

1. Buat fungsi `rupiah(int $n): string` dengan `number_format($n, 0, ',', '.')`.
2. Buat enum `Status` dengan 4 case (`submitted`, `verified`, `disbursed`, `rejected`) dan method `label()` yang memakai `match`:

   | Case | Label |
   | --- | --- |
   | `submitted` | Menunggu verifikasi |
   | `verified` | Menunggu persetujuan |
   | `disbursed` | Dana cair |
   | `rejected` | Ditolak |

3. Buat class `Usaha` dengan properti `nama` dan `omzet`, plus method `plafon()` yang mengembalikan `omzet × 3`.
4. Buat class `Produk` dengan properti `nama`, `min`, dan `max`, plus method `bolehDiajukan(int $jumlah): bool`.
5. Salin data pengajuan dari pertemuan 1 menjadi array asosiatif PHP. Tampilkan setiap baris dengan format `MDL-2026-0001 - Warung Makan Bu Sari - Rp25.000.000 - Menunggu persetujuan`. Labelnya diambil dari `Status::from($p['status'])->label()`.
6. Hitung total jumlah pinjaman dengan `array_sum(array_column($pengajuan, 'jumlah'))`.
7. Uji: usaha dengan omzet Rp12.000.000 mengajukan Rp40.000.000 untuk produk Rp5 juta s.d. Rp50 juta. Apakah lolos batas produk? Apakah lolos plafon?

**Hubungan ke Modalin:**
- Nomor 2 adalah versi kecil dari `backend/app/Enums/LoanStatus.php`.
- Nomor 3 dan 7 adalah aturan 3x omzet di `StoreLoanApplicationRequest.php`.

<details>
<summary>Kunci jawaban PHP</summary>

```php
<?php

function rupiah(int $n): string
{
    return 'Rp' . number_format($n, 0, ',', '.');
}

enum Status: string
{
    case Submitted = 'submitted';
    case Verified = 'verified';
    case Disbursed = 'disbursed';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Submitted => 'Menunggu verifikasi',
            self::Verified => 'Menunggu persetujuan',
            self::Disbursed => 'Dana cair',
            self::Rejected => 'Ditolak',
        };
    }
}

class Usaha
{
    public function __construct(public string $nama, public int $omzet) {}

    public function plafon(): int
    {
        return $this->omzet * 3;
    }
}

class Produk
{
    public function __construct(public string $nama, public int $min, public int $max) {}

    public function bolehDiajukan(int $jumlah): bool
    {
        return $jumlah >= $this->min && $jumlah <= $this->max;
    }
}

$pengajuan = [
    ['kode' => 'MDL-2026-0001', 'usaha' => 'Warung Makan Bu Sari', 'jumlah' => 25000000, 'status' => 'verified'],
    ['kode' => 'MDL-2026-0002', 'usaha' => 'Kopi Lereng Merapi', 'jumlah' => 75000000, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0003', 'usaha' => 'Batik Tulis Giriloyo', 'jumlah' => 30000000, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0004', 'usaha' => 'Bakpia Ngasem', 'jumlah' => 90000000, 'status' => 'disbursed'],
    ['kode' => 'MDL-2026-0005', 'usaha' => 'Laundry Kilat Sleman', 'jumlah' => 60000000, 'status' => 'rejected'],
];

// 5
foreach ($pengajuan as $p) {
    echo "{$p['kode']} - {$p['usaha']} - " . rupiah($p['jumlah']) . ' - ' . Status::from($p['status'])->label() . PHP_EOL;
}

// 6
echo rupiah(array_sum(array_column($pengajuan, 'jumlah'))) . PHP_EOL; // Rp280.000.000

// 7
$usaha = new Usaha('Warung Makan Bu Sari', 12000000);
$produk = new Produk('Modal Kerja Mikro', 5000000, 50000000);
var_dump($produk->bolehDiajukan(40000000)); // true: masih dalam batas produk
var_dump(40000000 <= $usaha->plafon());     // false: plafonnya hanya Rp36.000.000
```

</details>

### Materi dan latihan Git (±45 menit)

Langkah SSH key ini sama dengan yang diminta di kisi-kisi (bagian F). Kerjakan sekali di laptop murid.

```bash
ssh-keygen -t ed25519 -C "email_github_murid@contoh.com"
cat ~/.ssh/id_ed25519.pub
```

Salin isi public key ke GitHub, di menu **Settings → SSH and GPG keys → New SSH key**. Lalu uji koneksinya:

```bash
ssh -T git@github.com
```

Buat repository kosong `latihan-lks` di GitHub, lalu dari folder `minggu-01`:

```bash
git init -b main
git add .
git commit -m "Latihan minggu 1: JavaScript, PHP, fetch"
git remote add origin git@github.com:USERNAME/latihan-lks.git
git push -u origin main
```

Latihan: ubah satu file, lalu ulangi `add`, `commit`, dan `push` tanpa melihat catatan. Biasakan pesan commit yang menjelaskan isi perubahan.

---

## Tugas rumah (±2 jam)

1. Kerjakan ulang latihan pertemuan 1 dari file kosong tanpa melihat kunci, target **20 menit**. Catat waktunya.
2. Tulis fungsi yang sama dalam dua bahasa, lalu bandingkan:
   - `plafon(omzet)` di JavaScript dan PHP
   - `statusLabel(status)` di JavaScript (pakai objek) dan PHP (pakai enum)
3. Push semua hasilnya ke repository `latihan-lks`.

---

## Cek akhir minggu (45 menit, tanpa catatan, dokumentasi resmi boleh)

| Bagian | Waktu | Tugas | Lulus jika |
| --- | --- | --- | --- |
| JavaScript | 10 menit | Dari data pengajuan baru yang diberikan pengajar: total rupiah, jumlah per status, dan daftar yang statusnya `submitted` | Ketiganya benar |
| Postman | 10 menit | Login, panggil `/api/me` dengan token, lalu tunjukkan contoh 401, 403, dan 422 | Bisa menjelaskan setiap status code |
| PHP | 15 menit | Enum status + `label()`, class `Usaha` dengan `plafon()` | Jalan tanpa error, hasil benar |
| Git | 5 menit | Commit dan push hasil cek ini | Muncul di GitHub |

Kalau belum lulus, ulangi bagian itu di awal minggu 2 sebelum masuk Laravel.

---

## Catatan untuk pengajar

Kesalahan yang paling sering muncul minggu ini:

- **Arrow function dengan kurung kurawal lupa `return`.** `(p) => { p.kode }` menghasilkan `undefined`. Tulis `(p) => p.kode`, atau tambahkan `return`.
- **Memakai `map` untuk menyaring.** `map` selalu mengembalikan array dengan panjang yang sama. Untuk menyaring, pakai `filter`.
- **`==` dan `===`.** Biasakan `===` dari awal.
- **Lupa `await`.** Hasilnya `Promise { <pending> }`, bukan data.
- **Lupa spasi setelah `Bearer`.** Hasilnya 401 walaupun tokennya benar.
- **PHP lupa `$` atau `;`**, atau menulis `$this.omzet`. Di PHP pemanggilnya `$this->omzet`.
- **Push ditolak karena SSH key belum ditambahkan ke GitHub.** Cek dengan `ssh -T git@github.com`.

Catat waktu pengerjaan tugas rumah nomor 1 setiap minggu. Kalau angkanya turun, latihannya berhasil.
