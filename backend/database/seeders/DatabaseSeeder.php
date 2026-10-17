<?php

namespace Database\Seeders;

use App\Enums\LoanStatus;
use App\Enums\Role;
use App\Models\AuditLog;
use App\Models\LoanProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $products = collect([
            'mikro' => ['Modal Kerja Mikro', 12, 5_000_000, 50_000_000, 6, 24],
            'kecil' => ['Modal Kerja Kecil', 10.5, 50_000_000, 200_000_000, 12, 36],
            'alat' => ['Investasi Alat Usaha', 9, 20_000_000, 150_000_000, 12, 48],
        ])->map(fn ($p) => LoanProduct::create(array_combine(
            ['name', 'interest_rate', 'min_amount', 'max_amount', 'min_tenor', 'max_tenor'], $p
        )));

        $staff = collect([
            'admin' => ['Admin Modalin', Role::Admin],
            'verifikator' => ['Rina Kusuma', Role::Verifikator],
            'manajer' => ['Dimas Prakoso', Role::Manajer],
        ])->map(fn ($s, $key) => User::create([
            'name' => $s[0], 'email' => "{$key}@modalin.test", 'password' => 'password', 'role' => $s[1],
        ]));

        // [owner, business, sector, monthly revenue, product, amount, tenor, days ago, final status]
        $loans = [
            ['Wahyu Hidayat', 'Toko Kelontong Berkah', 'Perdagangan', 10_000_000, 'mikro', 20_000_000, 12, 120, 'disbursed'],
            ['Ratna Sari', 'Bakpia Ngasem', 'Kuliner', 35_000_000, 'kecil', 90_000_000, 18, 75, 'disbursed'],
            ['Agus Santoso', 'Laundry Kilat Sleman', 'Jasa', 25_000_000, 'alat', 60_000_000, 24, 33, 'rejected'],
            ['Suparmi', 'Gerabah Kasongan Asri', 'Kerajinan', 8_000_000, 'mikro', 15_000_000, 6, 40, 'disbursed'],
            ['Bambang Riyadi', 'Bengkel Las Maju Jaya', 'Jasa', 45_000_000, 'alat', 120_000_000, 36, 19, 'approved'],
            ['Sari Wulandari', 'Warung Makan Bu Sari', 'Kuliner', 12_000_000, 'mikro', 25_000_000, 12, 14, 'verified'],
            ['Lestari Ningsih', 'Batik Tulis Giriloyo', 'Kerajinan', 15_000_000, 'mikro', 30_000_000, 12, 5, 'verified'],
            ['Yoga Pratama', 'Kopi Lereng Merapi', 'Kuliner', 30_000_000, 'kecil', 75_000_000, 24, 2, 'submitted'],
        ];

        $notes = [
            'verification' => 'NIB dan omzet sesuai dokumen. Usaha aktif dan tujuan dana jelas.',
            'approval' => 'Disetujui sesuai plafon dan kemampuan bayar.',
            'disbursement' => 'Dana ditransfer ke rekening usaha.',
        ];

        foreach ($loans as $i => [$owner, $name, $sector, $revenue, $product, $amount, $tenor, $daysAgo, $final]) {
            $email = $owner === 'Sari Wulandari' ? 'umkm@modalin.test' : Str::slug($name, '.').'@modalin.test';
            $user = User::create(['name' => $owner, 'email' => $email, 'password' => 'password', 'role' => Role::Umkm]);
            $business = $user->business()->create([
                'name' => $name, 'nib' => '912030'.str_pad($i + 1, 7, '0', STR_PAD_LEFT), 'sector' => $sector,
                'address' => 'Sleman, DI Yogyakarta', 'monthly_revenue' => $revenue, 'established_year' => 2015 + $i,
            ]);

            // Freeze the clock so codes, reviews and audit logs get believable dates.
            Carbon::setTestNow(now()->subDays($daysAgo)->setTime(9, 30));
            auth()->setUser($user);
            $loan = $business->loanApplications()->create([
                'loan_product_id' => $products[$product]->id, 'amount' => $amount, 'tenor_months' => $tenor,
                'interest_rate' => $products[$product]->interest_rate, 'monthly_revenue' => $revenue,
                'purpose' => "Menambah modal usaha {$name} untuk bahan baku dan peralatan.", 'status' => LoanStatus::Submitted,
            ]);
            AuditLog::record('loan.submitted', $loan, null, $loan->only('status', 'amount', 'tenor_months'));

            while ($loan->status !== LoanStatus::from($final) && $loan->status->reviewer()) {
                Carbon::setTestNow(now()->addDays(2));
                $reviewer = $staff[$loan->status->reviewer()->value];
                auth()->setUser($reviewer);
                $reject = $final === 'rejected' && $loan->status === LoanStatus::Verified;
                $loan->decide($reviewer, ! $reject, $reject ? 'Omzet 3 bulan terakhir menurun, kemampuan bayar belum cukup.' : $notes[$loan->status->stage()]);
            }
            Carbon::setTestNow();
            auth()->forgetUser();

            $loan->installments()->where('due_date', '<', now())->update(['paid_at' => DB::raw('due_date')]);
        }
    }
}
