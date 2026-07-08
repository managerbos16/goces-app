/**
 * GOCES Activity Page Application Engine
 * Menerapkan standard arsitektur vanilla JS modular, performa render tinggi,
 * efisiensi repaint, serta isolasi namespace fungsional global.
 */

// Menjaga enkapsulasi dengan cakupan eksekusi lokal instan
(function () {
    "use strict";

    // State Manajemen Aplikasi
    const state = {
        activeTab: "cart",
        isAnimating: false,
        animationDuration: 250 // Sinkronisasi dengan var(--transition) CSS
    };

    // Ref DOM Cache Element Kunci untuk Optimasi Pemanggilan berulang
    let tabsListContainer = null;
    let mainContentContainer = null;

    /**
     * Inisialisasi Utama Aplikasi (gcsActivityInit)
     */
    function gcsActivityInit() {
        tabsListContainer = document.getElementById("gcsActivityTabsList");
        mainContentContainer = document.getElementById("gcsActivityMainContent");

        if (!tabsListContainer || !mainContentContainer) return;

        setupTabEventListeners();
        setupGlobalEventListeners();
    }

    /**
     * Konfigurasi Event Listeners menggunakan Event Delegation Berkinerja Tinggi
     */
    function setupTabEventListeners() {
        tabsListContainer.addEventListener("click", function (event) {
            const targetChip = event.target.closest(".gcsActivityTabChip");

            // Proteksi jika element bukan chip tab, sedang dalam animasi, atau mengklik tab yang sama aktif
            if (!targetChip || state.isAnimating || targetChip.classList.contains("gcsActivityActive")) {
                return;
            }

            const selectedTabId = targetChip.getAttribute("data-tab");
            if (selectedTabId) {
                gcsActivitySwitchTab(selectedTabId, targetChip);
            }
        });
    }

    /**
     * Manajemen Mekanisme Event Delegasi Global untuk Komponen Konten & Efek Ripple
     */
    function setupGlobalEventListeners() {
        // Event delegation pada area penampung konten utama
        mainContentContainer.addEventListener("click", function (event) {
            const element = event.target;

            // Deteksi penanganan aksi tombol placeholder
            const actionButton = element.closest(".gcsActivityButton");
            if (actionButton) {
                // Eksekusi Efek Visual Ripple native modern
                if (actionButton.getAttribute("data-ripple") === "true") {
                    createNativeRippleEffect(event, actionButton);
                }

                const actionType = actionButton.getAttribute("data-action");
                if (actionType) {
                    executePlaceholderAction(actionType);
                }
            }
        });
    }

    /**
     * Logika Perpindahan Tab Menggunakan Skema Transisi GPU Accelerated (gcsActivitySwitchTab)
     * @param {String} tabId - Target Pengenal Identitas Tab Terpilih
     * @param {HTMLElement} targetChipElement - Element Chip DOM yang Dipicu Aktif
     */
    function gcsActivitySwitchTab(tabId, targetChipElement) {
        state.isAnimating = true;

        // Mendapatkan referensi DOM Panel lama & baru
        const currentActivePanel = document.querySelector(`.gcsActivityTabPanel.gcsActivityShow`);
        const targetPanel = document.getElementById(`gcsActivityPanel${capitalizeFirstLetter(tabId)}`);

        // 1. Mutasi Visual State untuk Navigasi Header Tab (Sinkronous)
        document.querySelectorAll(".gcsActivityTabChip").forEach(chip => {
            chip.classList.remove("gcsActivityActive");
            chip.setAttribute("aria-selected", "false");
        });
        targetChipElement.classList.add("gcsActivityActive");
        targetChipElement.setAttribute("aria-selected", "true");

        // 2. Alur Animasi Fade & Transform Menggunakan requestAnimationFrame & Microtask Timers
        if (currentActivePanel) {
            // Memicu penurunan Opacity & Translasi posisi keluar
            currentActivePanel.style.opacity = "0";
            currentActivePanel.style.transform = "translateY(-6px)";

            setTimeout(() => {
                requestAnimationFrame(() => {
                    // Sembunyikan total panel lama
                    currentActivePanel.classList.remove("gcsActivityShow");
                    currentActivePanel.style.display = "none";

                    // Persiapkan visual dasar panel target masuk secara transparan
                    targetPanel.style.display = "flex";
                    targetPanel.style.opacity = "0";
                    targetPanel.style.transform = "translateY(6px)";

                    // Paksa Browser merefresh tata letak geometris (Reflow/Repaint optimization)
                    void targetPanel.offsetWidth;

                    // Picu rendering penampakan visual transisi masuk
                    requestAnimationFrame(() => {
                        targetPanel.classList.add("gcsActivityShow");
                        targetPanel.style.opacity = "1";
                        targetPanel.style.transform = "translateY(0)";

                        state.activeTab = tabId;
                        state.isAnimating = false;
                    });
                });
            }, state.animationDuration);
        } else {
            // Fallback penanganan langsung jika panel aktif awal tidak terdeteksi
            if (targetPanel) {
                targetPanel.classList.add("gcsActivityShow");
                targetPanel.style.display = "flex";
                targetPanel.style.opacity = "1";
                targetPanel.style.transform = "translateY(0)";
            }
            state.activeTab = tabId;
            state.isAnimating = false;
        }
    }

    /**
     * Penciptaan Efek Riak Gelombang Sentuh Modern (Native Ripple Dynamic Layer)
     * @param {Event} event - Objek Pointer Koordinat Mouse/Sentuhan
     * @param {HTMLElement} buttonElement - Target Kontainer Tempat Efek Diberikan
     */
    function createNativeRippleEffect(event, buttonElement) {
        const circle = document.createElement("span");
        const diameter = Math.max(buttonElement.clientWidth, buttonElement.clientHeight);
        const radius = diameter / 2;

        const boundingClient = buttonElement.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - boundingClient.left - radius}px`;
        circle.style.top = `${event.clientY - boundingClient.top - radius}px`;
        circle.classList.add("gcsActivityRipple");

        // Menghapus inkarnasi ripple lama jika masih melekat akibat spamming
        const oldRipple = buttonElement.querySelector(".gcsActivityRipple");
        if (oldRipple) {
            oldRipple.remove();
        }

        buttonElement.appendChild(circle);
    }

    /**
     * Eksekutor Fungsi Aksi Placeholder Sistem Sesuai Permintaan Spesifikasi
     * @param {String} actionName - Nama fungsi tujuan panggilan balik internal
     */
    function executePlaceholderAction(actionName) {
        if (actionName === "openPurchaseHistory") {
            openPurchaseHistory();
        } else if (actionName === "openBalanceHistory") {
            openBalanceHistory();
        }
    }

    /**
     * Fungsi Placeholder Manajemen Alur Riwayat Pembelian (openPurchaseHistory)
     */
    function openPurchaseHistory() {
        console.log("[GOCES Bridge]: Membuka gerbang aktivitas riwayat pembelian...");
        alert("Fungsi openPurchaseHistory(): Menghubungkan Anda ke repositori riwayat transaksi internal GOCES...");
    }

    /**
     * Fungsi Placeholder Manajemen Alur Riwayat Dompet/Saldo (openBalanceHistory)
     */
    function openBalanceHistory() {
        console.log("[GOCES Bridge]: Membuka gerbang aktivitas riwayat saldo GOCESPay...");
        alert("Fungsi openBalanceHistory(): Menampilkan mutasi transaksi lengkap GOCESPay Wallet Anda...");
    }

    /**
     * Helper String: Mengubah huruf awal karakter menjadi Kapital
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Melakukan pemicuan inisialisasi dokumen saat DOM Pohon telah siap diproses secara optimal
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", gcsActivityInit);
    } else {
        gcsActivityInit();
    }

})();