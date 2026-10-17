# Tes PHP Dasar

**Waktu:** 60 menit · **Nilai maksimal:** 100 · **Lulus:** 75

| Bagian | Isi | Waktu | Nilai |
| --- | --- | --- | --- |
| A | 15 soal pilihan ganda | 15 menit | 30 (2 per soal) |
| B | 5 soal isian singkat | 5 menit | 10 (2 per soal) |
| C | 3 soal praktik di laptop | 40 menit | 60 |

**Aturan:** tidak boleh membuka catatan atau AI. Bagian C boleh membuka dokumentasi resmi di php.net, sama seperti aturan lomba.

---

## Bagian A: Pilihan ganda

Tulis huruf jawabanmu. Untuk soal yang berisi kode, tebak output-nya **tanpa menjalankan kode**.

**1.** Apa output kode ini?

```php
<?php
$nama = 'Sari';
echo "Halo, $nama";
```

A. `Halo, $nama`  B. `Halo, Sari`  C. Error  D. `Halo,`

**2.** Apa output kode ini?

```php
<?php
$nama = 'Sari';
echo 'Halo, $nama';
```

A. `Halo, $nama`  B. `Halo, Sari`  C. Error  D. `Halo,`

**3.** Apa output kode ini?

```php
<?php
echo 17 % 5;
```

A. `3.4`  B. `3`  C. `2`  D. `12`

**4.** Apa output kode ini?

```php
<?php
var_dump(10 / 4);
```

A. `int(2)`  B. `int(3)`  C. `string(3) "2.5"`  D. `float(2.5)`

**5.** Apa output kode ini?

```php
<?php
var_dump('5' === 5);
```

A. `bool(false)`  B. `bool(true)`  C. `int(5)`  D. Error

**6.** Apa output kode ini?

```php
<?php
$x = 10;
$x += 5;
$x *= 2;
echo $x;
```

A. `20`  B. `25`  C. `30`  D. `15`

**7.** Apa output kode ini?

```php
<?php
echo number_format(25000000, 0, ',', '.');
```

A. `25.000.000`  B. `25,000,000`  C. `25000000`  D. `25.000.000,00`

**8.** Apa output kode ini?

```php
<?php
$omzetTahunan = 9_000_000_000;
if ($omzetTahunan <= 2_000_000_000) {
    echo 'Mikro';
} elseif ($omzetTahunan <= 15_000_000_000) {
    echo 'Kecil';
} else {
    echo 'Menengah';
}
```

A. `Mikro`  B. `Kecil`  C. `Menengah`  D. `MikroKecil`

**9.** Apa output kode ini?

```php
<?php
$catatan = null;
echo $catatan ?? 'Belum ada catatan';
```

A. Kosong  B. `null`  C. Error  D. `Belum ada catatan`

**10.** Apa output kode ini?

```php
<?php
for ($i = 1; $i <= 3; $i++) {
    echo $i;
}
```

A. `123`  B. `0123`  C. `12`  D. `1234`

**11.** Apa output kode ini?

```php
<?php
$menu = ['Nasi Goreng', 'Mie Ayam', 'Es Teh'];
echo $menu[1];
```

A. `Es Teh`  B. `Nasi Goreng`  C. `Mie Ayam`  D. Error

**12.** Apa output kode ini?

```php
<?php
$angka = [5, 12, 8, 20];
echo count(array_filter($angka, fn ($n) => $n > 10));
```

A. `4`  B. `3`  C. `1`  D. `2`

**13.** Apa output kode ini?

```php
<?php
function sapa(string $nama = 'Tamu'): string
{
    return "Halo, $nama";
}
echo sapa();
```

A. `Halo, `  B. `Halo, $nama`  C. `Halo, Tamu`  D. Error karena parameter kosong

**14.** Apa output kode ini?

```php
<?php
class Usaha
{
    public function __construct(public int $omzetBulanan) {}

    public function plafon(): int
    {
        return $this->omzetBulanan * 3;
    }
}
$warung = new Usaha(10000000);
echo $warung->plafon();
```

A. `30000000`  B. `10000000`  C. `3`  D. Error

**15.** Kode mana yang **salah** dan akan menimbulkan error?

A. `$total = 100; echo $total;`
B. `$total = 100 echo $total;`
C. `$total = 100; echo "Total: $total";`
D. `$total = 100; echo 'Total: ' . $total;`

---

## Bagian B: Isian singkat

Isi bagian yang kosong (`____`).

**16.** Supaya output-nya `Rp25.000.000`:

```text
echo 'Rp' . ____(25000000, 0, ',', '.');
```

**17.** Operator untuk menggabungkan dua teks di PHP adalah `____`.

**18.** Lengkapi supaya setiap isi `$menu` ditampilkan:

```text
foreach ($menu ____ $item) {
    echo $item;
}
```

**19.** Di dalam method sebuah class, cara mengambil properti `omzet` milik object itu sendiri adalah `____`.

**20.** Kata kunci untuk membuat object dari class `Produk` adalah `____`.

---

## Bagian C: Praktik (kerjakan di laptop)

Simpan semua jawaban di satu file `tes-php.php`. Kalau ada bagian yang tidak selesai, biarkan kodenya tetap ada. Nilai sebagian tetap diberikan.

### Soal C1 (15 poin, ±10 menit)

Seorang pelanggan membeli 12 bungkus bakpia seharga Rp15.000 per bungkus. Kalau total belanja **lebih dari Rp150.000**, pelanggan mendapat diskon 10%.

Tampilkan:

```text
Total belanja: Rp180.000
Diskon: Rp18.000
Total bayar: Rp162.000
```

Program harus tetap benar kalau jumlah bungkusnya diganti menjadi 8 (tidak ada diskon, diskonnya Rp0).

### Soal C2 (20 poin, ±15 menit)

Salin data berikut:

```php
<?php
$pengajuan = [
    ['kode' => 'MDL-2026-0011', 'usaha' => 'Gerabah Kasongan', 'jumlah' => 15000000, 'status' => 'disbursed'],
    ['kode' => 'MDL-2026-0012', 'usaha' => 'Tenun Lurik Dewi', 'jumlah' => 20000000, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0013', 'usaha' => 'Bengkel Maju Jaya', 'jumlah' => 120000000, 'status' => 'verified'],
    ['kode' => 'MDL-2026-0014', 'usaha' => 'Toko Berkah', 'jumlah' => 20000000, 'status' => 'submitted'],
];
```

1. Buat fungsi `rupiah(int $angka): string`.
2. Buat fungsi `rekap(array $data): array` yang mengembalikan array berisi `total` (jumlah semua pinjaman) dan `per_status` (banyaknya pengajuan per status).
3. Tampilkan hasilnya seperti ini:

```text
Total pinjaman: Rp175.000.000
disbursed: 1
submitted: 2
verified: 1
```

4. Tampilkan kode pengajuan yang jumlahnya **di atas Rp50.000.000**.

### Soal C3 (25 poin, ±15 menit)

1. Buat class `Usaha` dengan properti `nama` dan `omzetBulanan`, serta method `plafon()` yang mengembalikan 3 x omzet bulanan.
2. Buat class `Produk` dengan properti `nama`, `min`, `max`, serta method `bolehDiajukan(int $jumlah): bool`.
3. Buat fungsi `cekPengajuan(Usaha $usaha, Produk $produk, int $jumlah): string` yang mengembalikan:
   - `Ditolak: di luar batas produk` kalau jumlah tidak di antara `min` dan `max`
   - `Ditolak: melebihi plafon` kalau jumlah lebih besar dari plafon
   - `Lolos` kalau tidak ada masalah
4. Uji dengan usaha `Tenun Lurik Dewi` (omzet bulanan Rp9.000.000) dan produk `Modal Kerja Mikro` (Rp5.000.000 s.d. Rp50.000.000). Output yang diharapkan:

```text
20000000: Lolos
30000000: Ditolak: melebihi plafon
60000000: Ditolak: di luar batas produk
```
