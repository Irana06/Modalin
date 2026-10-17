<?php

namespace Tests\Feature;

use App\Models\LoanProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LoanFlowTest extends TestCase
{
    use RefreshDatabase;

    private LoanProduct $product;

    protected function setUp(): void
    {
        parent::setUp();
        $this->product = LoanProduct::create([
            'name' => 'Modal Kerja Mikro', 'interest_rate' => 12, 'min_amount' => 5_000_000,
            'max_amount' => 50_000_000, 'min_tenor' => 6, 'max_tenor' => 24,
        ]);
    }

    private function borrower(int $revenue = 12_000_000): User
    {
        $user = User::factory()->create(['role' => 'umkm']);
        $user->business()->create([
            'name' => 'Warung Uji', 'nib' => fake()->unique()->numerify('#############'), 'sector' => 'Kuliner',
            'address' => 'Sleman', 'monthly_revenue' => $revenue, 'established_year' => 2020,
        ]);

        return $user;
    }

    private function submit(User $user, int $amount)
    {
        Sanctum::actingAs($user);

        return $this->postJson('/api/loan-applications', [
            'loan_product_id' => $this->product->id, 'amount' => $amount, 'tenor_months' => 12,
            'purpose' => 'Menambah stok bahan baku untuk pesanan katering.',
        ]);
    }

    private function decide(string $role, string $loanId, string $decision = 'approved')
    {
        Sanctum::actingAs(User::factory()->create(['role' => $role]));

        return $this->postJson("/api/loan-applications/{$loanId}/decision", ['decision' => $decision, 'note' => 'Catatan pemeriksaan.']);
    }

    public function test_amount_above_three_times_monthly_revenue_is_rejected(): void
    {
        $this->submit($this->borrower(12_000_000), 40_000_000)
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonValidationErrors('amount');
    }

    public function test_application_goes_through_every_stage_and_creates_installments(): void
    {
        $borrower = $this->borrower();
        $id = $this->submit($borrower, 25_000_000)->assertCreated()->json('data.id');

        $this->decide('manajer', $id)->assertForbidden();
        $this->decide('verifikator', $id)->assertOk()->assertJsonPath('data.status', 'verified');
        $this->decide('manajer', $id)->assertOk()->assertJsonPath('data.status', 'approved');
        $this->decide('admin', $id)->assertOk()->assertJsonPath('data.status', 'disbursed');

        Sanctum::actingAs($borrower);
        $this->getJson("/api/loan-applications/{$id}")
            ->assertOk()
            ->assertJsonCount(12, 'data.installments')
            ->assertJsonCount(3, 'data.reviews');
        $this->assertDatabaseCount('audit_logs', 4);
    }

    public function test_installments_must_be_paid_in_order(): void
    {
        $id = $this->submit($this->borrower(), 25_000_000)->json('data.id');
        foreach (['verifikator', 'manajer', 'admin'] as $role) {
            $this->decide($role, $id);
        }
        $installments = \App\Models\LoanApplication::find($id)->installments;

        $this->postJson("/api/admin/installments/{$installments[1]->id}/pay")->assertStatus(422);
        $this->postJson("/api/admin/installments/{$installments[0]->id}/pay")->assertOk();
        $this->postJson("/api/admin/installments/{$installments[0]->id}/pay")->assertStatus(422);
    }

    public function test_admin_cannot_demote_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $this->putJson("/api/admin/users/{$admin->id}", ['name' => $admin->name, 'email' => $admin->email, 'role' => 'manajer'])
            ->assertStatus(422);
        $this->assertSame('admin', $admin->fresh()->role->value);
    }

    public function test_business_cannot_submit_twice_or_see_other_applications(): void
    {
        $borrower = $this->borrower();
        $id = $this->submit($borrower, 10_000_000)->json('data.id');
        $this->submit($borrower, 10_000_000)->assertJsonValidationErrors('loan_product_id');

        Sanctum::actingAs($this->borrower());
        $this->getJson("/api/loan-applications/{$id}")->assertForbidden()->assertJsonPath('success', false);
    }

    public function test_rejection_requires_a_note(): void
    {
        $id = $this->submit($this->borrower(), 10_000_000)->json('data.id');
        Sanctum::actingAs(User::factory()->create(['role' => 'verifikator']));

        $this->postJson("/api/loan-applications/{$id}/decision", ['decision' => 'rejected'])
            ->assertJsonValidationErrors('note');
    }

    public function test_login_is_rate_limited_after_five_attempts(): void
    {
        $user = User::factory()->create();

        foreach (range(1, 5) as $_) {
            $this->postJson('/api/login', ['email' => $user->email, 'password' => 'salah'])->assertUnauthorized();
        }
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
            ->assertStatus(429)
            ->assertJsonPath('success', false);
    }

    public function test_only_admin_can_manage_products(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'manajer']));
        $this->getJson('/api/admin/loan-products')->assertForbidden();

        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->getJson('/api/admin/loan-products')->assertOk()->assertJsonPath('data.total', 1);
    }
}
