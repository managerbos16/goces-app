/**
 * Kontrol Navigasi Tab Aktivitas
 */
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Hapus active dari semua tombol dan panel
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // Tambahkan active pada elemen yang dipilih
            tab.classList.add("active");
            document.getElementById(tab.dataset.target).classList.add("active");
        });
    });
});