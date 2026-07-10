document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // --- DOM Cache Elements ---
    const chips = document.querySelectorAll(".category-chip");
    const sections = document.querySelectorAll(".menu-section");
    const searchInput = document.getElementById("search");
    const cards = document.querySelectorAll(".product-card");

    /**
     * Navigation Switcher Engine
     * Uses display blocks and safe requestAnimationFrame macro-task toggles.
     */
    const renderCategoryView = (targetCategory) => {
        const targetId = `section-${targetCategory}`;
        let activeSection = document.getElementById(targetId);

        // Fallback safety to render All Section
        if (!activeSection) {
            activeSection = document.getElementById("section-semua");
        }

        // Wipe clean active visibilities 
        sections.forEach((sec) => {
            sec.classList.remove("animate-fade", "section-visible");
        });

        // Toggle visibility target layer
        activeSection.classList.add("section-visible");

        // Render smoothly using engine style injection rules
        requestAnimationFrame(() => {
            setTimeout(() => {
                activeSection.classList.add("animate-fade");
            }, 10);
        });
    };

    // Chip Delegation Event Mapping
    chips.forEach((chip) => {
        chip.addEventListener("click", function (e) {
            e.preventDefault();
            if (this.classList.contains("active")) return;

            chips.forEach((c) => c.classList.remove("active"));
            this.classList.add("active");

            const selectedCat = this.getAttribute("data-category");
            renderCategoryView(selectedCat);

            // Auto center chip focus state structure inside viewports
            this.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        });
    });

    // Booting up configuration states sequence
    const initPageStates = () => {
        const baseActive = document.querySelector(".menu-section.section-visible");
        if (baseActive) {
            baseActive.classList.add("animate-fade");
        }
    };
    initPageStates();

    /**
     * Clean Local Inline Search Filter 
     * Optimizes search matches on active cards.
     */
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === "") {
                // If text input is blank reset to standard current active category section views
                const activeChip = document.querySelector(".category-chip.active");
                const currentCat = activeChip ? activeChip.getAttribute("data-category") : "semua";
                renderCategoryView(currentCat);
                cards.forEach(card => card.style.display = "flex");
                return;
            }

            // Expose structural spaces for real-time validation checks
            sections.forEach(sec => sec.classList.add("section-visible", "animate-fade"));

            cards.forEach((card) => {
                const searchData = card.getAttribute("data-tags") || "";
                const title = card.querySelector(".product-title").textContent.toLowerCase();
                const merchant = card.querySelector(".merchant-name").textContent.toLowerCase();

                if (searchData.includes(query) || title.includes(query) || merchant.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    /**
     * Interaction Canvas Ripple Effect Module
     */
    cards.forEach((card) => {
        card.addEventListener("click", function (e) {
            const rippleSpan = document.createElement("span");
            rippleSpan.classList.add("ripple");

            const sizeMetrics = Math.max(this.offsetWidth, this.offsetHeight);
            rippleSpan.style.width = rippleSpan.style.height = `${sizeMetrics}px`;

            const boundRect = this.getBoundingClientRect();
            const coordX = e.clientX - boundRect.left - (sizeMetrics / 2);
            const coordY = e.clientY - boundRect.top - (sizeMetrics / 2);

            rippleSpan.style.left = `${coordX}px`;
            rippleSpan.style.top = `${coordY}px`;

            this.appendChild(rippleSpan);

            rippleSpan.addEventListener("animationend", () => {
                rippleSpan.remove();
            });
        });
    });
});