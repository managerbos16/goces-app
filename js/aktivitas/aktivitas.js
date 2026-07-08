/**
 * GOCES Activity Controller
 * Mengelola tab switching dan interaksi UI
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const tabs = document.querySelectorAll(".gcs-tab-btn");
    const panels = document.querySelectorAll(".gcs-tab-panel");

    /**
     * Fungsi untuk mengganti panel aktif
     * @param {string} targetId - ID dari panel yang akan ditampilkan
     */
    const activateTab = (targetId) => {
        // Reset state tombol
        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === targetId;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", isActive);
        });

        // Reset state panel
        panels.forEach(panel => {
            panel.classList.toggle("active", panel.id === targetId);
        });
    };

    // Event listener untuk setiap tab
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;
            activateTab(target);
        });
    });
});