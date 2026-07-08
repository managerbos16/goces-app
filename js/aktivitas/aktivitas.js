/**
 * Aktivitas Controller - GOCES
 * Menangani navigasi tab tanpa reload halaman
 */

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    /**
     * Fungsi untuk berpindah tab
     * @param {string} targetTab - Nama tab yang dituju
     */
    const activateTab = (targetTab) => {
        // Update class pada tombol
        tabs.forEach(tab => {
            tab.classList.toggle("active", tab.dataset.tab === targetTab);
        });

        // Update class pada panel
        panels.forEach(panel => {
            panel.classList.toggle("active", panel.id === targetTab);
        });
    };

    // Event listener untuk klik tab
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;
            activateTab(target);
        });
    });
});