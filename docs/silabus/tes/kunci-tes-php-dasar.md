# Kunci Tes PHP Dasar (untuk pengajar)

Jangan bagikan file ini ke murid sebelum tes selesai. Kalau murid punya akses ke repository ini, cetak soalnya dan kerjakan tes sebelum mereka diberi akses.

## Bagian A (2 poin per soal)

| No | Jawaban | Penjelasan singkat untuk dibahas setelah tes |
| --- | --- | --- |
| 1 | B | Kutip dua membaca variabel |
| 2 | A | Kutip satu menampilkan teks apa adanya |
| 3 | C | 17 dibagi 5 sama dengan 3, sisa 2 |
| 4 | D | Pembagian yang tidak bulat menghasilkan `float` |
| 5 | A | `===` juga membandingkan tipe: teks `'5'` dan angka `5` berbeda |
| 6 | C | 10, lalu ditambah 5 jadi 15, lalu dikali 2 jadi 30 |
| 7 | A | Desimal 0, pemisah ribuan titik |
| 8 | B | 9 miliar lebih dari 2 miliar tapi tidak lebih dari 15 miliar. Hanya satu cabang yang dijalankan |
| 9 | D | `??` memakai nilai cadangan kalau nilainya `null` |
| 10 | A | Mulai dari 1, berhenti setelah 3 |
| 11 | C | Indeks dimulai dari 0, jadi indeks 1 adalah isi kedua |
| 12 | D | Hanya 12 dan 20 yang lebih dari 10 |
| 13 | C | Parameter punya nilai bawaan `'Tamu'` |
| 14 | A | `$this->omzetBulanan` bernilai 10.000.000, dikali 3 |
| 15 | B | Tidak ada titik koma setelah `$total = 100` |

## Bagian B (2 poin per soal)

| No | Jawaban |
| --- | --- |
| 16 | `number_format` |
| 17 | `.` (titik) |
| 18 | `as` |
| 19 | `$this->omzet` |
| 20 | `new` (contoh: `new Produk('Modal Kerja Mikro', 5000000, 50000000)`) |

Kesalahan ketik kecil di nomor 19, misalnya lupa `$`, tidak diberi poin. Di kode sungguhan kesalahan itu membuat program error.

## Bagian C: rubrik dan contoh jawaban

### C1 (15 poin)

| Kriteria | Poin |
| --- | --- |
| Total belanja dihitung dengan benar memakai variabel, bukan angka yang ditulis langsung | 4 |
| Syarat diskon memakai `if` dengan `>` 150000 | 4 |
| Diskon 0 saat tidak memenuhi syarat (diuji dengan 8 bungkus) | 3 |
| Tiga baris output dalam format rupiah | 4 |

```php
<?php

$jumlahBungkus = 12;
$harga = 15000;

$total = $jumlahBungkus * $harga;
$diskon = 0;
if ($total > 150000) {
    $diskon = $total * 10 / 100;
}

echo 'Total belanja: Rp' . number_format($total, 0, ',', '.') . PHP_EOL;
echo 'Diskon: Rp' . number_format($diskon, 0, ',', '.') . PHP_EOL;
echo 'Total bayar: Rp' . number_format($total - $diskon, 0, ',', '.') . PHP_EOL;
```

### C2 (20 poin)

| Kriteria | Poin |
| --- | --- |
| Fungsi `rupiah` dengan tipe parameter dan tipe kembalian | 3 |
| `rekap` mengembalikan `total` yang benar | 5 |
| `rekap` mengembalikan `per_status` yang benar | 6 |
| Output sesuai format | 3 |
| Daftar pengajuan di atas Rp50.000.000 benar (`MDL-2026-0013`) | 3 |

```php
<?php

$pengajuan = [
    ['kode' => 'MDL-2026-0011', 'usaha' => 'Gerabah Kasongan', 'jumlah' => 15000000, 'status' => 'disbursed'],
    ['kode' => 'MDL-2026-0012', 'usaha' => 'Tenun Lurik Dewi', 'jumlah' => 20000000, 'status' => 'submitted'],
    ['kode' => 'MDL-2026-0013', 'usaha' => 'Bengkel Maju Jaya', 'jumlah' => 120000000, 'status' => 'verified'],
    ['kode' => 'MDL-2026-0014', 'usaha' => 'Toko Berkah', 'jumlah' => 20000000, 'status' => 'submitted'],
];

function rupiah(int $angka): string
{
    return 'Rp' . number_format($angka, 0, ',', '.');
}

function rekap(array $data): array
{
    $perStatus = [];
    foreach ($data as $p) {
        $perStatus[$p['status']] = ($perStatus[$p['status']] ?? 0) + 1;
    }

    return ['total' => array_sum(array_column($data, 'jumlah')), 'per_status' => $perStatus];
}

$hasil = rekap($pengajuan);
echo 'Total pinjaman: ' . rupiah($hasil['total']) . PHP_EOL;
foreach ($hasil['per_status'] as $status => $jumlah) {
    echo "$status: $jumlah" . PHP_EOL;
}

foreach ($pengajuan as $p) {
    if ($p['jumlah'] > 50000000) {
        echo $p['kode'] . PHP_EOL;
    }
}
```

### C3 (25 poin)

| Kriteria | Poin |
| --- | --- |
| Class `Usaha` dengan constructor dan `plafon()` memakai `$this` | 6 |
| Class `Produk` dengan `bolehDiajukan()` yang benar di batas bawah dan atas | 6 |
| `cekPengajuan` memeriksa batas produk **sebelum** plafon | 7 |
| Ketiga hasil uji benar | 6 |

```php
<?php

class Usaha
{
    public function __construct(public string $nama, public int $omzetBulanan) {}

    public function plafon(): int
    {
        return $this->omzetBulanan * 3;
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

$tenun = new Usaha('Tenun Lurik Dewi', 9000000);
$mikro = new Produk('Modal Kerja Mikro', 5000000, 50000000);

foreach ([20000000, 30000000, 60000000] as $jumlah) {
    echo "$jumlah: " . cekPengajuan($tenun, $mikro, $jumlah) . PHP_EOL;
}
```

## Setelah tes

| Nilai | Tindak lanjut |
| --- | --- |
| 85-100 | Lanjut ke materi JavaScript, HTTP, dan Git |
| 75-84 | Lanjut, tapi ulangi latihan untuk bagian yang paling banyak salah sebagai tugas rumah |
| Di bawah 75 | Ulangi pertemuan yang lemah (lihat tabel di bawah), lalu tes ulang dengan angka yang diganti |

| Soal yang banyak salah | Ulangi |
| --- | --- |
| A1-A7, B16-B17, C1 | Pertemuan 1 |
| A8-A10, A15 | Pertemuan 2 |
| A11-A13, B18, C2 | Pertemuan 3 |
| A14, B19-B20, C3 | Pertemuan 4 |

Untuk tes ulang, ganti angka dan nama usaha di Bagian C. Bentuk soalnya tetap sama.
