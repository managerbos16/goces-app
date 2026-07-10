/**
 * GOCES DELIVERY BOTTOM SHEET COMPONENT SUBSYSTEM
 * Independent Core Controller Framework
 */

let gcsDeliveryPopupIsDragging = false;
let gcsDeliveryPopupStartY = 0;
let gcsDeliveryPopupCurrentY = 0;
let gcsDeliveryPopupThreshold = 0;
let gcsDeliveryPopupPreviousFocus = null;

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsDeliveryPopupInit();
});

function gcsDeliveryPopupInit() {
    const overlay = document.getElementById("gcsDeliveryPopupOverlay");
    const backdrop = document.getElementById("gcsDeliveryPopupBackdrop");
    const sheet = document.getElementById("gcsDeliveryPopupSheet");
    const dragArea = document.getElementById("gcsDeliveryPopupDragArea");
    const serviceCard = document.getElementById("gcsDeliveryServiceCardId");

    if (!overlay || !sheet || !backdrop) return;

    // 1. Click Backdrop Event Handler
    backdrop.addEventListener("click", gcsDeliveryPopupClose);

    // 2. Keyboard Control (Escape & Enter Access)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("gcsDeliveryPopupVisible")) {
            gcsDeliveryPopupClose();
        }
    });

    if (serviceCard) {
        serviceCard.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openDelivery();
            }
        });

        // Action routing via click listener
        serviceCard.addEventListener("click", (e) => {
            openDelivery();
        });
    }

    // 3. Pointer Gestures Engine (Mice, Pens, Touch interfaces tracking)
    dragArea.addEventListener("pointerdown", (e) => {
        gcsDeliveryPopupIsDragging = true;
        gcsDeliveryPopupStartY = e.clientY;
        gcsDeliveryPopupCurrentY = 0;

        sheet.classList.add("gcsDeliveryPopupDragging");
        gcsDeliveryPopupThreshold = sheet.offsetHeight * 0.30; // 30% drag boundary

        dragArea.setPointerCapture(e.pointerId);
    }, { passive: false });

    dragArea.addEventListener("pointermove", (e) => {
        if (!gcsDeliveryPopupIsDragging) return;

        const deltaY = e.clientY - gcsDeliveryPopupStartY;

        if (deltaY > 0) {
            gcsDeliveryPopupCurrentY = deltaY;
            // Native micro-frame translation engine running smoothly
            sheet.style.transform = `translateY(${gcsDeliveryPopupCurrentY}px)`;
        }
    }, { passive: true });

    const handleDragEnd = (e) => {
        if (!gcsDeliveryPopupIsDragging) return;
        gcsDeliveryPopupIsDragging = false;

        sheet.classList.remove("gcsDeliveryPopupDragging");
        dragArea.releasePointerCapture(e.pointerId);

        if (gcsDeliveryPopupCurrentY > gcsDeliveryPopupThreshold) {
            gcsDeliveryPopupClose();
        } else {
            sheet.style.transform = "";
        }
        gcsDeliveryPopupCurrentY = 0;
    };

    dragArea.addEventListener("pointerup", handleDragEnd);
    dragArea.addEventListener("pointercancel", handleDragEnd);

    // 4. Interactive Tactile Feedback Engine (Ripple overlay)
    if (serviceCard) {
        serviceCard.addEventListener("pointerdown", function (e) {
            const ripple = document.createElement("span");
            ripple.classList.add("gcsDeliveryPopupRipple");

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
window.gcsDeliveryPopupOpen = function () {
    const overlay = document.getElementById("gcsDeliveryPopupOverlay");
    const sheet = document.getElementById("gcsDeliveryPopupSheet");
    const serviceCard = document.getElementById("gcsDeliveryServiceCardId");

    if (overlay && sheet) {
        gcsDeliveryPopupPreviousFocus = document.activeElement; // Track standard structural frame focus
        sheet.style.transform = "";
        overlay.classList.add("gcsDeliveryPopupVisible");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Scroll Lock on

        // Focus isolation placement for clear structural visibility
        requestAnimationFrame(() => {
            if (serviceCard) serviceCard.focus();
        });
    }
};

// Close API Handler
window.gcsDeliveryPopupClose = function () {
    const overlay = document.getElementById("gcsDeliveryPopupOverlay");
    const sheet = document.getElementById("gcsDeliveryPopupSheet");

    if (overlay && sheet) {
        sheet.style.transform = "";
        overlay.classList.remove("gcsDeliveryPopupVisible");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Scroll Lock off

        if (gcsDeliveryPopupPreviousFocus && gcsDeliveryPopupPreviousFocus.focus) {
            gcsDeliveryPopupPreviousFocus.focus();
        }
    }
};

// Routing logic function
window.openDelivery = function () {
    gcsDeliveryPopupClose();

    // Pas 240ms untuk menunggu animasi slide-down selesai sebelum redirect dilakukan
    setTimeout(() => {
        window.location.href = "action://act/delivery";
    }, 240);
};

// Fungsi destroy untuk membersihkan memory leak opsional jika komponen di-unmount secara dinamis
window.gcsDeliveryPopupDestroy = function () {
    gcsDeliveryPopupClose();
    const dragArea = document.getElementById("gcsDeliveryPopupDragArea");
    if (dragArea) {
        const clonedDragArea = dragArea.cloneNode(true);
        dragArea.parentNode.replaceChild(clonedDragArea, dragArea);
    }
};