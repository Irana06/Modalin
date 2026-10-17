<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained();
            $table->string('name');
            $table->string('nib', 13)->unique();
            $table->string('sector');
            $table->text('address');
            $table->unsignedBigInteger('monthly_revenue');
            $table->year('established_year');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('loan_products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->decimal('interest_rate', 5, 2);
            $table->unsignedBigInteger('min_amount');
            $table->unsignedBigInteger('max_amount');
            $table->unsignedSmallInteger('min_tenor');
            $table->unsignedSmallInteger('max_tenor');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('loan_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->foreignUuid('business_id')->constrained();
            $table->foreignUuid('loan_product_id')->constrained();
            $table->unsignedBigInteger('amount');
            $table->unsignedSmallInteger('tenor_months');
            $table->decimal('interest_rate', 5, 2);
            $table->unsignedBigInteger('monthly_revenue');
            $table->text('purpose');
            $table->enum('status', ['submitted', 'verified', 'approved', 'disbursed', 'rejected'])->index();
            $table->timestamp('disbursed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('application_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('loan_application_id')->constrained();
            $table->foreignUuid('reviewer_id')->constrained('users');
            $table->enum('stage', ['verification', 'approval', 'disbursement']);
            $table->enum('decision', ['approved', 'rejected']);
            $table->text('note')->nullable();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('installments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('loan_application_id')->constrained();
            $table->unsignedSmallInteger('number');
            $table->date('due_date');
            $table->unsignedBigInteger('principal');
            $table->unsignedBigInteger('interest');
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('remaining_balance');
            $table->timestamp('paid_at')->nullable();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained();
            $table->string('action')->index();
            $table->nullableUuidMorphs('auditable');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('installments');
        Schema::dropIfExists('application_reviews');
        Schema::dropIfExists('loan_applications');
        Schema::dropIfExists('loan_products');
        Schema::dropIfExists('businesses');
    }
};
