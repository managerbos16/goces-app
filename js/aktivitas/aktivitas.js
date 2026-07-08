/**
 * GOCES Activity Logic
 * Handles tab switching with smooth CSS class transitions
 */

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".gcs-segment-btn");
    const contents = document.querySelectorAll(".gcs-tab-content");

    const switchTab = (targetId) => {
        // Update Buttons
        tabs.forEach(tab => {
            tab.classList.toggle("active", tab.dataset.target === targetId);
        });

        // Update Content with animation
        contents.forEach(content => {
            if (content.id === targetId) {
                content.classList.add("active");
            } else {
                content.classList.remove("active");
            }
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.target;
            switchTab(target);
        });
    });
});