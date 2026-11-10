# Catatan Perubahan Terakhir — Portal Admin Erles Bakery ERP

**Branch:** `Farhan-Ganteng`  
**Tanggal Pembaruan:** 09 November 2026  

Dokumen ini mencatat seluruh perubahan, perbaikan UI/UX, serta integrasi API yang terakhir dikerjakan pada folder `admin/` (beserta dukungan endpoint di `backend/`).

---

## 1. Daftar File yang Diedit / Ditambahkan di Folder `admin/`

| File | Status | Rincian Perubahan |
| :--- | :---: | :--- |
| `src/services/ingredientService.js` | **BARU** | Service Axios untuk komunikasi ke REST API Bahan Baku (`GET`, `POST`, `PUT`, `DELETE /api/ingredients` serta `GET /api/ingredients/history`). |
| `src/pages/StokBahanPage.jsx` | **DIEDIT** | <ul><li>Menghubungkan tabel inventaris bahan baku yang sebelumnya masih *dummy/statis* ke database PostgreSQL via REST API.</li><li>Menambahkan fitur **Tambah, Edit, Hapus, dan Refresh** bahan baku secara *real-time* dan permanen.</li><li>Memperbaiki bug UX pop-up modal form yang sebelumnya tidak langsung tertutup otomatis (`onClose()`) saat klik **Simpan Perubahan**.</li><li>Menambahkan tombol **"Riwayat Pemakaian"** di header kanan atas beserta pop-up modal `ProductionHistoryModal` untuk memantau histori bahan baku yang terpotong dari produksi pesanan.</li></ul> |
| `src/components/Sidebar.jsx` | **DIEDIT** | Mengubah badge notifikasi merah pada menu **Stok Bahan** di sidebar kiri agar menghitung jumlah bahan berstatus **Kritis** secara dinamis langsung dari API backend (`/api/ingredients?status=Kritis`). |
| `src/pages/PesananPage.jsx` | **DIEDIT** | <ul><li>Menampilkan rincian bahan baku dapur yang otomatis berkurang pada *Toast Notification* ketika status pesanan diubah menjadi **Diproses (`processing`)**.</li><li>Memperpanjang durasi tampil *Toast Notification* khusus pemotongan bahan baku menjadi **12 detik (`12000ms`)** agar admin sempat membaca dan memantau daftar bahan yang berkurang.</li><li>Memicu sinkronisasi otomatis badge sidebar kiri setiap kali status pesanan diperbarui.</li></ul> |

---

## 2. Dukungan Integrasi di Folder `backend/` (Terkait Modul Admin)

Agar fitur di folder `admin/` berjalan penuh dengan database, berikut penambahan di sisi `backend/`:

1. **Migrasi Database:**
   - `database/migrations/2024_01_04_000001_create_ingredients_table.php`: Tabel master `ingredients` (`kode`, `nama`, `kategori`, `stok`, `satuan`, `minimum_stok`).
   - `database/migrations/2024_01_04_000002_create_product_ingredient_table.php`: Tabel relasi resep/BOM `product_ingredient` (`product_id`, `ingredient_id`, `qty_used`) dan kolom penanda `ingredients_deducted_at` pada tabel `orders`.
2. **Model & Logika Otomasi ERP (Bill of Materials / BOM):**
   - `app/Models/Ingredient.php`: Kalkulasi otomatis status stok (`Aman`, `Menipis` jika `stok <= minimum_stok`, dan `Kritis` jika `stok <= 50% minimum_stok`).
   - `app/Models/Product.php` & `app/Models/Order.php`: Method `deductIngredientsIfNeeded()` yang otomatis memotong stok bahan baku gudang tepat 1 kali saat pesanan masuk tahap produksi (`processing` / `ready` / `completed`).
3. **Controller & Endpoint Baru:**
   - `app/Http/Controllers/IngredientController.php`: CRUD bahan baku (`/api/ingredients`) dan endpoint histori pemakaian produksi (`/api/ingredients/history`).
   - `database/seeders/DatabaseSeeder.php`: Seeder 13 bahan baku utama bakery beserta 64 relasi takaran resep ke seluruh produk katalog.

---

## 3. Cara Menjalankan & Menguji Perubahan Ini (Bagi Rekan Tim)

Jika menarik (*pull*) branch `Farhan-Ganteng` dan menggunakan Docker:

```bash
# 1. Jalankan migrasi & seeder untuk tabel bahan baku dan resep (BOM)
docker exec erles_backend php artisan migrate --force
docker exec erles_backend php artisan db:seed --force

# 2. Restart container admin & backend bila diperlukan
docker restart erles_admin erles_backend
```

Lalu buka [http://localhost:5174/stok-bahan](http://localhost:5174/stok-bahan) dan [http://localhost:5174/pesanan](http://localhost:5174/pesanan).

