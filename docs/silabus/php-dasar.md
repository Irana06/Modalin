# Modul PHP Dasar (Minggu 1-2)

Untuk murid yang baru mulai belajar PHP. Terdiri dari 4 pertemuan, lalu ditutup dengan [Tes PHP Dasar](tes/tes-php-dasar.md).
Semua contoh memakai tema UMKM supaya nyambung dengan soal lomba.

| Pertemuan | Materi | Setelah pertemuan ini murid bisa |
| --- | --- | --- |
| 1 | Variabel, tipe data, string, operator | Menyimpan data usaha dan menghitung total serta plafon |
| 2 | Kondisi dan perulangan | Menentukan kategori usaha dan membuat jadwal cicilan |
| 3 | Array dan fungsi | Mengolah daftar pengajuan dan membuat fungsi yang bisa dipakai ulang |
| 4 | OOP dasar: class, object, enum | Membaca dan menulis class seperti model di Laravel |

**Cara menjalankan semua contoh:** simpan sebagai file `.php`, lalu di terminal jalankan `php nama-file.php`.
Baca [CARA-MENGAJAR.md](CARA-MENGAJAR.md) dulu kalau ini pertama kalinya kamu mengajar.

---

## Pertemuan 1: Variabel, tipe data, string, operator

### Persiapan

Buat folder `D:\latihan-lks\php` di laptopmu dan di laptop murid. Pastikan `php -v` jalan di terminal.

### 1.1 File PHP pertama (10 menit)

> **Jelaskan:** "PHP adalah bahasa yang dijalankan di server. Nanti Laravel, framework yang kita pakai untuk lomba, ditulis dengan PHP. Setiap file PHP diawali `<?php`. Perintah `echo` artinya tampilkan ke layar. Setiap perintah diakhiri titik koma, mirip titik di akhir kalimat."

**Demo** (file `halo.php`):

```php
<?php

// Baris yang diawali dua garis miring adalah komentar, tidak dijalankan.
echo 'Halo, UMKM!';
echo PHP_EOL;
echo 'Selamat datang di Modalin.';
```

**Output:**

```text
Halo, UMKM!
Selamat datang di Modalin.
```

> **Jelaskan:** "`PHP_EOL` artinya pindah baris. EOL singkatan dari *end of line*."

**Tanya:** "Apa yang terjadi kalau titik koma di baris `echo` pertama dihapus?" Coba bersama. Jawabannya muncul error `syntax error, unexpected ...`. Tunjukkan bahwa pesan error menyebut nomor baris.

### 1.2 Variabel dan tipe data (20 menit)

> **Jelaskan:** "Variabel itu seperti kotak berlabel untuk menyimpan data. Di PHP, nama variabel selalu diawali tanda dolar. Isinya bisa berbagai jenis. Jenis inilah yang disebut tipe data."

| Tipe | Contoh | Dipakai untuk |
| --- | --- | --- |
| `string` | `'Warung Makan Bu Sari'` | Teks |
| `int` | `12000000` | Bilangan bulat, termasuk uang dalam rupiah |
| `float` | `12.5` | Bilangan desimal, misalnya bunga 12,5% |
| `bool` | `true` / `false` | Ya atau tidak |
| `null` | `null` | Kosong, belum ada isinya |

**Demo** (file `variabel.php`):

```php
<?php

$namaUsaha = 'Warung Makan Bu Sari';
$omzetBulanan = 12000000;
$bunga = 12.5;
$aktif = true;
$catatan = null;

echo $namaUsaha . PHP_EOL;
var_dump($omzetBulanan, $bunga, $aktif, $catatan);
```

**Output:**

```text
Warung Makan Bu Sari
int(12000000)
float(12.5)
bool(true)
NULL
```

> **Jelaskan:** "`var_dump` menampilkan isi variabel sekaligus tipenya. Ini alat paling berguna saat bingung kenapa kode tidak jalan sesuai harapan."

**Tanya:** "Kenapa uang kita simpan sebagai `int`, bukan `float`?" Jawaban: rupiah tidak memakai sen, dan `float` bisa menghasilkan pembulatan aneh. Modalin juga menyimpan uang sebagai bilangan bulat.

### 1.3 String: menggabung teks (15 menit)

> **Jelaskan:** "Ada dua cara menulis teks. Dengan tanda kutip satu, isinya ditampilkan apa adanya. Dengan tanda kutip dua, variabel di dalamnya dibaca. Untuk menggabungkan teks, PHP memakai titik, bukan tanda plus."

**Demo:**

```php
<?php

$namaUsaha = 'Warung Makan Bu Sari';
$kota = 'Sleman';

echo 'Usaha: ' . $namaUsaha . ' di ' . $kota . PHP_EOL;
echo "Usaha: $namaUsaha di $kota" . PHP_EOL;
echo 'Usaha: $namaUsaha' . PHP_EOL;
```

**Output:**

```text
Usaha: Warung Makan Bu Sari di Sleman
Usaha: Warung Makan Bu Sari di Sleman
Usaha: $namaUsaha
```

**Tanya:** "Kenapa baris ketiga menampilkan `$namaUsaha` apa adanya?" Jawaban: karena memakai tanda kutip satu.

### 1.4 Operator hitung (20 menit)

> **Jelaskan:** "Operator hitung sama seperti di matematika: tambah, kurang, kali, bagi. Ada satu yang mungkin baru, yaitu `%` atau modulus, artinya sisa bagi. `17 % 5` hasilnya 2, karena 17 dibagi 5 sisa 2. Lalu `number_format` dipakai untuk menampilkan angka dengan titik ribuan."

| Operator | Arti | Contoh | Hasil |
| --- | --- | --- | --- |
| `+` `-` `*` `/` | Tambah, kurang, kali, bagi | `10 / 4` | `2.5` |
| `%` | Sisa bagi | `17 % 5` | `2` |
| `+=` `-=` `*=` | Ubah nilai variabel itu sendiri | `$x += 5` | `$x` bertambah 5 |
| `.=` | Tambahkan teks ke variabel | `$teks .= '!'` | teks diberi `!` di akhir |

**Demo:**

```php
<?php

$hargaNasi = 15000;
$porsiTerjual = 40;
$omzetBulanan = 12000000;

$totalHariIni = $hargaNasi * $porsiTerjual;
$plafon = $omzetBulanan * 3;

echo 'Penjualan hari ini: Rp' . number_format($totalHariIni, 0, ',', '.') . PHP_EOL;
echo 'Plafon pinjaman: Rp' . number_format($plafon, 0, ',', '.') . PHP_EOL;

$stok = 100;
$stok -= 40;
echo "Sisa stok: $stok porsi" . PHP_EOL;
```

**Output:**

```text
Penjualan hari ini: Rp600.000
Plafon pinjaman: Rp36.000.000
Sisa stok: 60 porsi
```

> **Jelaskan:** "Di `number_format($angka, 0, ',', '.')`, angka 0 artinya tanpa desimal, koma dipakai sebagai pemisah desimal, dan titik sebagai pemisah ribuan. Itulah format rupiah."

### Latihan pertemuan 1 (40 menit)

Buat file `latihan1.php`:

1. Simpan nama usaha, nama pemilik, dan tahun berdiri ke variabel. Tampilkan: `Warung Makan Bu Sari milik Sari Wulandari, berdiri tahun 2019.`
2. Simpan omzet bulanan `12000000`. Hitung dan tampilkan plafon (3 x omzet) dalam format rupiah: `Plafon: Rp36.000.000`
3. Sebuah warung menjual 3 menu hari ini:
   - Nasi goreng Rp15.000, terjual 40 porsi
   - Mie ayam Rp12.000, terjual 25 porsi
   - Es teh Rp4.000, terjual 60 gelas

   Hitung total penjualan hari itu dan tampilkan dalam rupiah.
4. Pinjaman Rp12.000.000 dengan bunga **flat** 12% per tahun selama 12 bulan. Hitung total bunga, total yang harus dibayar, dan cicilan per bulan.
   *(Bunga flat artinya bunga dihitung dari jumlah pinjaman awal. Modalin nanti memakai metode anuitas yang lebih rumit; flat dipakai dulu karena lebih mudah.)*
5. **Tantangan:** hitung juga sisa bagi `$porsiTerjual % 12`, lalu jelaskan artinya kalau nasi dikemas per lusin.

<details>
<summary>Kunci latihan 1</summary>

```php
<?php

// 1
$namaUsaha = 'Warung Makan Bu Sari';
$pemilik = 'Sari Wulandari';
$tahunBerdiri = 2019;
echo "$namaUsaha milik $pemilik, berdiri tahun $tahunBerdiri." . PHP_EOL;

// 2
$omzetBulanan = 12000000;
echo 'Plafon: Rp' . number_format($omzetBulanan * 3, 0, ',', '.') . PHP_EOL;

// 3
$total = 15000 * 40 + 12000 * 25 + 4000 * 60;
echo 'Total penjualan: Rp' . number_format($total, 0, ',', '.') . PHP_EOL; // Rp1.140.000

// 4
$pinjaman = 12000000;
$totalBunga = $pinjaman * 12 / 100;      // bunga 12% x 1 tahun
$totalBayar = $pinjaman + $totalBunga;
$cicilan = $totalBayar / 12;
echo 'Total bunga: Rp' . number_format($totalBunga, 0, ',', '.') . PHP_EOL;  // Rp1.440.000
echo 'Total bayar: Rp' . number_format($totalBayar, 0, ',', '.') . PHP_EOL;  // Rp13.440.000
echo 'Cicilan: Rp' . number_format($cicilan, 0, ',', '.') . PHP_EOL;         // Rp1.120.000

// 5
$porsiTerjual = 40;
echo $porsiTerjual % 12 . PHP_EOL; // 4: setelah dikemas 3 lusin, sisa 4 porsi
```

</details>

### Kesalahan umum pertemuan 1

- Lupa tanda `$` di depan nama variabel.
- Memakai `+` untuk menggabung teks. Di PHP penggabung teks adalah `.`
- Menulis angka dengan titik, misalnya `12.000.000`. Di kode, tulis `12000000` (atau `12_000_000`, garis bawah boleh dipakai sebagai pemisah supaya mudah dibaca).

### Penutup

Minta murid menyebutkan: tipe data apa saja yang dipelajari, beda kutip satu dan kutip dua, dan cara menampilkan angka dalam format rupiah.

---

## Pertemuan 2: Kondisi dan perulangan

### Kuis pembuka (5 menit, lisan)

1. Apa beda `'Halo $nama'` dan `"Halo $nama"`? *(kutip satu ditampilkan apa adanya, kutip dua membaca variabel)*
2. Berapa hasil `17 % 5`? *(2)*
3. Operator apa untuk menggabung teks? *(titik)*

### 2.1 Perbandingan dan logika (15 menit)

> **Jelaskan:** "Program sering perlu memutuskan sesuatu: apakah jumlah pinjaman melebihi plafon? Untuk itu kita membandingkan nilai. Hasil perbandingan selalu `true` atau `false`."

| Operator | Arti |
| --- | --- |
| `===` | Sama persis, nilai dan tipenya |
| `==` | Sama nilainya saja (hindari, bisa menipu) |
| `!==` | Tidak sama |
| `>` `<` `>=` `<=` | Lebih besar, lebih kecil, dan seterusnya |
| `&&` | Dan: dua-duanya harus benar |
| `\|\|` | Atau: salah satu benar sudah cukup |
| `!` | Kebalikan |

**Demo:**

```php
<?php

var_dump(5 === 5);
var_dump('5' == 5);
var_dump('5' === 5);

$jumlah = 25000000;
$plafon = 36000000;
var_dump($jumlah <= $plafon && $jumlah >= 5000000);
```

**Output:**

```text
bool(true)
bool(true)
bool(false)
bool(true)
```

> **Jelaskan:** "Perhatikan baris kedua dan ketiga. Teks `'5'` dianggap sama dengan angka `5` kalau memakai dua sama dengan. Ini sering jadi sumber bug, jadi biasakan memakai tiga sama dengan."

### 2.2 `if`, `elseif`, `else` (20 menit)

> **Jelaskan:** "`if` artinya jika. Kode di dalam kurung kurawal hanya dijalankan kalau kondisinya benar. Contoh nyata: menurut PP Nomor 7 Tahun 2021, usaha mikro adalah usaha dengan omzet sampai Rp2 miliar per tahun, usaha kecil sampai Rp15 miliar, dan usaha menengah sampai Rp50 miliar."

**Demo:**

```php
<?php

$omzetTahunan = 1_500_000_000;

if ($omzetTahunan <= 2_000_000_000) {
    $kategori = 'Mikro';
} elseif ($omzetTahunan <= 15_000_000_000) {
    $kategori = 'Kecil';
} elseif ($omzetTahunan <= 50_000_000_000) {
    $kategori = 'Menengah';
} else {
    $kategori = 'Besar';
}

echo "Kategori usaha: $kategori" . PHP_EOL;
```

**Output:**

```text
Kategori usaha: Mikro
```

**Tanya:** "Kalau omzetnya Rp2 miliar tepat, masuk kategori apa?" *(Mikro, karena memakai `<=`)*. Lalu minta murid mengganti angkanya dan menebak hasilnya sebelum dijalankan.

### 2.3 `match`, ternary, dan `??` (15 menit)

> **Jelaskan:** "`match` dipakai kalau satu nilai punya banyak kemungkinan, misalnya kode status. Lebih rapi daripada `if` yang panjang. Ternary `? :` adalah `if` versi satu baris. Lalu `??` artinya: pakai nilai ini, tapi kalau kosong (`null`), pakai nilai cadangan."

**Demo:**

```php
<?php

$status = 'verified';
$label = match ($status) {
    'submitted' => 'Menunggu verifikasi',
    'verified' => 'Menunggu persetujuan',
    'disbursed' => 'Dana cair',
    'rejected' => 'Ditolak',
    default => 'Status tidak dikenal',
};
echo $label . PHP_EOL;

$jumlah = 40000000;
$plafon = 36000000;
echo ($jumlah <= $plafon ? 'Lolos plafon' : 'Melebihi plafon') . PHP_EOL;

$catatan = null;
echo ($catatan ?? 'Belum ada catatan') . PHP_EOL;
```

**Output:**

```text
Menunggu persetujuan
Melebihi plafon
Belum ada catatan
```

> **Jelaskan:** "Daftar status ini persis sama dengan status pengajuan di Modalin. Nanti di Laravel bentuknya menjadi `enum`, yang kita pelajari di pertemuan 4."

### 2.4 Perulangan `for` dan `while` (25 menit)

> **Jelaskan:** "Perulangan dipakai kalau kita ingin mengulang perintah yang sama. `for` cocok kalau jumlah ulangannya sudah diketahui, misalnya 12 bulan cicilan. `while` cocok kalau kita mengulang selama kondisinya masih benar, misalnya selama utang belum lunas."

**Demo:**

```php
<?php

for ($bulan = 1; $bulan <= 3; $bulan++) {
    echo "Cicilan ke-$bulan" . PHP_EOL;
}

$sisaUtang = 12000000;
$bayarPerBulan = 3000000;
$jumlahBulan = 0;

while ($sisaUtang > 0) {
    $sisaUtang -= $bayarPerBulan;
    $jumlahBulan++;
}
echo "Lunas dalam $jumlahBulan bulan" . PHP_EOL;
```

**Output:**

```text
Cicilan ke-1
Cicilan ke-2
Cicilan ke-3
Lunas dalam 4 bulan
```

> **Jelaskan:** "Bagian `for` punya tiga isian: nilai awal `$bulan = 1`, syarat lanjut `$bulan <= 3`, dan perubahan setiap putaran `$bulan++` (artinya tambah 1)."

**Tanya:** "Apa yang terjadi kalau di `while` kita lupa menulis `$sisaUtang -= $bayarPerBulan`?" *(Perulangan tidak pernah berhenti. Tekan Ctrl+C untuk menghentikan program.)*

### Latihan pertemuan 2 (40 menit)

1. Buat program kategori usaha seperti demo 2.2. Uji dengan omzet tahunan Rp800 juta, Rp9 miliar, dan Rp60 miliar.
2. Diberikan `$omzetBulanan = 12000000` dan `$jumlah = 40000000`. Tampilkan `Lolos plafon` kalau jumlahnya tidak melebihi 3 x omzet. Kalau melebihi, tampilkan `Melebihi plafon Rp4.000.000`, lengkap dengan selisihnya.
3. Buat jadwal cicilan flat dari latihan 1 nomor 4 (pinjaman Rp12.000.000, bunga 12%, 12 bulan) memakai `for`. Format setiap baris: `Bulan 1: bayar Rp1.120.000, sisa Rp12.320.000`. Baris terakhir harus menunjukkan sisa Rp0.
4. Pemilik warung menabung Rp750.000 per bulan untuk membeli kompor seharga Rp5.000.000. Pakai `while` untuk menghitung berapa bulan yang dibutuhkan.
5. **Tantangan:** gabungkan nomor 2 dengan syarat produk: jumlah juga harus di antara Rp5.000.000 dan Rp50.000.000. Tampilkan alasan penolakan yang tepat untuk setiap kasus.

<details>
<summary>Kunci latihan 2</summary>

```php
<?php

// 1
foreach ([800_000_000, 9_000_000_000, 60_000_000_000] as $omzetTahunan) {
    if ($omzetTahunan <= 2_000_000_000) {
        $kategori = 'Mikro';
    } elseif ($omzetTahunan <= 15_000_000_000) {
        $kategori = 'Kecil';
    } elseif ($omzetTahunan <= 50_000_000_000) {
        $kategori = 'Menengah';
    } else {
        $kategori = 'Besar';
    }
    echo $kategori . PHP_EOL; // Mikro, Kecil, Besar
}

// 2
$omzetBulanan = 12000000;
$jumlah = 40000000;
$plafon = $omzetBulanan * 3;
if ($jumlah <= $plafon) {
    echo 'Lolos plafon' . PHP_EOL;
} else {
    echo 'Melebihi plafon Rp' . number_format($jumlah - $plafon, 0, ',', '.') . PHP_EOL;
}

// 3
$cicilan = 1120000;
$sisa = 13440000;
for ($bulan = 1; $bulan <= 12; $bulan++) {
    $sisa -= $cicilan;
    echo "Bulan $bulan: bayar Rp" . number_format($cicilan, 0, ',', '.') . ', sisa Rp' . number_format($sisa, 0, ',', '.') . PHP_EOL;
}

// 4
$tabungan = 0;
$bulan = 0;
while ($tabungan < 5000000) {
    $tabungan += 750000;
    $bulan++;
}
echo "Butuh $bulan bulan" . PHP_EOL; // 7 bulan

// 5
$jumlah = 40000000;
if ($jumlah < 5000000 || $jumlah > 50000000) {
    echo 'Ditolak: di luar batas produk' . PHP_EOL;
} elseif ($jumlah > $plafon) {
    echo 'Ditolak: melebihi plafon' . PHP_EOL;
} else {
    echo 'Lolos' . PHP_EOL;
}
```

</details>

### Kesalahan umum pertemuan 2

- Menulis `=` (mengisi nilai) padahal maksudnya `===` (membandingkan) di dalam `if`.
- Lupa kurung kurawal penutup. Biasakan langsung menulis `{ }` berpasangan, baru mengisi bagian tengahnya.
- Lupa koma di akhir baris `match`, atau lupa `default`, sehingga status yang tidak dikenal menimbulkan error.

---

## Pertemuan 3: Array dan fungsi

### Kuis pembuka (5 menit)

1. Apa beda `==` dan `===`? *(`===` juga membandingkan tipe)*
2. Kapan memakai `for`, kapan `while`? *(`for` kalau jumlah ulangan diketahui)*
3. Apa arti `$x ?? 'kosong'`? *(pakai `$x`, kecuali `null`)*

### 3.1 Array berindeks (15 menit)

> **Jelaskan:** "Array adalah satu variabel yang menyimpan banyak nilai sekaligus, seperti daftar menu. Setiap isi punya nomor urut yang disebut indeks, dan **indeks dimulai dari 0**, bukan 1."

**Demo:**

```php
<?php

$menu = ['Nasi Goreng', 'Mie Ayam', 'Es Teh'];

echo $menu[0] . PHP_EOL;
$menu[] = 'Kopi Tubruk';
echo count($menu) . PHP_EOL;

foreach ($menu as $item) {
    echo "- $item" . PHP_EOL;
}
```

**Output:**

```text
Nasi Goreng
4
- Nasi Goreng
- Mie Ayam
- Es Teh
- Kopi Tubruk
```

> **Jelaskan:** "`$menu[] = ...` menambah isi di akhir. `count` menghitung jumlah isi. `foreach` artinya untuk setiap isi di dalam array, jalankan perintah ini."

### 3.2 Array asosiatif dan array bersarang (20 menit)

> **Jelaskan:** "Kadang nomor urut kurang jelas. Lebih enak kalau setiap isi punya nama, misalnya `nama`, `omzet`, `sektor`. Itu namanya array asosiatif. Nah, daftar pengajuan adalah array yang isinya array asosiatif. Bentuk inilah yang nanti dikirim API Laravel sebagai JSON."

**Demo:**

```php
<?php

$usaha = ['nama' => 'Warung Makan Bu Sari', 'sektor' => 'Kuliner', 'omzet' => 12000000];
echo $usaha['nama'] . PHP_EOL;

foreach ($usaha as $kunci => $nilai) {
    echo "$kunci: $nilai" . PHP_EOL;
}

$pengajuan = [
    ['kode' => 'MDL-2026-0001', 'usaha' => 'Warung Makan Bu Sari', 'jumlah' => 25000000, 'status' => 'verified'],
    ['kode' => 'MDL-2026-0002', 'usaha' => 'Kopi Lereng Merapi', 'jumlah' => 75000000, 'status' => 'submitted'],
];
echo $pengajuan[1]['usaha'] . PHP_EOL;
```

**Output:**

```text
Warung Makan Bu Sari
nama: Warung Makan Bu Sari
sektor: Kuliner
omzet: 12000000
Kopi Lereng Merapi
```

**Tanya:** "Bagaimana cara mengambil jumlah pinjaman pengajuan pertama?" *(`$pengajuan[0]['jumlah']`)*

### 3.3 Fungsi bawaan untuk array (15 menit)

| Fungsi | Kegunaan |
| --- | --- |
| `count($a)` | Jumlah isi |
| `in_array($x, $a)` | Apakah `$x` ada di dalam array |
| `array_column($a, 'jumlah')` | Ambil satu kolom dari array bersarang |
| `array_sum($a)` | Jumlahkan semua angka |
| `array_filter($a, fn ($x) => ...)` | Ambil isi yang memenuhi syarat |
| `array_map(fn ($x) => ..., $a)` | Ubah setiap isi |

**Demo:**

```php
<?php

$pengajuan = [
    ['kode' => 'MDL-2026-0001', 'jumlah' => 25000000, 'status' => 'verified'],
    ['kode' => 'MDL-2026-0002', 'jumlah' => 75000000, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0003', 'jumlah' => 30000000, 'status' => 'submitted'],
];

echo array_sum(array_column($pengajuan, 'jumlah')) . PHP_EOL;

$menunggu = array_filter($pengajuan, fn ($p) => $p['status'] === 'submitted');
echo count($menunggu) . PHP_EOL;

$kode = array_map(fn ($p) => $p['kode'], $pengajuan);
echo implode(', ', $kode) . PHP_EOL;
```

**Output:**

```text
130000000
2
MDL-2026-0001, MDL-2026-0002, MDL-2026-0003
```

> **Jelaskan:** "`fn ($p) => ...` adalah fungsi singkat (*arrow function*). Bacanya: untuk setiap `$p`, hasilnya adalah ini. `implode` menggabungkan isi array menjadi satu teks dengan pemisah."

### 3.4 Membuat fungsi sendiri (25 menit)

> **Jelaskan:** "Dari tadi kita menulis `number_format($angka, 0, ',', '.')` berkali-kali. Kalau kode yang sama dipakai berulang, bungkus menjadi fungsi. Fungsi menerima masukan (parameter) dan mengembalikan hasil dengan `return`. Tipe parameter dan tipe hasilnya boleh ditulis, dan sebaiknya memang ditulis, karena PHP akan memberi peringatan kalau tipenya salah."

**Demo:**

```php
<?php

function rupiah(int $angka): string
{
    return 'Rp' . number_format($angka, 0, ',', '.');
}

function plafon(int $omzetBulanan, int $kali = 3): int
{
    return $omzetBulanan * $kali;
}

echo rupiah(25000000) . PHP_EOL;
echo rupiah(plafon(12000000)) . PHP_EOL;
echo rupiah(plafon(12000000, 2)) . PHP_EOL;
```

**Output:**

```text
Rp25.000.000
Rp36.000.000
Rp24.000.000
```

> **Jelaskan:** "Parameter `$kali = 3` punya nilai bawaan. Kalau tidak diisi, nilainya 3. Fungsi `rupiah` ini sama dengan yang dipakai di Modalin, di file `StoreLoanApplicationRequest.php` (versi PHP) dan `frontend/src/lib/format.js` (versi JavaScript)."

### Latihan pertemuan 3 (40 menit)

Salin data ini ke `latihan3.php`:

```php
<?php

$pengajuan = [
    ['kode' => 'MDL-2026-0001', 'usaha' => 'Warung Makan Bu Sari', 'jumlah' => 25000000, 'tenor' => 12, 'status' => 'verified'],
    ['kode' => 'MDL-2026-0002', 'usaha' => 'Kopi Lereng Merapi', 'jumlah' => 75000000, 'tenor' => 24, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0003', 'usaha' => 'Batik Tulis Giriloyo', 'jumlah' => 30000000, 'tenor' => 12, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0004', 'usaha' => 'Bakpia Ngasem', 'jumlah' => 90000000, 'tenor' => 18, 'status' => 'disbursed'],
    ['kode' => 'MDL-2026-0005', 'usaha' => 'Laundry Kilat Sleman', 'jumlah' => 60000000, 'tenor' => 24, 'status' => 'rejected'],
];
```

1. Tampilkan setiap pengajuan dengan format `MDL-2026-0001 | Warung Makan Bu Sari | Rp25.000.000`. Pakai fungsi `rupiah()`.
2. Hitung dan tampilkan total semua pinjaman.
3. Tampilkan hanya pengajuan berstatus `submitted`.
4. Buat fungsi `labelStatus(string $status): string` memakai `match` dari pertemuan 2, lalu tambahkan label ke setiap baris di nomor 1.
5. Hitung banyaknya pengajuan per status. Hasil yang diharapkan:
   `verified: 1`, `submitted: 2`, `disbursed: 1`, `rejected: 1`
6. Buat fungsi `cicilanFlat(int $pinjaman, float $bungaPersenPerTahun, int $tenorBulan): int`. Uji dengan `cicilanFlat(12000000, 12, 12)`, hasilnya harus `1120000`.
7. **Tantangan:** buat fungsi `kategoriUsaha(int $omzetTahunan): string` dari pertemuan 2, lalu uji dengan 3 angka.

<details>
<summary>Kunci latihan 3</summary>

```php
<?php

$pengajuan = [
    ['kode' => 'MDL-2026-0001', 'usaha' => 'Warung Makan Bu Sari', 'jumlah' => 25000000, 'tenor' => 12, 'status' => 'verified'],
    ['kode' => 'MDL-2026-0002', 'usaha' => 'Kopi Lereng Merapi', 'jumlah' => 75000000, 'tenor' => 24, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0003', 'usaha' => 'Batik Tulis Giriloyo', 'jumlah' => 30000000, 'tenor' => 12, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0004', 'usaha' => 'Bakpia Ngasem', 'jumlah' => 90000000, 'tenor' => 18, 'status' => 'disbursed'],
    ['kode' => 'MDL-2026-0005', 'usaha' => 'Laundry Kilat Sleman', 'jumlah' => 60000000, 'tenor' => 24, 'status' => 'rejected'],
];

function rupiah(int $angka): string
{
    return 'Rp' . number_format($angka, 0, ',', '.');
}

function labelStatus(string $status): string
{
    return match ($status) {
        'submitted' => 'Menunggu verifikasi',
        'verified' => 'Menunggu persetujuan',
        'disbursed' => 'Dana cair',
        'rejected' => 'Ditolak',
        default => 'Status tidak dikenal',
    };
}

function cicilanFlat(int $pinjaman, float $bungaPersenPerTahun, int $tenorBulan): int
{
    $totalBunga = $pinjaman * $bungaPersenPerTahun / 100 * $tenorBulan / 12;
    return (int) round(($pinjaman + $totalBunga) / $tenorBulan);
}

// 1 dan 4
foreach ($pengajuan as $p) {
    echo "{$p['kode']} | {$p['usaha']} | " . rupiah($p['jumlah']) . ' | ' . labelStatus($p['status']) . PHP_EOL;
}

// 2
echo 'Total: ' . rupiah(array_sum(array_column($pengajuan, 'jumlah'))) . PHP_EOL; // Rp280.000.000

// 3
foreach (array_filter($pengajuan, fn ($p) => $p['status'] === 'submitted') as $p) {
    echo $p['kode'] . PHP_EOL;
}

// 5
$perStatus = [];
foreach ($pengajuan as $p) {
    $perStatus[$p['status']] = ($perStatus[$p['status']] ?? 0) + 1;
}
foreach ($perStatus as $status => $jumlah) {
    echo "$status: $jumlah" . PHP_EOL;
}

// 6
echo cicilanFlat(12000000, 12, 12) . PHP_EOL; // 1120000
```

</details>

### Kesalahan umum pertemuan 3

- Mengira indeks dimulai dari 1, sehingga `$menu[3]` dianggap isi ketiga.
- Lupa tanda kutip pada kunci: `$usaha[nama]` seharusnya `$usaha['nama']`.
- Lupa `return` di dalam fungsi, sehingga hasilnya `null`.
- `array_filter` mempertahankan indeks lama. Kalau perlu indeks 0, 1, 2 lagi, bungkus dengan `array_values()`.

---

## Pertemuan 4: OOP dasar (class, object, enum)

### Kuis pembuka (5 menit)

1. Indeks array dimulai dari angka berapa? *(0)*
2. Bagaimana mengambil kolom `jumlah` dari semua pengajuan sekaligus? *(`array_column`)*
3. Apa yang terjadi kalau fungsi tidak punya `return`? *(hasilnya `null`)*

### 4.1 Kenapa class? (10 menit)

> **Jelaskan:** "Bayangkan formulir pendaftaran usaha yang masih kosong. Formulir itu menentukan isian apa saja yang ada: nama, omzet, sektor. Itulah **class**, cetakannya. Setiap formulir yang sudah diisi oleh satu usaha disebut **object**. Satu class bisa menghasilkan banyak object.
>
> Kenapa ini penting? Karena di Laravel, setiap tabel database diwakili oleh class yang disebut **model**. Di Modalin ada class `LoanApplication`, `Business`, dan `User`. Kalau paham class, kode Laravel jauh lebih mudah dibaca."

### 4.2 Class, properti, method (25 menit)

**Demo:**

```php
<?php

class Usaha
{
    public string $nama;
    public int $omzetBulanan;

    public function __construct(string $nama, int $omzetBulanan)
    {
        $this->nama = $nama;
        $this->omzetBulanan = $omzetBulanan;
    }

    public function plafon(): int
    {
        return $this->omzetBulanan * 3;
    }
}

$warung = new Usaha('Warung Makan Bu Sari', 12000000);
$kopi = new Usaha('Kopi Lereng Merapi', 30000000);

echo $warung->nama . PHP_EOL;
echo $warung->plafon() . PHP_EOL;
echo $kopi->plafon() . PHP_EOL;
```

**Output:**

```text
Warung Makan Bu Sari
36000000
90000000
```

> **Jelaskan langkah demi langkah:**
> - "**Properti** adalah isian formulir: `$nama` dan `$omzetBulanan`."
> - "**Method** adalah fungsi yang menempel di class, contohnya `plafon()`."
> - "`__construct` dijalankan otomatis saat object dibuat dengan `new`. Gunanya mengisi properti di awal."
> - "`$this` artinya object ini sendiri. `$this->omzetBulanan` berarti omzet milik usaha yang sedang dipakai."
> - "Tanda panah `->` dipakai untuk mengambil properti atau memanggil method dari sebuah object."

**Tanya:** "Kenapa hasil `plafon()` untuk `$warung` dan `$kopi` berbeda, padahal method-nya sama?" *(karena `$this` merujuk ke object masing-masing)*

### 4.3 Versi singkat: constructor property promotion (10 menit)

> **Jelaskan:** "PHP 8 punya cara singkat. Properti boleh langsung ditulis di dalam constructor. Hasilnya sama persis dengan demo tadi, tapi jauh lebih pendek. Cara ini dipakai di banyak kode Laravel modern."

**Demo:**

```php
<?php

class Produk
{
    public function __construct(
        public string $nama,
        public int $min,
        public int $max,
    ) {}

    public function bolehDiajukan(int $jumlah): bool
    {
        return $jumlah >= $this->min && $jumlah <= $this->max;
    }
}

$mikro = new Produk('Modal Kerja Mikro', 5000000, 50000000);
var_dump($mikro->bolehDiajukan(25000000));
var_dump($mikro->bolehDiajukan(75000000));
```

**Output:**

```text
bool(true)
bool(false)
```

### 4.4 Static method (10 menit)

> **Jelaskan:** "Biasanya method dipanggil dari sebuah object, misalnya `$warung->plafon()`. Tapi ada method yang tidak butuh object, cukup dipanggil dari nama class-nya dengan dua titik dua `::`. Itu namanya static method. Di Laravel kamu akan sering melihatnya: `User::create(...)`, `LoanProduct::find(...)`."

**Demo:**

```php
<?php

class Rupiah
{
    public static function format(int $angka): string
    {
        return 'Rp' . number_format($angka, 0, ',', '.');
    }
}

echo Rupiah::format(36000000) . PHP_EOL;
```

**Output:**

```text
Rp36.000.000
```

### 4.5 Enum (20 menit)

> **Jelaskan:** "Status pengajuan hanya boleh salah satu dari daftar tertentu: submitted, verified, disbursed, rejected. Kalau disimpan sebagai teks biasa, bisa saja ada yang salah ketik menjadi `'verifed'` dan tidak ketahuan. **Enum** membatasi pilihannya, dan bisa punya method sendiri. Di Modalin, file `backend/app/Enums/LoanStatus.php` adalah enum."

**Demo:**

```php
<?php

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

$status = Status::from('verified');
echo $status->label() . PHP_EOL;
echo Status::Rejected->value . PHP_EOL;
var_dump($status === Status::Verified);
```

**Output:**

```text
Menunggu persetujuan
rejected
bool(true)
```

> **Jelaskan:** "`Status::from('verified')` mengubah teks dari database menjadi enum. `->value` melakukan kebalikannya. Kalau teksnya tidak ada di daftar, misalnya `Status::from('verifed')`, PHP langsung error. Itu bagus, karena salah ketik ketahuan sejak awal."

### 4.6 Hubungan ke Laravel (5 menit, cukup ditunjukkan)

Buka `backend/app/Models/LoanApplication.php` di Modalin dan tunjukkan:

- `class LoanApplication extends Model`: class yang mewakili tabel `loan_applications`
- `public function decide(...)`: method, sama seperti `plafon()` tadi
- `$this->status`: properti object
- `LoanStatus::Disbursed`: enum

> **Jelaskan:** "Belum perlu paham isinya. Yang penting kalian sudah bisa mengenali bagian-bagiannya: class, method, `$this`, enum. Minggu depan kita mulai Laravel."

### Latihan pertemuan 4 (35 menit)

Buat `latihan4.php`:

1. Buat enum `Status` lengkap dengan method `label()` seperti demo.
2. Buat class `Usaha` (versi singkat) dengan properti `nama` dan `omzetBulanan`, plus method `plafon()`.
3. Buat class `Produk` dengan method `bolehDiajukan()` seperti demo.
4. Buat fungsi `cekPengajuan(Usaha $usaha, Produk $produk, int $jumlah): string` yang mengembalikan salah satu:
   - `Ditolak: di luar batas produk`
   - `Ditolak: melebihi plafon`
   - `Lolos`
5. Uji dengan tiga kasus untuk `Warung Makan Bu Sari` (omzet Rp12.000.000) dan produk Modal Kerja Mikro (Rp5 juta s.d. Rp50 juta):
   - jumlah Rp25.000.000 *(Lolos)*
   - jumlah Rp40.000.000 *(melebihi plafon)*
   - jumlah Rp3.000.000 *(di luar batas produk)*
6. **Tantangan:** tambahkan static method `Usaha::dariArray(array $data): Usaha` yang membuat object dari array asosiatif `['nama' => ..., 'omzet' => ...]`.

<details>
<summary>Kunci latihan 4</summary>

```php
<?php

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
    public function __construct(public string $nama, public int $omzetBulanan) {}

    public function plafon(): int
    {
        return $this->omzetBulanan * 3;
    }

    public static function dariArray(array $data): Usaha
    {
        return new Usaha($data['nama'], $data['omzet']);
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

function cekPengajuan(Usaha $usaha, Produk $produk, int $jumlah): string
{
    if (! $produk->bolehDiajukan($jumlah)) {
        return 'Ditolak: di luar batas produk';
    }
    if ($jumlah > $usaha->plafon()) {
        return 'Ditolak: melebihi plafon';
    }
    return 'Lolos';
}

$warung = Usaha::dariArray(['nama' => 'Warung Makan Bu Sari', 'omzet' => 12000000]);
$mikro = new Produk('Modal Kerja Mikro', 5000000, 50000000);

echo Status::from('submitted')->label() . PHP_EOL; // Menunggu verifikasi
foreach ([25000000, 40000000, 3000000] as $jumlah) {
    echo cekPengajuan($warung, $mikro, $jumlah) . PHP_EOL;
}
// Lolos
// Ditolak: melebihi plafon
// Ditolak: di luar batas produk
```

</details>

### Kesalahan umum pertemuan 4

- Lupa `new` saat membuat object.
- Menulis `$this.omzet` atau `$this->$omzet`. Yang benar `$this->omzet`, tanpa `$` kedua.
- Memanggil method tanpa kurung: `$warung->plafon` (dianggap properti) seharusnya `$warung->plafon()`.
- Lupa `public` di depan properti pada constructor promotion, sehingga propertinya tidak dibuat.

### Setelah pertemuan 4

Jalankan [Tes PHP Dasar](tes/tes-php-dasar.md) di pertemuan berikutnya (60 menit). Murid yang nilainya di bawah 75 mengulang bagian yang lemah sebelum lanjut ke materi JavaScript dan Laravel.
