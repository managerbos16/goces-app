/**
 * GOCES BOTTOM SHEET (iOS Style) CONTROLLER
 * Vanilla JavaScript
 */

// Prefix Data
let gcsRidePopupIsDragging = false;
let gcsRidePopupStartY = 0;
let gcsRidePopupCurrentY = 0;
let gcsRidePopupThreshold = 0; // Batas 30% dari tinggi modal

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsRidePopupInit();
});

// Inisialisasi Event Listener
function gcsRidePopupInit() {
    const overlay = document.getElementById("gcsRidePopupOverlay");
    const backdrop = document.getElementById("gcsRidePopupBackdrop");
    const sheet = document.getElementById("gcsRidePopupSheet");
    const dragArea = document.getElementById("gcsRidePopupDragArea");
    const buttons = document.querySelectorAll(".gcsRidePopupButton");

    if (!overlay || !sheet || !backdrop) return;

    // 1. Event Klik Backdrop untuk menutup
    backdrop.addEventListener("click", gcsRidePopupClose);

    // 2. Event Tombol ESC Keyboard
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("gcsRidePopupVisible")) {
            gcsRidePopupClose();
        }
    });

    // 3. Pointer Events (Drag gesture mouse & sentuhan)
    // Menggunakan pointer events agar mendukung Desktop dan Mobile bersamaan
    dragArea.addEventListener("pointerdown", (e) => {
        gcsRidePopupIsDragging = true;
        gcsRidePopupStartY = e.clientY;
        gcsRidePopupCurrentY = 0;

        // Matikan CSS transisi agar gerakan drag responsif tanpa lag
        sheet.classList.add("gcsRidePopupDragging");
        gcsRidePopupThreshold = sheet.offsetHeight * 0.3; // Hitung 30% dari tinggi

        // Tangkap kursor pada elemen
        dragArea.setPointerCapture(e.pointerId);
    });

    dragArea.addEventListener("pointermove", (e) => {
        if (!gcsRidePopupIsDragging) return;

        const deltaY = e.clientY - gcsRidePopupStartY;

        // Hanya izinkan ditarik ke Bawah (angka positif)
        if (deltaY > 0) {
            gcsRidePopupCurrentY = deltaY;
            sheet.style.transform = `translateY(${gcsRidePopupCurrentY}px)`;
        }
    });

    const endDrag = (e) => {
        if (!gcsRidePopupIsDragging) return;
        gcsRidePopupIsDragging = false;

        // Kembalikan CSS Transisi untuk animasi pantulan / tutup
        sheet.classList.remove("gcsRidePopupDragging");
        dragArea.releasePointerCapture(e.pointerId);

        // Cek jika ditarik melewati 30% batas
        if (gcsRidePopupCurrentY > gcsRidePopupThreshold) {
            gcsRidePopupClose();
        } else {
            // Kembali ke posisi semula
            sheet.style.transform = "";
        }
        gcsRidePopupCurrentY = 0;
    };

    dragArea.addEventListener("pointerup", endDrag);
    dragArea.addEventListener("pointercancel", endDrag);

    // 4. Injeksi Efek Sentuhan / Ripple ke Tombol
    buttons.forEach(btn => {
        btn.addEventListener("pointerdown", function (e) {
            const ripple = document.createElement("span");
            ripple.classList.add("gcsRidePopupRipple");

            const diameter = Math.max(btn.clientWidth, btn.clientHeight);
            const radius = diameter / 2;

            const rect = btn.getBoundingClientRect();
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;

            btn.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 500);
        });
    });
}

// Fungsi Buka Modal (Public)
window.gcsRidePopupOpen = function () {
    const overlay = document.getElementById("gcsRidePopupOverlay");
    const sheet = document.getElementById("gcsRidePopupSheet");
    if (overlay && sheet) {
        // Reset transform bekas drag
        sheet.style.transform = "";
        overlay.classList.add("gcsRidePopupVisible");

        // Mencegah background di belakang scroll saat modal terbuka
        document.body.style.overflow = "hidden";
    }
};

// Fungsi Tutup Modal (Public)
window.gcsRidePopupClose = function () {
    const overlay = document.getElementById("gcsRidePopupOverlay");
    const sheet = document.getElementById("gcsRidePopupSheet");
    if (overlay && sheet) {
        // Hapus style custom drag inline dan lepaskan kelas aktif
        sheet.style.transform = "";
        overlay.classList.remove("gcsRidePopupVisible");

        // Kembalikan kemampuan scroll dokumen
        document.body.style.overflow = "";
    }
};