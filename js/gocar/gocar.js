/**
 * GOCES GO CAR BOTTOM SHEET COMPONENT SUBSYSTEM
 * Independent Core Controller Framework
 */

let gcsCarPopupIsDragging = false;
let gcsCarPopupStartY = 0;
let gcsCarPopupCurrentY = 0;
let gcsCarPopupThreshold = 0;
let gcsCarPopupPreviousFocus = null;

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsCarPopupInit();
});

function gcsCarPopupInit() {
    const overlay = document.getElementById("gcsCarPopupOverlay");
    const backdrop = document.getElementById("gcsCarPopupBackdrop");
    const sheet = document.getElementById("gcsCarPopupSheet");
    const dragArea = document.getElementById("gcsCarPopupDragArea");
    const serviceCard = document.getElementById("gcsCarServiceCardId");

    if (!overlay || !sheet || !backdrop) return;

    // 1. Click Backdrop Event Handler
    backdrop.addEventListener("click", gcsCarPopupClose);

    // 2. Keyboard Control (Escape & Enter Access)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("gcsCarPopupVisible")) {
            gcsCarPopupClose();
        }
    });

    if (serviceCard) {
        serviceCard.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openCar();
            }
        });

        // Action routing via click listener
        serviceCard.addEventListener("click", (e) => {
            openCar();
        });
    }

    // 3. Pointer Gestures Engine (Mice, Pens, Touch interfaces tracking)
    dragArea.addEventListener("pointerdown", (e) => {
        gcsCarPopupIsDragging = true;
        gcsCarPopupStartY = e.clientY;
        gcsCarPopupCurrentY = 0;

        sheet.classList.add("gcsCarPopupDragging");
        gcsCarPopupThreshold = sheet.offsetHeight * 0.30; // 30% drag boundary

        dragArea.setPointerCapture(e.pointerId);
    }, { passive: false });

    dragArea.addEventListener("pointermove", (e) => {
        if (!gcsCarPopupIsDragging) return;

        const deltaY = e.clientY - gcsCarPopupStartY;

        if (deltaY > 0) {
            gcsCarPopupCurrentY = deltaY;
            // Native micro-frame translation engine running smoothly
            sheet.style.transform = `translateY(${gcsCarPopupCurrentY}px)`;
        }
    }, { passive: true });

    const handleDragEnd = (e) => {
        if (!gcsCarPopupIsDragging) return;
        gcsCarPopupIsDragging = false;

        sheet.classList.remove("gcsCarPopupDragging");
        dragArea.releasePointerCapture(e.pointerId);

        if (gcsCarPopupCurrentY > gcsCarPopupThreshold) {
            gcsCarPopupClose();
        } else {
            sheet.style.transform = "";
        }
        gcsCarPopupCurrentY = 0;
    };

    dragArea.addEventListener("pointerup", handleDragEnd);
    dragArea.addEventListener("pointercancel", handleDragEnd);

    // 4. Interactive Tactile Feedback Engine (Ripple overlay)
    if (serviceCard) {
        serviceCard.addEventListener("pointerdown", function (e) {
            const ripple = document.createElement("span");
            ripple.classList.add("gcsCarPopupRipple");

            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;
            const rect = this.getBoundingClientRect();

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;

            this.appendChild(ripple);

            ripple.addEventListener("animationend", () => ripple.remove());
        });
    }
}

// Open API Handler
window.gcsCarPopupOpen = function () {
    const overlay = document.getElementById("gcsCarPopupOverlay");
    const sheet = document.getElementById("gcsCarPopupSheet");
    const serviceCard = document.getElementById("gcsCarServiceCardId");

    if (overlay && sheet) {
        gcsCarPopupPreviousFocus = document.activeElement; // Track standard structural frame focus
        sheet.style.transform = "";
        overlay.classList.add("gcsCarPopupVisible");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Scroll Lock on

        // Focus isolation placement for clear structural visibility
        requestAnimationFrame(() => {
            if (serviceCard) serviceCard.focus();
        });
    }
};

// Close API Handler
window.gcsCarPopupClose = function () {
    const overlay = document.getElementById("gcsCarPopupOverlay");
    const sheet = document.getElementById("gcsCarPopupSheet");

    if (overlay && sheet) {
        sheet.style.transform = "";
        overlay.classList.remove("gcsCarPopupVisible");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Scroll Lock off

        if (gcsCarPopupPreviousFocus && gcsCarPopupPreviousFocus.focus) {
            gcsCarPopupPreviousFocus.focus();
        }
    }
};

// Routing logic function
window.openCar = function () {
    gcsCarPopupClose();

    // Exact timeout syncing parameters for premium native presentation routing flow
    setTimeout(() => {
        window.location.href = "action://act/car";
    }, 240);
};