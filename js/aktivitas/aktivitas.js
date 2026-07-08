/**
 * GOCES Activity Logic
 * Mengelola switching tab dengan prefix unik gcsActivity
 */

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".gcsActivityTabButton");
    const panels = document.querySelectorAll(".gcsActivityPanel");

    const switchTab = (targetId) => {
        // Reset buttons
        tabs.forEach(btn => {
            btn.classList.toggle("gcsActivityTabActive", btn.dataset.target === targetId);
        });

        // Reset panels
        panels.forEach(panel => {
            panel.classList.toggle("gcsActivityPanelActive", panel.id === targetId);
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            switchTab(tab.dataset.target);
        });
    });
});