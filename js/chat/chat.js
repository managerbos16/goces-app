/**
 * GOCES Chat Page Logic
 * Menerapkan arsitektur Vanilla JS yang modular, Event Delegation, 
 * dan Optimasi Repaint/Rendering dengan standar performa tinggi.
 */

const GcsChatEngine = (function () {
    "use strict";

    // Cache referensi DOM utama untuk menghindari query berulang
    let gcsChatMainContainer = null;

    /**
     * Inisialisasi Utama
     */
    function gcsChatInit() {
        gcsChatMainContainer = document.getElementById("gcsChatMainArea");

        if (!gcsChatMainContainer) return;

        // Menggunakan Event Delegation tunggal pada container utama
        gcsChatMainContainer.addEventListener("click", gcsChatHandleInteractions);
    }

    /**
     * Manajemen Interaksi Terpusat (Event Delegation)
     * @param {Event} event 
     */
    function gcsChatHandleInteractions(event) {
        // Cari elemen terdekat yang memiliki atribut data-action
        const targetElement = event.target.closest("[data-action]");

        if (targetElement) {
            // Jalankan animasi Ripple untuk visual feedback
            requestAnimationFrame(() => {
                gcsChatRenderRipple(event, targetElement);
            });

            // Eksekusi fungsi berdasarkan action
            const actionType = targetElement.getAttribute("data-action");
            gcsChatRouteAction(actionType);
        }
    }

    /**
     * Router Aksi Placeholder
     * @param {String} action 
     */
    function gcsChatRouteAction(action) {
        switch (action) {
            case "gcsChatOpenInbox":
                gcsChatOpenInbox();
                break;
            case "gcsChatOpenCs":
                gcsChatOpenCs();
                break;
            case "gcsChatOpenHelp":
                gcsChatOpenHelp();
                break;
            case "gcsChatOpenAi":
                gcsChatOpenAi();
                break;
            default:
                console.warn("[GOCES Chat] Action tidak dikenali:", action);
        }
    }

    /**
     * Render Animasi Gelombang Sentuh (Ripple Effect)
     * @param {Event} e - Pointer Event
     * @param {HTMLElement} element - Target container ripple
     */
    function gcsChatRenderRipple(e, element) {
        // Hapus ripple lama agar tidak menumpuk di DOM
        const oldRipple = element.querySelector(".gcsChatRipple");
        if (oldRipple) {
            oldRipple.remove();
        }

        const circle = document.createElement("span");
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        const rect = element.getBoundingClientRect();

        // Hitung koordinat klik (support mouse dan touch event)
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || rect.left + radius;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || rect.top + radius;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${clientX - rect.left - radius}px`;
        circle.style.top = `${clientY - rect.top - radius}px`;
        circle.classList.add("gcsChatRipple");

        element.appendChild(circle);

        // Hapus element dari DOM setelah animasi selesai (0.6s)
        setTimeout(() => {
            if (circle.parentNode === element) {
                circle.remove();
            }
        }, 600);
    }

    /**
     * Placeholder Functions untuk Navigasi Layanan GOCES
     */
    function gcsChatOpenInbox() {
        console.log("Mengeksekusi gcsChatOpenInbox()...");
        // alert("Membuka halaman Inbox Notifikasi...");
    }

    function gcsChatOpenCs() {
        console.log("Mengeksekusi gcsChatOpenCs()...");
        // alert("Menghubungkan ke Customer Service GOCES...");
    }

    function gcsChatOpenHelp() {
        console.log("Mengeksekusi gcsChatOpenHelp()...");
        // alert("Membuka Pusat Bantuan...");
    }

    function gcsChatOpenAi() {
        console.log("Mengeksekusi gcsChatOpenAi()...");
        // alert("Memulai sesi obrolan dengan GOCES AI Assistant...");
    }

    // Mengembalikan method inisialisasi agar bisa dipanggil saat DOM siap
    return {
        init: gcsChatInit
    };

})();

// Eksekusi inisialisasi saat struktur DOM HTML telah selesai di-load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", GcsChatEngine.init);
} else {
    GcsChatEngine.init();
}