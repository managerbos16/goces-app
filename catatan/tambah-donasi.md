# Menambah Card Donasi Baru

Card donasi dibuat otomatis dari data campaign di database. Tidak perlu menambahkan card langsung ke file HTML.

## Alur singkat

```text
Tambah campaign di database/API → status ACTIVE → refresh aplikasi → card tampil otomatis
```

## 1. Siapkan data campaign

Gunakan data berikut sebagai contoh:

```json
{
  "title": "Bantu Korban Gempa Sulawesi",
  "slug": "bantu-korban-gempa-sulawesi",
  "description": "Mari bantu kebutuhan makanan, obat, dan tempat tinggal warga terdampak gempa.",
  "cover_image": "https://placehold.co/1200x675?text=Bantu+Korban+Gempa",
  "target_amount": 50000000,
  "created_by": 1
}
```

Keterangan:

- `title`: judul campaign.
- `slug`: teks unik tanpa spasi; gunakan tanda minus (`-`).
- `description`: penjelasan campaign.
- `cover_image`: URL gambar campaign.
- `target_amount`: target donasi dalam rupiah, tanpa titik atau koma. Contoh `50000000` berarti Rp50.000.000.
- `created_by`: ID pembuat campaign.

Gunakan gambar landscape rasio 16:9, misalnya `1200 x 675 px`, agar cocok pada card dan halaman detail.

## 2. Tambah campaign di local

1. Jalankan backend dari folder `jagel-api`:

```bash
npm start
```

2. Buka Postman dan buat request:

```text
POST http://localhost:3000/api/campaigns
```

3. Pada tab **Body**, pilih **raw** dan tipe **JSON**.
4. Tempel data JSON dari langkah 1.
5. Klik **Send**.

Jika sukses, API mengembalikan `success: true`.

## 3. Lihat campaign baru di local

Buka endpoint berikut di browser:

```text
http://localhost:3000/api/goces-peduli/home
```

Campaign baru harus muncul dalam `data.campaigns` dan statusnya harus `ACTIVE`.

Untuk melihatnya pada halaman aplikasi local, API frontend perlu memakai URL local:

```js
const GPDL_API = "http://localhost:3000/api/goces-peduli/home";
```

Setelah testing selesai, kembalikan URL API ke URL production bila diperlukan.

## 4. Tambah campaign untuk aplikasi Vercel/production

Deploy kode tidak memindahkan data campaign dari database local ke production.

Untuk menambahkan card pada aplikasi production, kirim request yang sama ke API Vercel:

```text

```

Gunakan body JSON yang sama. Campaign akan masuk ke database production dan card akan tampil setelah halaman di-refresh.

## Jika card belum muncul

1. Pastikan respons API berhasil.
2. Pastikan `status` campaign adalah `ACTIVE`.
3. Pastikan aplikasi memakai API yang sama: local untuk testing atau Vercel untuk production.
4. Refresh halaman aplikasi.
