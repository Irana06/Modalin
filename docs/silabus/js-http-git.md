# Minggu 3: JavaScript, HTTP, dan Git

Dikerjakan setelah murid lulus [Tes PHP Dasar](tes/tes-php-dasar.md).

**Target minggu ini.** Murid bisa:

1. Mengolah data array dan objek dengan JavaScript modern
2. Menjelaskan request dan response HTTP, lalu mencobanya di Postman
3. Commit dan push ke GitHub memakai SSH key

**Format:** 3 pertemuan × ±2,5 jam, ditambah tugas rumah ±2 jam.
**Kenapa ini sebelum Laravel:** murid yang belum lancar `map`, `filter`, dan `async/await` akan tersendat terus di React. Murid yang belum paham status code akan bingung membaca error API.

Banyak latihan di sini sengaja sama dengan latihan PHP pertemuan 3 (data pengajuan yang sama). Murid jadi bisa fokus ke cara menulisnya di JavaScript, karena logikanya sudah mereka kenal.

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

Buat satu folder kerja, misalnya `D:\latihan-lks\js`. Semua latihan minggu ini disimpan di sana.

---

## Pertemuan 1: JavaScript untuk mengolah data

### Materi (±60 menit)

> **Jelaskan:** "JavaScript mirip PHP yang sudah kita pelajari, dengan beberapa perbedaan. Variabel tidak memakai tanda dolar. Penggabung teks memakai tanda plus atau template literal dengan backtick. Array dan objek JavaScript sama seperti array berindeks dan array asosiatif di PHP. Bedanya, JavaScript punya method array yang sangat sering dipakai di React: `map`, `filter`, `find`, dan `reduce`."

> **Jelaskan dengan analogi** (tulis di papan):
> - "`map`: setiap barang di keranjang diberi label harga. Jumlah barang tetap, isinya berubah."
> - "`filter`: dari keranjang, ambil yang harganya di atas Rp10.000 saja. Jumlahnya bisa berkurang."
> - "`find`: cari satu barang bernama 'Kopi'. Hasilnya satu barang, bukan keranjang."
> - "`reduce`: hitung total harga semua barang. Hasilnya satu angka."

| PHP | JavaScript |
| --- | --- |
| `$nama = 'Sari';` | `const nama = 'Sari'` |
| `"Halo, $nama"` | `` `Halo, ${nama}` `` |
| `fn ($p) => $p['kode']` | `(p) => p.kode` |
| `array_map(fn ..., $a)` | `a.map(...)` |
| `array_filter($a, fn ...)` | `a.filter(...)` |
| `array_sum(array_column($a, 'jumlah'))` | `a.reduce((sum, p) => sum + p.jumlah, 0)` |
| `count($a)` | `a.length` |

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

> **Jelaskan dengan analogi warung:** "Bayangkan kamu memesan di warung. Kamu adalah **client**, dapur adalah **server**.
> - **Method** adalah jenis permintaanmu: minta lihat menu (`GET`), pesan makanan baru (`POST`), ganti pesanan (`PUT`), batalkan pesanan (`DELETE`).
> - **URL** adalah meja atau bagian yang kamu tuju.
> - **Header** adalah catatan tambahan, misalnya 'saya member, ini kartunya'. Kartu member itulah **token**.
> - **Body** adalah isi pesananmu.
> - **Status code** adalah jawaban pelayan: 200 'siap', 201 'pesanan dicatat', 401 'tunjukkan kartu member dulu', 403 'menu ini khusus karyawan', 404 'menu itu tidak ada', 422 'pesananmu tidak lengkap', 429 'sabar, kamu pesan terlalu sering', 500 'dapur sedang bermasalah'."

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

> **Jelaskan:** "Meminta data ke server butuh waktu, seperti menunggu pesanan matang. `await` artinya tunggu sampai jawabannya datang, baru lanjut ke baris berikutnya. Fungsi yang di dalamnya memakai `await` harus ditandai `async`. Kalau server mati, request gagal. Kegagalan itu kita tangkap dengan `try/catch` supaya program tidak berhenti dengan error merah."

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

## Pertemuan 3: Git, GitHub, dan cek akhir minggu

> **Jelaskan:** "Git itu seperti fitur *save point* di game. Setiap `commit` menyimpan kondisi kode saat itu, lengkap dengan pesan apa yang berubah. Kalau nanti ada yang rusak, kita bisa melihat atau kembali ke save point sebelumnya. GitHub adalah tempat menyimpan save point itu secara online. Saat lomba, hasil kerja wajib di-push ke GitHub, jadi alur ini harus lancar tanpa berpikir."

### Langkah Git (±60 menit)

Langkah SSH key ini sama dengan yang diminta di kisi-kisi (bagian F). Kerjakan sekali di laptop murid.

```bash
ssh-keygen -t ed25519 -C "email_github_murid@contoh.com"
cat ~/.ssh/id_ed25519.pub
```

Salin isi public key ke GitHub, di menu **Settings → SSH and GPG keys → New SSH key**. Lalu uji koneksinya:

```bash
ssh -T git@github.com
```

Buat repository kosong `latihan-lks` di GitHub, lalu dari folder `js`:

```bash
git init -b main
git add .
git commit -m "Latihan JavaScript dan fetch"
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

## Cek akhir minggu (30 menit, tanpa catatan, dokumentasi resmi boleh)

| Bagian | Waktu | Tugas | Lulus jika |
| --- | --- | --- | --- |
| JavaScript | 10 menit | Dari data pengajuan baru yang diberikan pengajar: total rupiah, jumlah per status, dan daftar yang statusnya `submitted` | Ketiganya benar |
| Postman | 10 menit | Login, panggil `/api/me` dengan token, lalu tunjukkan contoh 401, 403, dan 422 | Bisa menjelaskan setiap status code |
| Git | 5 menit | Commit dan push hasil cek ini | Muncul di GitHub |

Kalau belum lulus, ulangi bagian itu di awal minggu berikutnya sebelum masuk Laravel.

---

## Catatan untuk pengajar

Kesalahan yang paling sering muncul minggu ini:

- **Arrow function dengan kurung kurawal lupa `return`.** `(p) => { p.kode }` menghasilkan `undefined`. Tulis `(p) => p.kode`, atau tambahkan `return`.
- **Memakai `map` untuk menyaring.** `map` selalu mengembalikan array dengan panjang yang sama. Untuk menyaring, pakai `filter`.
- **`==` dan `===`.** Biasakan `===` dari awal.
- **Lupa `await`.** Hasilnya `Promise { <pending> }`, bukan data.
- **Lupa spasi setelah `Bearer`.** Hasilnya 401 walaupun tokennya benar.
- **Kebiasaan PHP terbawa ke JavaScript:** menulis `$` di depan variabel, atau memakai titik untuk menggabung teks.
- **Push ditolak karena SSH key belum ditambahkan ke GitHub.** Cek dengan `ssh -T git@github.com`.

Catat waktu pengerjaan tugas rumah nomor 1 setiap minggu. Kalau angkanya turun, latihannya berhasil.
