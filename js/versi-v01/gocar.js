/**
 * GOCES GO CAR BOTTOM SHEET COMPONENT SUBSYSTEM
 * FINAL VERSION: Fixed Android Back Button & Pull-to-Refresh
 */

let gcsCarPopupIsDragging = false;
let gcsCarPopupStartY = 0;
let gcsCarPopupCurrentY = 0;
let gcsCarPopupThreshold = 0;
let gcsCarPopupPreviousFocus = null;

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsCarPopupInit();

    // Listener untuk tombol Back Android
    window.addEventListener('popstate', function (event) {
        const overlay = document.getElementById("gcsCarPopupOverlay");
        if (overlay && overlay.classList.contains("gcsCarPopupVisible")) {
            hideCarPopupUI();
        }
    });
});

function gcsCarPopupInit() {
    const overlay = document.getElementById("gcsCarPopupOverlay");
    const backdrop = document.getElementById("gcsCarPopupBackdrop");
    const sheet = document.getElementById("gcsCarPopupSheet");
    const dragArea = document.getElementById("gcsCarPopupDragArea");

    if (!overlay || !sheet || !backdrop) return;

    backdrop.addEventListener("click", window.gcsCarPopupClose);

    // Keyboard Control
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("gcsCarPopupVisible")) {
            window.gcsCarPopupClose();
        }
    });

    // Pointer Gestures (Drag to close)
    if (dragArea) {
        dragArea.addEventListener("pointerdown", (e) => {
            gcsCarPopupIsDragging = true;
            gcsCarPopupStartY = e.clientY;
            gcsCarPopupCurrentY = 0;
            sheet.classList.add("gcsCarPopupDragging");
            gcsCarPopupThreshold = sheet.offsetHeight * 0.30;
            dragArea.setPointerCapture(e.pointerId);
        }, { passive: false });

        dragArea.addEventListener("pointermove", (e) => {
            if (!gcsCarPopupIsDragging) return;
            const deltaY = e.clientY - gcsCarPopupStartY;
            if (deltaY > 0) {
                gcsCarPopupCurrentY = deltaY;
                sheet.style.transform = `translateY(${gcsCarPopupCurrentY}px)`;
            }
        }, { passive: true });

        const handleDragEnd = (e) => {
            if (!gcsCarPopupIsDragging) return;
            gcsCarPopupIsDragging = false;
            sheet.classList.remove("gcsCarPopupDragging");
            dragArea.releasePointerCapture(e.pointerId);

            if (gcsCarPopupCurrentY > gcsCarPopupThreshold) {
                window.gcsCarPopupClose();
            } else {
                sheet.style.transform = "";
            }
            gcsCarPopupCurrentY = 0;
        };

        dragArea.addEventListener("pointerup", handleDragEnd);
        dragArea.addEventListener("pointercancel", handleDragEnd);
    }
}

// Internal Helper untuk menutup UI
function hideCarPopupUI() {
    const overlay = document.getElementById("gcsCarPopupOverlay");
    const sheet = document.getElementById("gcsCarPopupSheet");
    if (overlay && sheet) {
        sheet.style.transform = "";
        overlay.classList.remove("gcsCarPopupVisible");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (gcsCarPopupPreviousFocus && gcsCarPopupPreviousFocus.focus) {
            gcsCarPopupPreviousFocus.focus();
        }
    }
}

// Open API Handler
window.gcsCarPopupOpen = function () {
    const overlay = document.getElementById("gcsCarPopupOverlay");
    const sheet = document.getElementById("gcsCarPopupSheet");

    if (overlay && sheet) {
        gcsCarPopupPreviousFocus = document.activeElement;
        sheet.style.transform = "";
        overlay.classList.add("gcsCarPopupVisible");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Tambahkan state ke history agar tombol Back bisa menangkap event
        history.pushState({ popupOpen: true }, 'CarPopup', '');
    }
};

// Close API Handler
window.gcsCarPopupClose = function () {
    if (window.history.state && window.history.state.popupOpen) {
        history.back(); // Kembali ke state sebelum popup dibuka
    } else {
        hideCarPopupUI();
    }
};

// Routing logic
window.openCar = function () {
    window.gcsCarPopupClose();
    setTimeout(() => {
        window.location.href = "action://act/gocar";
    }, 240);
};