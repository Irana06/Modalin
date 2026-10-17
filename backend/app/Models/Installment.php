<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Installment extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = ['number', 'due_date', 'principal', 'interest', 'amount', 'remaining_balance', 'paid_at'];

    protected function casts(): array
    {
        return [
            'due_date' => 'date:Y-m-d',
            'paid_at' => 'datetime',
            'principal' => 'integer',
            'interest' => 'integer',
            'amount' => 'integer',
            'remaining_balance' => 'integer',
        ];
    }

    public function loanApplication(): BelongsTo
    {
        return $this->belongsTo(LoanApplication::class);
    }

    /**
     * Annuity schedule in whole rupiah: a fixed monthly payment, interest on the remaining balance.
     * The last month absorbs rounding so the balance ends at exactly 0.
     */
    public static function schedule(int $amount, float $annualRate, int $months, CarbonInterface $start): array
    {
        $r = $annualRate / 12 / 100;
        $payment = (int) round($r > 0 ? $amount * $r / (1 - (1 + $r) ** -$months) : $amount / $months);
        $balance = $amount;
        $rows = [];

        for ($i = 1; $i <= $months; $i++) {
            $interest = (int) round($balance * $r);
            $principal = $i === $months ? $balance : $payment - $interest;
            $balance -= $principal;
            $rows[] = [
                'number' => $i,
                'due_date' => $start->copy()->addMonthsNoOverflow($i)->toDateString(),
                'principal' => $principal,
                'interest' => $interest,
                'amount' => $principal + $interest,
                'remaining_balance' => $balance,
            ];
        }

        return $rows;
    }
}
