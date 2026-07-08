/**
 * GOCES Profile Page Application Engine
 * Vanilla JS, Modular, High Performance (Event Delegation, Repaint Optimization).
 * Seluruh prefix eksklusif: gcsProfile
 */

const GcsProfileApp = (function () {
    "use strict";

    // DOM Cache References
    let gcsProfileMainContainer = null;

    /**
     * Inisialisasi Utama Aplikasi Profil
     */
    function gcsProfileInit() {
        gcsProfileMainContainer = document.getElementById("gcsProfileMainArea");

        // Setup Event Delegation untuk seluruh aksi di area utama
        if (gcsProfileMainContainer) {
            gcsProfileMainContainer.addEventListener("click", gcsProfileHandleInteractions);
        }

        // Khusus Header Buttons
        const headerButtons = document.querySelectorAll(".gcsProfileHeaderRight button");
        headerButtons.forEach(btn => {
            btn.addEventListener("click", gcsProfileHandleInteractions);
        });
    }

    /**
     * Handler Interaksi Terpusat via Event Delegation
     * @param {Event} event 
     */
    function gcsProfileHandleInteractions(event) {
        const targetElement = event.target.closest("[data-action]");

        if (targetElement) {
            // Render Efek Ripple (Visual Feedback)
            requestAnimationFrame(() => {
                gcsProfileCreateRipple(event, targetElement);
            });

            // Eksekusi fungsi spesifik
            const actionType = targetElement.getAttribute("data-action");
            gcsProfileRouteAction(actionType);
        }
    }

    /**
     * Router Aksi untuk memanggil fungsi placeholder
     * @param {String} action 
     */
    function gcsProfileRouteAction(action) {
        switch (action) {
            // Header
            case "gcsProfileOpenLevel": gcsProfileOpenLevel(); break;
            case "gcsProfileOpenSetting": gcsProfileOpenSetting(); break;

            // Profile & Balance
            case "gcsProfileOpenDetail": gcsProfileOpenDetail(); break;
            case "gcsProfileOpenWallet": gcsProfileOpenWallet(); break;
            case "gcsProfileOpenPoints": gcsProfileOpenPoints(); break;

            // Section 1: Pembayaran
            case "gcsProfileOpenGocesPay": gcsProfileOpenPayment("GOCESPay"); break;
            case "gcsProfileOpenPaylater": gcsProfileOpenPayment("GOCESPay Later"); break;
            case "gcsProfileOpenPaymentMethod": gcsProfileOpenPayment("Metode Pembayaran"); break;

            // Section 2: Kemitraan
            case "gcsProfileOpenDriver": gcsProfileOpenDriver(); break;
            case "gcsProfileOpenMerchant": gcsProfileOpenMerchant(); break;

            // Section 3: Keamanan
            case "gcsProfileVerifyEmail": gcsProfileVerifySecurity("Email"); break;
            case "gcsProfileVerifyPhone": gcsProfileVerifySecurity("Phone"); break;

            // Section 4: Program
            case "gcsProfileOpenReferral": gcsProfileOpenReferral(); break;
            case "gcsProfileOpenRewards": gcsProfileOpenRewards(); break;
            case "gcsProfileOpenPromo": gcsProfileOpenPromo(); break;

            // Section 5 & 6: Bantuan dan Tentang
            case "gcsProfileOpenHelpCenter": gcsProfileOpenHelp(); break;
            case "gcsProfileOpenContactUs": gcsProfileOpenContactUs(); break;
            case "gcsProfileOpenFaq": gcsProfileOpenFaq(); break;
            case "gcsProfileOpenPrivacy": gcsProfileOpenAbout("Privacy"); break;
            case "gcsProfileOpenTOS": gcsProfileOpenAbout("TOS"); break;
            case "gcsProfileOpenRating": gcsProfileOpenRating(); break;

            // Section 7: Logout
            case "gcsProfileLogout": gcsProfileLogout(); break;

            default:
                console.warn("[GOCES Profile] Aksi tidak terdaftar:", action);
        }
    }

    /**
     * Membuat Efek Ripple Sentuhan (Optimasi Repaint)
     * @param {Event} e 
     * @param {HTMLElement} element 
     */
    function gcsProfileCreateRipple(e, element) {
        const oldRipple = element.querySelector(".gcsProfileRipple");
        if (oldRipple) oldRipple.remove();

        const circle = document.createElement("span");
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        const rect = element.getBoundingClientRect();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || rect.left + radius;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || rect.top + radius;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${clientX - rect.left - radius}px`;
        circle.style.top = `${clientY - rect.top - radius}px`;
        circle.classList.add("gcsProfileRipple");

        element.appendChild(circle);

        setTimeout(() => {
            if (circle.parentNode === element) circle.remove();
        }, 500);
    }

    /**
     * PLACEHOLDER FUNCTIONS (Sesuai Permintaan)
     */
    function gcsProfileOpenLevel() { console.log("Membuka Level Akun..."); }
    function gcsProfileOpenSetting() { console.log("Membuka Pengaturan..."); }
    function gcsProfileOpenDetail() { console.log("Membuka Detail Profil..."); }
    function gcsProfileOpenWallet() { console.log("Membuka Saldo GOCESPay..."); }
    function gcsProfileOpenPoints() { console.log("Membuka Poin Pembelian..."); }

    function gcsProfileOpenPayment(type) { console.log("Membuka Pembayaran:", type); }
    function gcsProfileOpenDriver() { console.log("Membuka Pendaftaran Driver..."); }
    function gcsProfileOpenMerchant() { console.log("Membuka Pendaftaran Mitra..."); }
    function gcsProfileVerifySecurity(type) { console.log("Verifikasi Keamanan:", type); }

    function gcsProfileOpenReferral() { console.log("Membuka Program Referral..."); }
    function gcsProfileOpenRewards() { console.log("Membuka Program Hadiah..."); }
    function gcsProfileOpenPromo() { console.log("Membuka Promo Saya..."); }

    function gcsProfileOpenHelp() { console.log("Membuka Pusat Bantuan..."); }
    function gcsProfileOpenContactUs() { console.log("Membuka Hubungi Kami..."); }
    function gcsProfileOpenFaq() { console.log("Membuka FAQ..."); }

    function gcsProfileOpenAbout(type) { console.log("Membuka Info Tentang:", type); }
    function gcsProfileOpenRating() { console.log("Membuka Rating Aplikasi..."); }

    /**
     * Fungsi Konfirmasi Logout
     */
    function gcsProfileLogout() {
        const isConfirmed = confirm("Apakah Anda yakin ingin keluar dari akun GOCES?");
        if (isConfirmed) {
            console.log("Memproses Logout...");
            // Logika penghapusan sesi atau redirect ke login
            // window.location.href = "login.html";
        }
    }

    return {
        init: gcsProfileInit
    };

})();

// Mount inisialisasi pada siklus hidup DOM
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", GcsProfileApp.init);
} else {
    GcsProfileApp.init();
}