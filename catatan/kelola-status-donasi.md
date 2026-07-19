# Mengaktifkan dan Menyembunyikan Card Donasi

Card donasi berasal dari tabel `campaigns` di database Neon PostgreSQL.
Card hanya tampil pada aplikasi jika kolom `status` bernilai `ACTIVE`.

## 1. Buka database

1. Buka https://console.neon.tech dan login.
2. Pilih project database GOCES.
3. Pilih menu **SQL Editor**.

## 2. Lihat daftar campaign dan ID-nya

Jalankan query berikut:

```sql
SELECT id, title, status, target_amount, collected_amount
FROM campaigns
ORDER BY id DESC;
```

Catat nilai `id` dari campaign yang ingin dikelola.

## 3. Sembunyikan card tanpa menghapus data

Contoh untuk campaign dengan ID `2`:

```sql
UPDATE campaigns
SET status = 'INACTIVE'
WHERE id = 2;
```

Setelah aplikasi di-refresh, card tidak akan tampil. Data campaign dan riwayat donasinya tetap tersimpan.

## 4. Tampilkan kembali card

Contoh untuk campaign dengan ID `2`:

```sql
UPDATE campaigns
SET status = 'ACTIVE'
WHERE id = 2;
```

Setelah aplikasi di-refresh, card akan tampil kembali.

## Penting

- Ganti angka `2` dengan ID campaign yang benar.
- Gunakan `INACTIVE` untuk menyembunyikan card; ini lebih aman daripada menghapus campaign.
- Hindari `DELETE FROM campaigns` jika campaign sudah memiliki transaksi donasi.
- Pastikan database Neon yang dibuka sama dengan `DATABASE_URL` yang digunakan proyek Vercel bila ingin mengubah aplikasi production.
