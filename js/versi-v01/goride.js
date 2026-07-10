/**
 * GOCES GO RIDE BOTTOM SHEET COMPONENT SUBSYSTEM
 * FINAL VERSION: Fixed Android Back Button & Pull-to-Refresh
 */

let gcsRidePopupIsDragging = false;
let gcsRidePopupStartY = 0;
let gcsRidePopupCurrentY = 0;
let gcsRidePopupThreshold = 0;
let gcsRidePopupPreviousFocus = null;

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsRidePopupInit();

    // Listener untuk tombol Back Android
    window.addEventListener('popstate', function (event) {
        const overlay = document.getElementById("gcsRidePopupOverlay");
        if (overlay && overlay.classList.contains("gcsRidePopupVisible")) {
            hideRidePopupUI();
        }
    });
});

function gcsRidePopupInit() {
    const overlay = document.getElementById("gcsRidePopupOverlay");
    const backdrop = document.getElementById("gcsRidePopupBackdrop");
    const sheet = document.getElementById("gcsRidePopupSheet");
    const dragArea = document.getElementById("gcsRidePopupDragArea");

    if (!overlay || !sheet || !backdrop) return;

    backdrop.addEventListener("click", window.gcsRidePopupClose);

    // Keyboard Control
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("gcsRidePopupVisible")) {
            window.gcsRidePopupClose();
        }
    });

    // Pointer Gestures (Drag to close)
    if (dragArea) {
        dragArea.addEventListener("pointerdown", (e) => {
            gcsRidePopupIsDragging = true;
            gcsRidePopupStartY = e.clientY;
            gcsRidePopupCurrentY = 0;
            sheet.classList.add("gcsRidePopupDragging");
            gcsRidePopupThreshold = sheet.offsetHeight * 0.30;
            dragArea.setPointerCapture(e.pointerId);
        }, { passive: false });

        dragArea.addEventListener("pointermove", (e) => {
            if (!gcsRidePopupIsDragging) return;
            const deltaY = e.clientY - gcsRidePopupStartY;
            if (deltaY > 0) {
                gcsRidePopupCurrentY = deltaY;
                sheet.style.transform = `translateY(${gcsRidePopupCurrentY}px)`;
            }
        }, { passive: true });

        const handleDragEnd = (e) => {
            if (!gcsRidePopupIsDragging) return;
            gcsRidePopupIsDragging = false;
            sheet.classList.remove("gcsRidePopupDragging");
            dragArea.releasePointerCapture(e.pointerId);

            if (gcsRidePopupCurrentY > gcsRidePopupThreshold) {
                window.gcsRidePopupClose();
            } else {
                sheet.style.transform = "";
            }
            gcsRidePopupCurrentY = 0;
        };

        dragArea.addEventListener("pointerup", handleDragEnd);
        dragArea.addEventListener("pointercancel", handleDragEnd);
    }
}

// Internal Helper untuk menyembunyikan UI
function hideRidePopupUI() {
    const overlay = document.getElementById("gcsRidePopupOverlay");
    const sheet = document.getElementById("gcsRidePopupSheet");
    if (overlay && sheet) {
        sheet.style.transform = "";
        overlay.classList.remove("gcsRidePopupVisible");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (gcsRidePopupPreviousFocus && gcsRidePopupPreviousFocus.focus) {
            gcsRidePopupPreviousFocus.focus();
        }
    }
}

// Open API Handler
window.gcsRidePopupOpen = function () {
    const overlay = document.getElementById("gcsRidePopupOverlay");
    const sheet = document.getElementById("gcsRidePopupSheet");

    if (overlay && sheet) {
        gcsRidePopupPreviousFocus = document.activeElement;
        sheet.style.transform = "";
        overlay.classList.add("gcsRidePopupVisible");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Tambahkan state ke history agar tombol Back bisa menangkap event
        history.pushState({ popupOpen: true }, 'RidePopup', '');
    }
};

// Close API Handler
window.gcsRidePopupClose = function () {
    if (window.history.state && window.history.state.popupOpen) {
        history.back(); // Kembali ke state sebelum popup dibuka
    } else {
        hideRidePopupUI();
    }
};

// Routing logic
window.openRide = function () {
    window.gcsRidePopupClose();
    setTimeout(() => {
        window.location.href = "action://act/goride";
    }, 240);
};