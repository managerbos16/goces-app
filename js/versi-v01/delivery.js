/**
 * GOCES DELIVERY BOTTOM SHEET COMPONENT SUBSYSTEM
 * FINAL VERSION: Fixed Android Back Button & Pull-to-Refresh
 */

let gcsDeliveryPopupIsDragging = false;
let gcsDeliveryPopupStartY = 0;
let gcsDeliveryPopupCurrentY = 0;
let gcsDeliveryPopupThreshold = 0;
let gcsDeliveryPopupPreviousFocus = null;

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsDeliveryPopupInit();

    // Listener untuk tombol Back Android
    window.addEventListener('popstate', function (event) {
        const overlay = document.getElementById("gcsDeliveryPopupOverlay");
        // Jika popup terlihat, tutup popup tanpa error
        if (overlay && overlay.classList.contains("gcsDeliveryPopupVisible")) {
            // Kita panggil close internal (tanpa memicu history.back lagi)
            hidePopupUI();
        }
    });
});

function gcsDeliveryPopupInit() {
    const overlay = document.getElementById("gcsDeliveryPopupOverlay");
    const backdrop = document.getElementById("gcsDeliveryPopupBackdrop");
    const sheet = document.getElementById("gcsDeliveryPopupSheet");
    const dragArea = document.getElementById("gcsDeliveryPopupDragArea");
    const serviceCard = document.getElementById("gcsDeliveryServiceCardId");

    if (!overlay || !sheet || !backdrop) return;

    // Click Backdrop
    backdrop.addEventListener("click", gcsDeliveryPopupClose);

    // Keyboard Control
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("gcsDeliveryPopupVisible")) {
            gcsDeliveryPopupClose();
        }
    });

    // Pointer Gestures (Drag to close)
    if (dragArea) {
        // PENTING: Gunakan { passive: false } agar preventDefault() berfungsi
        dragArea.addEventListener("pointerdown", (e) => {
            e.preventDefault(); // INI KUNCI UTAMA MENCEGAH RELOAD

            gcsDeliveryPopupIsDragging = true;
            gcsDeliveryPopupStartY = e.clientY;
            gcsDeliveryPopupCurrentY = 0;
            sheet.classList.add("gcsDeliveryPopupDragging");
            gcsDeliveryPopupThreshold = sheet.offsetHeight * 0.30; // Tutup jika ditarik 30%
            dragArea.setPointerCapture(e.pointerId);
        }, { passive: false });

        dragArea.addEventListener("pointermove", (e) => {
            if (!gcsDeliveryPopupIsDragging) return;
            const deltaY = e.clientY - gcsDeliveryPopupStartY;

            // Hanya izinkan tarik ke bawah
            if (deltaY > 0) {
                gcsDeliveryPopupCurrentY = deltaY;
                sheet.style.transform = `translateY(${gcsDeliveryPopupCurrentY}px)`;
            }
        }, { passive: true });

        const handleDragEnd = (e) => {
            if (!gcsDeliveryPopupIsDragging) return;
            gcsDeliveryPopupIsDragging = false;
            sheet.classList.remove("gcsDeliveryPopupDragging");
            dragArea.releasePointerCapture(e.pointerId);

            // Cek apakah tarikan cukup jauh untuk menutup
            if (gcsDeliveryPopupCurrentY > gcsDeliveryPopupThreshold) {
                gcsDeliveryPopupClose();
            } else {
                sheet.style.transform = ""; // Kembali ke posisi semula
            }
            gcsDeliveryPopupCurrentY = 0;
        };

        dragArea.addEventListener("pointerup", handleDragEnd);
        dragArea.addEventListener("pointercancel", handleDragEnd);
    }
}

// Fungsi Internal untuk menyembunyikan UI (Dipakai oleh Close & Back Button)
function hidePopupUI() {
    const overlay = document.getElementById("gcsDeliveryPopupOverlay");
    const sheet = document.getElementById("gcsDeliveryPopupSheet");
    if (overlay && sheet) {
        sheet.style.transform = "";
        overlay.classList.remove("gcsDeliveryPopupVisible");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (gcsDeliveryPopupPreviousFocus && gcsDeliveryPopupPreviousFocus.focus) {
            gcsDeliveryPopupPreviousFocus.focus();
        }
    }
}

// Open API Handler
window.gcsDeliveryPopupOpen = function () {
    const overlay = document.getElementById("gcsDeliveryPopupOverlay");
    const sheet = document.getElementById("gcsDeliveryPopupSheet");

    if (overlay && sheet) {
        gcsDeliveryPopupPreviousFocus = document.activeElement;
        sheet.style.transform = "";
        overlay.classList.add("gcsDeliveryPopupVisible");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Tambahkan state ke history agar tombol Back bisa menangkap event
        history.pushState({ popupOpen: true }, 'DeliveryPopup', '');
    }
};

// Close API Handler (dipanggil saat klik tutup atau drag)
window.gcsDeliveryPopupClose = function () {
    // Jika popup terlihat, kita "pop" state history agar tombol back kembali normal
    if (window.history.state && window.history.state.popupOpen) {
        history.back();
    } else {
        // Fallback jika tidak ada state
        hidePopupUI();
    }
};

window.openDelivery = function () {
    window.gcsDeliveryPopupClose();
    setTimeout(() => {
        window.location.href = "action://act/delivery";
    }, 240);
};