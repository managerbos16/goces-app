/**
 * GOCES Activity Logic
 * Modul kontrol navigasi tab premium untuk aplikasi iOS
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const segments = document.querySelectorAll(".gcsActivitySegmentButton");
    const panels = [
        document.querySelector(".gcsActivityPurchasePanel"),
        document.querySelector(".gcsActivityBalancePanel"),
        document.querySelector(".gcsActivityPointPanel")
    ];

    /**
     * Berpindah antar panel dengan transisi halus
     * @param {string} target - Data target dari button
     */
    const handleTabSwitch = (target) => {
        // Toggle Buttons
        segments.forEach(btn => {
            btn.classList.toggle("gcsActivitySegmentActive", btn.dataset.target === target);
        });

        // Toggle Panels
        panels.forEach(panel => {
            panel.classList.toggle("gcsActivityPanelActive", panel.id === target);
        });
    };

    // Event Listener
    segments.forEach(segment => {
        segment.addEventListener("click", () => {
            handleTabSwitch(segment.dataset.target);
        });
    });
});