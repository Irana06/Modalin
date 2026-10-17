# ERD Modalin

Rancangan database untuk **Modalin**, platform pengajuan pembiayaan UMKM.
Semua primary key memakai **UUID**. Tabel bertanda `deleted_at` memakai **soft delete**.

```mermaid
erDiagram
    users ||--o| businesses : "punya (role umkm)"
    users ||--o{ application_reviews : "memberi keputusan"
    users ||--o{ audit_logs : "melakukan"
    businesses ||--o{ loan_applications : "mengajukan"
    loan_products ||--o{ loan_applications : "dipakai di"
    loan_applications ||--o{ application_reviews : "riwayat approval"
    loan_applications ||--o{ installments : "jadwal cicilan"

    users {
        uuid id PK
        string name
        string email UK
        string password
        enum role "admin | umkm | verifikator | manajer"
        timestamp deleted_at
        timestamps created_updated
    }

    businesses {
        uuid id PK
        uuid user_id FK "unique, 1 user = 1 usaha"
        string name
        string nib UK "Nomor Induk Berusaha"
        string sector
        text address
        decimal monthly_revenue "omzet per bulan"
        year established_year
        timestamp deleted_at
        timestamps created_updated
    }

    loan_products {
        uuid id PK
        string name
        decimal interest_rate "bunga % per tahun"
        decimal min_amount
        decimal max_amount
        int min_tenor "bulan"
        int max_tenor "bulan"
        boolean is_active
        timestamp deleted_at
        timestamps created_updated
    }

    loan_applications {
        uuid id PK
        string code UK "MDL-2026-0001"
        uuid business_id FK
        uuid loan_product_id FK
        decimal amount
        int tenor_months
        decimal interest_rate "salinan saat mengajukan"
        decimal monthly_revenue "salinan omzet saat mengajukan"
        text purpose
        enum status "submitted | verified | approved | disbursed | rejected"
        timestamp disbursed_at
        timestamp deleted_at
        timestamps created_updated
    }

    application_reviews {
        uuid id PK
        uuid loan_application_id FK
        uuid reviewer_id FK "users.id"
        enum stage "verification | approval | disbursement"
        enum decision "approved | rejected"
        text note
        timestamp created_at
    }

    installments {
        uuid id PK
        uuid loan_application_id FK
        int number "cicilan ke-"
        date due_date
        decimal principal "pokok"
        decimal interest "bunga"
        decimal amount "total bayar"
        decimal remaining_balance "sisa pokok"
        timestamp paid_at "null = belum bayar"
    }

    audit_logs {
        uuid id PK
        uuid user_id FK "nullable"
        string action "contoh: loan.approved"
        string auditable_type
        uuid auditable_id
        json old_values
        json new_values
        string ip_address
        timestamp created_at
    }
```

## Alur status pengajuan

```mermaid
stateDiagram-v2
    [*] --> submitted : UMKM mengajukan
    submitted --> verified : Verifikator setuju
    submitted --> rejected : Verifikator tolak
    verified --> approved : Manajer setuju
    verified --> rejected : Manajer tolak
    approved --> disbursed : Admin mencairkan dana (jadwal cicilan dibuat)
    disbursed --> [*]
    rejected --> [*]
```

Setiap perpindahan status menyimpan satu baris di `application_reviews` (untuk timeline) dan satu baris di `audit_logs`.

## Aturan bisnis

| Aturan | Di mana dicek |
| --- | --- |
| Plafon maksimal **3x omzet bulanan** (`amount <= monthly_revenue * 3`) | Form Request pengajuan |
| `amount` dan `tenor_months` harus di dalam batas `loan_products` | Form Request pengajuan |
| UMKM hanya boleh punya **1 pengajuan aktif** (status `submitted`, `verified`, atau `approved`) | Form Request pengajuan |
| Tiap role hanya bisa memproses tahapnya sendiri | Policy |
| Bunga dan omzet **disalin** ke pengajuan, supaya perubahan produk atau profil usaha tidak mengubah pengajuan lama | Saat create |

## Rumus cicilan (anuitas)

```
r = interest_rate / 12 / 100        bunga per bulan
M = P * r / (1 - (1 + r)^-n)        cicilan tetap per bulan

Untuk tiap bulan:
  bunga   = sisa_pokok * r
  pokok   = M - bunga
  sisa    = sisa_pokok - pokok
```

`P` = jumlah pinjaman, `n` = tenor (bulan). Selisih pembulatan ditaruh di cicilan terakhir supaya sisa pokok tepat 0.

## Catatan untuk murid

- **Sanctum + UUID:** migration bawaan `personal_access_tokens` memakai `morphs('tokenable')` (bigint). Karena `users.id` adalah UUID, ganti menjadi `uuidMorphs('tokenable')`. Kalau lupa, login akan gagal.
- `application_reviews`, `installments`, dan `audit_logs` **tidak** memakai soft delete karena isinya riwayat yang tidak boleh diubah.
