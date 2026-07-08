/**
 * GOCES Promo Page Logic
 * Arsitektur Bersih: Vanilla JS, Modular, Separation of Concerns.
 * JS HANYA mengontrol UI (hide/show/text update), TIDAK membuat struktur HTML.
 * Seluruh fungsi, variabel, selector dikunci dengan prefix gcsPromo.
 */

const GcsPromoEngine = (function () {
    "use strict";

    // --- STATE ---
    const gcsPromoState = {
        activeCategory: 'semua',
        searchQuery: ''
    };

    // --- DOM CACHE ---
    let domElements = {};

    /**
     * Inisialisasi Utama
     */
    function gcsPromoInit() {
        // Caching elemen yang sudah ada di HTML
        domElements = {
            mainArea: document.getElementById('gcsPromoMainArea'),
            searchInput: document.getElementById('gcsPromoSearchInput'),
            searchForm: document.querySelector('.gcsPromoSearchForm'),
            counterText: document.getElementById('gcsPromoCounter'),
            vouchers: Array.from(document.querySelectorAll('.gcsPromoVoucher')),
            categoryBtns: document.querySelectorAll('.gcsPromoCategoryBtn'),
            emptyState: document.getElementById('gcsPromoEmptyState')
        };

        if (!domElements.mainArea) return;

        // BINDING EVENT LISTENERS
        gcsPromoBindEvents();

        // Initial Calculation (Hitung saat halaman pertama kali diload)
        gcsPromoSync();
    }

    /**
     * Manajemen Event (Event Delegation & Direct Binding)
     */
    function gcsPromoBindEvents() {
        // 1. Event Delegation untuk Kategori
        domElements.mainArea.addEventListener('click', function (event) {
            const targetBtn = event.target.closest('[data-action="gcsPromoFilter"]');
            if (targetBtn) {
                const category = targetBtn.getAttribute('data-target');
                gcsPromoFilterCategory(category, targetBtn);
            }
        });

        // 2. Event Input untuk Pencarian (Real-time Filter)
        if (domElements.searchInput) {
            domElements.searchInput.addEventListener('input', function (e) {
                gcsPromoState.searchQuery = e.target.value.toLowerCase().trim();
                // Gunakan requestAnimationFrame untuk optimasi performa rendering saat mengetik
                requestAnimationFrame(() => gcsPromoSync());
            });
        }

        // 3. Mencegah Search Form Reload Halaman
        if (domElements.searchForm) {
            domElements.searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                domElements.searchInput.blur(); // Turunkan keyboard di mobile
            });
        }
    }

    /**
     * Logika klik Kategori
     * @param {String} categoryName 
     * @param {HTMLElement} clickedBtn 
     */
    function gcsPromoFilterCategory(categoryName, clickedBtn) {
        // Update State
        gcsPromoState.activeCategory = categoryName;

        // Update UI Kategori Aktif
        domElements.categoryBtns.forEach(btn => {
            btn.classList.remove('gcsPromoCategoryActive');
        });
        clickedBtn.classList.add('gcsPromoCategoryActive');

        // Sinkronisasi Vouchers
        gcsPromoSync();
    }

    /**
     * SINKRONISASI UTAMA (Mengeksekusi Filter Kategori & Pencarian sekaligus)
     * Mengubah Class HTML saja tanpa membuat/menghapus DOM nodes.
     */
    function gcsPromoSync() {
        let activeVisibleCount = 0;

        // Loop melalui seluruh voucher yang sudah dirender di HTML
        domElements.vouchers.forEach(voucher => {
            const voucherCategory = voucher.getAttribute('data-category');

            // Cek kondisi Kategori
            const matchCategory = (gcsPromoState.activeCategory === 'semua') || (voucherCategory === gcsPromoState.activeCategory);

            // Cek kondisi Pencarian (Mencari di dalam judul dan deskripsi)
            let matchSearch = true;
            if (gcsPromoState.searchQuery !== '') {
                const searchTargets = voucher.querySelectorAll('.gcsPromoSearchTarget');
                let textContent = '';
                searchTargets.forEach(el => textContent += el.textContent.toLowerCase() + ' ');

                matchSearch = textContent.includes(gcsPromoState.searchQuery);
            }

            // Tampilkan atau Sembunyikan Voucher berdasarkan hasil filter
            if (matchCategory && matchSearch) {
                voucher.classList.remove('gcsPromoHidden');
                activeVisibleCount++; // Tambah hitungan jika voucher tampil
            } else {
                voucher.classList.add('gcsPromoHidden');
            }
        });

        // Update Text Counter di Card Voucher Aktif
        gcsPromoUpdateCounter(activeVisibleCount);

        // Tampilkan/Sembunyikan Empty State
        gcsPromoToggleEmptyState(activeVisibleCount);
    }

    /**
     * Memperbarui teks pada elemen Card Active Voucher
     * @param {Number} count 
     */
    function gcsPromoUpdateCounter(count) {
        if (domElements.counterText) {
            domElements.counterText.textContent = `${count} Voucher`;
        }
    }

    /**
     * Tampilkan pesan jika tidak ada voucher yang lolos filter
     * @param {Number} count 
     */
    function gcsPromoToggleEmptyState(count) {
        if (domElements.emptyState) {
            if (count === 0) {
                domElements.emptyState.classList.remove('gcsPromoHidden');
            } else {
                domElements.emptyState.classList.add('gcsPromoHidden');
            }
        }
    }

    // Mengembalikan objek agar init bisa diakses dari luar closure
    return {
        init: gcsPromoInit,
        forceSync: gcsPromoSync // Expose jika ingin memicu sync dari script luar nantinya
    };

})();

// Eksekusi inisialisasi dengan aman setelah DOM dirender
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", GcsPromoEngine.init);
} else {
    GcsPromoEngine.init();
}