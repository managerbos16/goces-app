/**
 * GOCES PROMO PAGE CONTROLLER
 * Vanilla JavaScript
 * Tidak memproduksi HTML via JS (Sesuai Aturan)
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Inisialisasi Elemen
    const gcsPromoChips = document.querySelectorAll(".gcsPromoChip");
    const gcsPromoCards = document.querySelectorAll(".gcsPromoCard");
    const gcsPromoTotalCountEl = document.getElementById("gcsPromoTotalCount");
    const gcsPromoUseButtons = document.querySelectorAll(".gcsPromoUseBtn");

    /**
     * Fungsi 1: Update Jumlah Voucher
     * Menghitung dan menampilkan total card yang sedang terlihat 
     * (tidak memiliki class gcsPromoHidden) di layar saat ini.
     * Jika kategori "Semua" dipilih, angka otomatis menggabungkan seluruh voucher tersisa.
     */
    const gcsPromoUpdateCount = () => {
        let visibleCount = 0;
        gcsPromoCards.forEach(card => {
            if (!card.classList.contains("gcsPromoHidden")) {
                visibleCount++;
            }
        });
        gcsPromoTotalCountEl.textContent = visibleCount;
    };

    /**
     * Fungsi 2: Filter Voucher berdasarkan Kategori
     * Mengatur visibility card via penambahan/penghapusan class.
     */
    const gcsPromoFilterCards = (selectedCategory) => {
        gcsPromoCards.forEach(card => {
            // Cek apakah card memiliki class penanda dihapus secara logikal (voucher habis)
            const isDeleted = card.dataset.deleted === "true";

            if (isDeleted) {
                // Jika sudah habis/dihapus, biarkan tetap tersembunyi
                card.classList.add("gcsPromoHidden");
            } else {
                // Jika belum dihapus, filter berdasarkan kategori yang diklik
                const cardCategory = card.dataset.category;
                if (selectedCategory === "semua" || cardCategory === selectedCategory) {
                    card.classList.remove("gcsPromoHidden");
                } else {
                    card.classList.add("gcsPromoHidden");
                }
            }
        });

        // Selalu update total jumlah voucher setelah filter berubah
        gcsPromoUpdateCount();
    };

    /**
     * Fungsi 3: Event Delegation untuk Segmented Control (Kategori)
     */
    gcsPromoChips.forEach(chip => {
        chip.addEventListener("click", function () {
            // Hapus class active dari semua chip
            gcsPromoChips.forEach(c => c.classList.remove("gcsPromoActive"));
            // Tambahkan class active ke chip yang diklik
            this.classList.add("gcsPromoActive");

            const categoryTarget = this.dataset.category;
            gcsPromoFilterCards(categoryTarget);

            // Scroll chip agar rapi ke tengah saat ditekan (di perangkat mobile)
            this.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
    });

    /**
     * Fungsi 4: Simulasi Penggunaan Voucher & Penghapusan Voucher
     * - Mengurangi kuota pada UI.
     * - Jika kuota mencapai 0, hapus (sembunyikan) card, lalu update jumlah kategori 'Semua'.
     */
    gcsPromoUseButtons.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            // Temukan parent card terdekat dari tombol yang diklik
            const card = this.closest(".gcsPromoCard");
            const quotaTextElement = card.querySelector(".gcsPromoQuotaValue");

            // Ambil data kuota saat ini dari attribut dataset
            let currentQuota = parseInt(card.dataset.quota);

            if (currentQuota > 0) {
                currentQuota--; // Kurangi kuota
                card.dataset.quota = currentQuota; // Update dataset memori
                quotaTextElement.textContent = currentQuota; // Update UI Text

                // Efek visual sementara saat diklik
                btn.textContent = "Diproses...";
                setTimeout(() => {
                    btn.textContent = "Gunakan Sekarang";

                    // Jika voucher habis digunakan
                    if (currentQuota === 0) {
                        card.dataset.deleted = "true"; // Berikan tanda bahwa voucher telah dihapus/habis

                        // Mainkan efek fade out/scale menggunakan transisi yang sudah ada di CSS
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.9)";

                        // Sembunyikan sepenuhnya setelah transisi CSS selesai (250ms)
                        setTimeout(() => {
                            card.classList.add("gcsPromoHidden");
                            // Update Card Summary Angka secara realtime (sesuai Aturan GOCES)
                            gcsPromoUpdateCount();
                        }, 250);
                    }
                }, 400); // Simulasi delay jaringan (400ms)
            }
        });
    });

    // Inisialisasi hitungan pertama kali halaman dimuat (Semua kategori aktif)
    gcsPromoUpdateCount();
});