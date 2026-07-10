/**
 * GOCES FRESH ARCHITECTURE CONTROLLER
 * Optimized high-performance Vanilla JS engine.
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // --- DOM Cache Architecture ---
    const gcsFreshChips = document.querySelectorAll(".gcsFreshCategoryChip");
    const gcsFreshSections = document.querySelectorAll(".gcsFreshMenuSection");
    const gcsFreshFilterTabs = document.querySelectorAll(".gcsFreshFilterTab");
    const gcsFreshSearchInput = document.getElementById("search");
    const gcsFreshCards = document.querySelectorAll(".gcsFreshCard");

    /**
     * Smooth Navigation Section Switcher Engine
     */
    const gcsFreshRenderCategory = (targetCategory) => {
        const targetId = `gcsFreshSec-${targetCategory}`;
        let activeSection = document.getElementById(targetId);

        if (!activeSection) {
            activeSection = document.getElementById("gcsFreshSec-semua");
        }

        // Wipe visibility instantly
        gcsFreshSections.forEach((sec) => {
            sec.classList.remove("gcsFreshAnimate", "gcsFreshSectionVisible");
        });

        // Trigger safe animation macro-task frames
        activeSection.classList.add("gcsFreshSectionVisible");

        requestAnimationFrame(() => {
            setTimeout(() => {
                activeSection.classList.add("gcsFreshAnimate");
            }, 10);
        });
    };

    // Category Event Mapping
    gcsFreshChips.forEach((chip) => {
        chip.addEventListener("click", function (e) {
            e.preventDefault();
            if (this.classList.contains("gcsFreshActive")) return;

            gcsFreshChips.forEach((c) => c.classList.remove("gcsFreshActive"));
            this.classList.add("gcsFreshActive");

            // Reset Quick Filter View to All State whenever category changes
            gcsFreshFilterTabs.forEach(tab => tab.classList.remove("gcsFreshSelected"));
            document.querySelector('[data-filter="semua"]').classList.add("gcsFreshSelected");

            gcsFreshRenderCategory(this.getAttribute("data-category"));

            this.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
    });

    /**
     * High Performance Grid Quick Filter Mechanism
     */
    gcsFreshFilterTabs.forEach((tab) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            if (this.classList.contains("gcsFreshSelected")) return;

            gcsFreshFilterTabs.forEach((t) => t.classList.remove("gcsFreshSelected"));
            this.classList.add("gcsFreshSelected");

            const currentFilter = this.getAttribute("data-filter");
            const activeChip = document.querySelector(".gcsFreshCategoryChip.gcsFreshActive").getAttribute("data-category");

            gcsFreshCards.forEach((card) => {
                const matchesCategory = (activeChip === "semua" || card.getAttribute("data-gcs-category") === activeChip);
                const filterAttributes = card.getAttribute("data-gcs-filters") || "";
                const matchesFilter = (currentFilter === "semua" || filterAttributes.includes(currentFilter));

                if (matchesCategory && matchesFilter) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });

            this.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
    });

    /**
     * Debounced Local Search Filtering Engine
     */
    const gcsFreshDebounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    if (gcsFreshSearchInput) {
        gcsFreshSearchInput.addEventListener("input", gcsFreshDebounce((e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === "") {
                const activeCategory = document.querySelector(".gcsFreshCategoryChip.gcsFreshActive").getAttribute("data-category");
                gcsFreshRenderCategory(activeCategory);
                gcsFreshCards.forEach(card => card.style.display = "flex");
                return;
            }

            gcsFreshSections.forEach(sec => sec.classList.add("gcsFreshSectionVisible", "gcsFreshAnimate"));

            gcsFreshCards.forEach((card) => {
                const tags = card.getAttribute("data-gcs-tags") || "";
                const title = card.querySelector(".gcsFreshProductTitle").textContent.toLowerCase();

                if (tags.includes(query) || title.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }, 200));
    }

    /**
     * High Performance IntersectionObserver (Lazy Loading Images)
     */
    const gcsFreshLazyLoad = () => {
        const images = document.querySelectorAll(".gcsFreshLazyImg");

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add("gcsFreshImageLoaded");
                        obs.unobserve(img);
                    }
                });
            }, { rootMargin: "0px 0px 200px 0px" });

            images.forEach(img => observer.observe(img));
        } else {
            images.forEach(img => img.classList.add("gcsFreshImageLoaded"));
        }
    };
    gcsFreshLazyLoad();

    /**
     * Premium Touch Ripple Feedback
     */
    document.querySelectorAll(".gcsFreshGrid").forEach((grid) => {
        grid.addEventListener("click", function (e) {
            const card = e.target.closest(".gcsFreshCard");
            if (!card) return;

            const ripple = document.createElement("span");
            ripple.classList.add("gcsFreshRipple");

            const diameter = Math.max(card.offsetWidth, card.offsetHeight);
            ripple.style.width = ripple.style.height = `${diameter}px`;

            const rect = card.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left - (diameter / 2)}px`;
            ripple.style.top = `${e.clientY - rect.top - (diameter / 2)}px`;

            card.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove());
        });
    });

    /**
     * Looping Flash Fresh Countdown Component (24 Hours Scale)
     */
    const gcsFreshRunTimer = () => {
        const hSlot = document.getElementById("gcsFreshH");
        const mSlot = document.getElementById("gcsFreshM");
        const sSlot = document.getElementById("gcsFreshS");

        const updateClock = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(23, 59, 59, 999);

            const diff = midnight - now;

            if (diff <= 0) {
                hSlot.textContent = "00";
                mSlot.textContent = "00";
                sSlot.textContent = "00";
                return;
            }

            const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            hSlot.textContent = String(hrs).padStart(2, "0");
            mSlot.textContent = String(mins).padStart(2, "0");
            sSlot.textContent = String(secs).padStart(2, "0");
        };

        setInterval(updateClock, 1000);
        updateClock();
    };
    gcsFreshRunTimer();

    // Init active state layout
    const initialActive = document.querySelector(".gcsFreshMenuSection.gcsFreshSectionVisible");
    if (initialActive) initialActive.classList.add("gcsFreshAnimate");
});