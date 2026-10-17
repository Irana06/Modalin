<?php

namespace Tests\Unit;

use App\Models\Installment;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\TestCase;

class InstallmentScheduleTest extends TestCase
{
    public function test_annuity_schedule_pays_off_the_loan_exactly(): void
    {
        $rows = Installment::schedule(25_000_000, 12, 12, Carbon::parse('2026-10-17'));

        $this->assertCount(12, $rows);
        $this->assertSame(2_221_220, $rows[0]['amount']);
        $this->assertSame(250_000, $rows[0]['interest']);
        $this->assertSame(25_000_000, array_sum(array_column($rows, 'principal')));
        $this->assertSame(0, end($rows)['remaining_balance']);
        $this->assertSame('2026-11-17', $rows[0]['due_date']);
    }

    public function test_zero_interest_splits_the_amount_evenly(): void
    {
        $rows = Installment::schedule(12_000_000, 0, 12, Carbon::parse('2026-01-31'));

        $this->assertSame(1_000_000, $rows[0]['amount']);
        $this->assertSame(0, end($rows)['remaining_balance']);
        $this->assertSame('2026-02-28', $rows[0]['due_date']);
    }
}
