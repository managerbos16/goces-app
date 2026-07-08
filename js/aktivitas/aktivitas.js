/**
 * GOCES Activity Controller
 * Mengelola navigasi tab dengan pendekatan state-driven
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const tabs = document.querySelectorAll(".gcs-tab-btn");
    const panels = document.querySelectorAll(".gcs-panel");

    /**
     * Fungsi untuk mengganti tab aktif secara halus
     * @param {string} target - Data-tab target
     */
    const switchTab = (target) => {
        // Toggle class active pada tombol
        tabs.forEach(tab => {
            tab.classList.toggle("active", tab.dataset.tab === target);
        });

        // Toggle class active pada panel
        panels.forEach(panel => {
            panel.classList.toggle("active", panel.id === target);
        });
    };

    // Menambahkan event listener ke setiap tombol tab
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
});