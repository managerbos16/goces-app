/**
 * GOCES Promo Page Logic
 * Ditulis menggunakan Vanilla JS murni.
 * Tidak menggunakan innerHTML, insertAdjacentHTML, createElement, atau pembuatan DOM.
 * DOM sudah ada di HTML. Script ini hanya untuk Event, Logika Filter, Counter, dan Manipulasi Class.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Elemen
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.gcsPromo-category-btn');
    const voucherCards = document.querySelectorAll('.gcsPromo-card');
    const totalVoucherEl = document.getElementById('gcsPromo-total-voucher');
    const searchForm = document.getElementById('gcsPromo-search-form');

    // 2. Data State & Konstanta Vouchers (Syarat Wajib Array)
    // Walaupun card sudah ada di HTML, Array ini merepresentasikan data state aplikasi,
    // yang dapat dimanfaatkan untuk sinkronisasi dengan database di kemudian hari.
    const vouchersData = [
        { id: 'gr1', category: 'goride', title: 'Diskon 50% GoRide', quota: 12 },
        { id: 'gr2', category: 'goride', title: 'Potongan Rp 10.000', quota: 5 },
        { id: 'gr3', category: 'goride', title: 'Diskon 20% Akhir Pekan', quota: 50 },
        { id: 'gr4', category: 'goride', title: 'Cashback 30% GoPay', quota: 3 },
        { id: 'gr5', category: 'goride', title: 'Diskon Pengguna Baru', quota: 8 },
        { id: 'gc1', category: 'gocar', title: 'Diskon Rp 20.000 GoCar', quota: 10 },
        { id: 'gc2', category: 'gocar', title: 'Potongan Bandara 50%', quota: 2 },
        { id: 'gc3', category: 'gocar', title: 'Diskon 30% Malam Hari', quota: 15 },
        { id: 'gc4', category: 'gocar', title: 'GoCar Protect+ Cashback', quota: 20 },
        { id: 'gc5', category: 'gocar', title: 'Spesial Hari Pahlawan', quota: 6 },
        { id: 'gf1', category: 'gofood', title: 'Pesta Diskon GoFood 60%', quota: 25 },
        { id: 'gf2', category: 'gofood', title: 'Gratis Ongkir Sepuasnya', quota: 10 },
        { id: 'gf3', category: 'gofood', title: 'Flash Sale Tengah Malam', quota: 5 },
        { id: 'gf4', category: 'gofood', title: 'Diskon Minuman & Kopi', quota: 30 },
        { id: 'gf5', category: 'gofood', title: 'Potongan Mitra GoFood', quota: 8 },
        { id: 'dl1', category: 'delivery', title: 'Potongan Ongkir Rp 5.000', quota: 50 },
        { id: 'dl2', category: 'delivery', title: 'Diskon Pengiriman Paket Besar', quota: 12 },
        { id: 'dl3', category: 'delivery', title: 'Gratis Asuransi Paket', quota: 10 },
        { id: 'dl4', category: 'delivery', title: 'Cashback Delivery 20%', quota: 20 },
        { id: 'dl5', category: 'delivery', title: 'Diskon Delivery Antar Kota', quota: 4 },
        { id: 'sh1', category: 'shop', title: 'Diskon 70% Fashion', quota: 5 },
        { id: 'sh2', category: 'shop', title: 'Gadget Sale Potongan 5%', quota: 12 },
        { id: 'sh3', category: 'shop', title: 'Gratis Ongkir Shop', quota: 25 },
        { id: 'sh4', category: 'shop', title: 'Cashback 50% Skin Care', quota: 10 },
        { id: 'sh5', category: 'shop', title: 'Diskon Payday Shop', quota: 40 },
        { id: 'fr1', category: 'fresh', title: 'Diskon Sayur 30%', quota: 18 },
        { id: 'fr2', category: 'fresh', title: 'Potongan Daging & Ayam', quota: 12 },
        { id: 'fr3', category: 'fresh', title: 'Buah Tropis Diskon 20%', quota: 20 },
        { id: 'fr4', category: 'fresh', title: 'Gratis Ongkir Supermarket', quota: 30 },
        { id: 'fr5', category: 'fresh', title: 'Paket Sembako Murah', quota: 10 },
        { id: 'pp1', category: 'ppob', title: 'Cashback Token Listrik', quota: 50 },
        { id: 'pp2', category: 'ppob', title: 'Potongan Pulsa Rp 5.000', quota: 20 },
        { id: 'pp3', category: 'ppob', title: 'Diskon Tagihan Air (PDAM)', quota: 15 },
        { id: 'pp4', category: 'ppob', title: 'Cashback BPJS Kesehatan', quota: 30 },
        { id: 'pp5', category: 'ppob', title: 'Promo Paket Data 10%', quota: 10 }
    ];

    let currentCategory = 'semua';
    let searchQuery = '';

    // 3. Fungsi Menghitung dan Mengupdate Counter Realtime
    const updateVoucherCount = () => {
        let visibleCount = 0;

        // Loop secara efisien dengan passive read
        voucherCards.forEach(card => {
            if (!card.classList.contains('gcsPromo-hidden')) {
                visibleCount++;
            }
        });

        // Animasi angka (update jumlah)
        totalVoucherEl.style.opacity = '0';
        totalVoucherEl.style.transform = 'scale(0.8)';

        setTimeout(() => {
            totalVoucherEl.textContent = visibleCount;
            totalVoucherEl.style.opacity = '1';
            totalVoucherEl.style.transform = 'scale(1)';
            totalVoucherEl.style.transition = 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)';
        }, 150);
    };

    // 4. Fungsi Utama untuk Melakukan Filter
    const applyFilter = () => {
        // Optimasi: menggunakan requestAnimationFrame agar tidak terjadi layout thrashing
        requestAnimationFrame(() => {
            voucherCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const titleText = card.querySelector('.gcsPromo-title').textContent.toLowerCase();

                const matchCategory = (currentCategory === 'semua' || cardCategory === currentCategory);
                const matchSearch = titleText.includes(searchQuery.toLowerCase());

                // Jika match, hapus class hidden (tampilkan). Jika tidak, tambahkan class hidden.
                if (matchCategory && matchSearch) {
                    card.classList.remove('gcsPromo-hidden');
                } else {
                    card.classList.add('gcsPromo-hidden');
                }
            });

            // Update counter setelah DOM filter selesai
            updateVoucherCount();
        });
    };

    // 5. Event Listener Kategori
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Hapus class active dari semua tombol
            categoryButtons.forEach(btn => btn.classList.remove('gcsPromo-active'));

            // Tambahkan active ke tombol yang diklik
            const targetBtn = e.currentTarget;
            targetBtn.classList.add('gcsPromo-active');

            // Set current category & eksekusi filter
            currentCategory = targetBtn.dataset.filter;
            applyFilter();

            // UX: scroll button ke tengah jika horizontal scroll
            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // 6. Event Listener Search Form
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        applyFilter();
    });

    // Cegah page reload jika tekan enter di input
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchInput.blur(); // Hide keyboard iOS/Android
    });

    // 7. Event Listener Gunakan Tombol (Simulasi Hapus/Pakai)
    const useButtons = document.querySelectorAll('.gcsPromo-btn-use');
    useButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.currentTarget.closest('.gcsPromo-card');

            // Animasi hapus (seolah voucher digunakan & hilang)
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';

            setTimeout(() => {
                // Menghilangkan elemen dari render tanpa innerHTML, 
                // murni manipulasi class display atau remove node
                card.remove();

                // Panggil ulang penghitungan realtime 
                // "Kalau voucher dihapus jumlah ikut otomatis berubah"
                applyFilter();
            }, 300); // durasi sesuai transition
        });
    });

    // 8. Inisiasi Pertama Kali Load
    updateVoucherCount();
});