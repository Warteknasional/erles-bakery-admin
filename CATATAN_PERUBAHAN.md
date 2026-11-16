# Catatan Perubahan Terakhir — Portal Admin Erles Bakery ERP

**Branch:** `Farhan-Ganteng`  
**Tanggal Pembaruan:** 11 November 2026  

Dokumen ini mencatat seluruh perubahan, perbaikan UI/UX, serta integrasi API yang terakhir dikerjakan pada folder `admin/` (beserta dukungan endpoint di `backend/` dan sinkronisasi di `public/`).

---

## 1. Daftar File yang Diedit / Ditambahkan di Folder `admin/`

| File | Status | Rincian Perubahan |
| :--- | :---: | :--- |
| `public/logo.jpg` & `index.html` | **BARU / DIEDIT** | Menambahkan logo resmi toko (`logo.jpg`) dan mengganti favicon tab browser dari ikon roti lama menjadi logo resmi Erles Bakery. |
| `src/components/Sidebar.jsx` & `src/pages/LoginPage.jsx` | **DIEDIT** | Mengganti ikon emoji roti (`🍞`) pada header brand sidebar kiri atas dan halaman login dengan gambar logo resmi toko (`/logo.jpg`). |
| `src/components/Navbar.jsx` | **DIEDIT** | <ul><li>Menghapus status *Toko Buka*, *WhatsApp Order: Siap Terima Pesanan*, dan *Tanggal* pada topbar agar tampilan header bersih.</li><li>Menghapus opsi menu *Pengaturan Toko* pada dropdown profil kanan atas.</li></ul> |
| `src/pages/PesananPage.jsx` | **DIEDIT** | <ul><li>Menambahkan fitur **Preview Bukti Pembayaran (Transfer / QRIS)**, link **Lihat Bukti Transfer**, serta tombol sekali klik **Konfirmasi Lunas** pada modal detail pesanan.</li><li>Menambahkan badge indikator **`Bukti Masuk`** pada kolom Pembayaran di tabel pesanan.</li><li>Menyeragamkan ukuran kotak pencarian (*search bar*) dan *dropdown filter* agar selaras dengan halaman Stok Bahan.</li><li>Menampilkan rincian bahan baku dapur yang otomatis berkurang pada *Toast Notification* (12 detik) saat pesanan masuk tahap produksi (`processing`).</li></ul> |
| `src/pages/KeuanganPage.jsx` & `src/pages/ProdukPage.jsx` | **DIEDIT** | Menyeragamkan lebar dan padding *search bar* serta *dropdown filter* agar konsisten di seluruh halaman Admin. |
| `src/routes/AppRoutes.jsx` | **DIEDIT** | Membersihkan variabel `useAuth()` yang tidak terpakai agar tidak memicu *ReferenceError* saat render awal. |
| `src/services/api.js` | **DIEDIT** | Deteksi otomatis `localhost` agar saat pengembangan lokal terhubung ke `http://localhost:8000/api` (Docker) dan saat di-deploy ke Netlify tetap mengarah ke Railway. |
| `src/services/ingredientService.js` | **BARU** | Service Axios untuk komunikasi ke REST API Bahan Baku (`GET`, `POST`, `PUT`, `DELETE /api/ingredients` serta `GET /api/ingredients/history`). |
| `src/pages/StokBahanPage.jsx` | **DIEDIT** | Integrasi penuh tabel inventaris bahan baku dengan PostgreSQL via REST API (CRUD, auto-close modal, dan pop-up **Riwayat Pemakaian** bahan baku produksi). |

---

## 2. Dukungan Integrasi di Folder `backend/` & `public/`

1. **Fitur Upload Bukti Pembayaran (Transfer / QRIS):**
   - `backend/database/migrations/2024_01_04_000003_add_bukti_pembayaran_to_orders_table.php`: Kolom `bukti_pembayaran` pada tabel `orders`.
   - `backend/app/Http/Controllers/OrderController.php` & `routes/api.php`: Endpoint publik `POST /api/orders/{idOrCode}/payment-proof` untuk unggah foto bukti pembayaran (maks 5MB).
   - `public/src/pages/LacakPesananPage.jsx` & `public/src/index.css`: Kotak unggah bukti bayar, sinkronisasi status *real-time* dari API setiap 5 detik, dan *auto-scroll* otomatis ke kartu pelacakan saat tombol Lacak diklik.
   - `public/src/components/ScrollManager.jsx`: Penambahan `MutationObserver` agar seluruh kartu produk di tab kategori **Semua** langsung tampil tanpa harus berpindah tab terlebih dahulu.
2. **Otomasi Bahan Baku & Resep (Bill of Materials / BOM):**
   - Migrasi `ingredients` & `product_ingredient`, kalkulasi otomatis status stok (`Aman`, `Menipis`, `Kritis`), serta pembaruan foto produk pada `DatabaseSeeder.php`.

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

