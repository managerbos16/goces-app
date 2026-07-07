/**
 * GOCES SHOP ARCHITECTURE CORE SUBSYSTEM CONTROLLER
 * Coded with Clean, Pure ES6 Vanilla Javascript Frameworks.
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // --- DOM Cache References ---
    const gcsShopChips = document.querySelectorAll(".gcsShopCategoryChip");
    const gcsShopSections = document.querySelectorAll(".gcsShopMenuSection");
    const gcsShopSearchInput = document.getElementById("search");
    const gcsShopCards = document.querySelectorAll(".gcsShopCard");

    /**
     * Smooth Navigation Section Switcher Engine
     */
    const gcsShopChangeCategory = (targetCat) => {
        const sectionId = `gcsShopSec-${targetCat}`;
        let activeSec = document.getElementById(sectionId);

        if (!activeSec) {
            activeSec = document.getElementById("gcsShopSec-semua");
        }

        // Wipe visibility classes instantly
        gcsShopSections.forEach((sec) => {
            sec.classList.remove("gcsShopAnimateFade", "gcsShopSectionVisible");
        });

        // Toggle requested space block
        activeSec.classList.add("gcsShopSectionVisible");

        // Repaint paint trigger securely using double frame request mechanics
        requestAnimationFrame(() => {
            setTimeout(() => {
                activeSec.classList.add("gcsShopAnimateFade");
            }, 15);
        });
    };

    // Mapping Chip Click Operations safely
    gcsShopChips.forEach((chip) => {
        chip.addEventListener("click", function (e) {
            e.preventDefault();
            if (this.classList.contains("gcsShopActive")) return;

            gcsShopChips.forEach((c) => c.classList.remove("gcsShopActive"));
            this.classList.add("gcsShopActive");

            const selectedCategory = this.getAttribute("data-category");
            gcsShopChangeCategory(selectedCategory);

            // Keeps selection chip centered in iOS viewports
            this.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        });
    });

    /**
     * Debounced Search Filtering Processor Component
     */
    const gcsShopDebounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    if (gcsShopSearchInput) {
        gcsShopSearchInput.addEventListener("input", gcsShopDebounce((e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === "") {
                const activeChip = document.querySelector(".gcsShopCategoryChip.gcsShopActive");
                const currentCat = activeChip ? activeChip.getAttribute("data-category") : "semua";
                gcsShopChangeCategory(currentCat);
                gcsShopCards.forEach(card => card.style.display = "flex");
                return;
            }

            // Expose structural blocks to show matched filters globally
            gcsShopSections.forEach(sec => sec.classList.add("gcsShopSectionVisible", "gcsShopAnimateFade"));

            gcsShopCards.forEach((card) => {
                const tags = card.getAttribute("data-gcs-tags") || "";
                const title = card.querySelector(".gcsShopProductTitle").textContent.toLowerCase();
                const merchant = card.querySelector(".gcsShopMerchantName").textContent.toLowerCase();

                if (tags.includes(query) || title.includes(query) || merchant.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }, 250));
    }

    /**
     * High-Performance IntersectionObserver Lazy Image Loader Module
     */
    const gcsShopInitLazyLoad = () => {
        const lazyImages = document.querySelectorAll(".gcsShopLazy");

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add("gcsShopLoaded");
                        obs.unobserve(img);
                    }
                });
            }, { rootMargin: "0px 0px 200px 0px" });

            lazyImages.forEach(img => observer.observe(img));
        } else {
            lazyImages.forEach(img => img.classList.add("gcsShopLoaded"));
        }
    };
    gcsShopInitLazyLoad();

    /**
     * Premium Touch Canvas Ripple Micro-Interaction Module
     */
    document.querySelectorAll(".gcsShopGrid").forEach((grid) => {
        grid.addEventListener("click", function (e) {
            const card = e.target.closest(".gcsShopCard");
            if (!card) return;

            const ripple = document.createElement("span");
            ripple.classList.add("gcsShopRipple");

            const diameter = Math.max(card.offsetWidth, card.offsetHeight);
            ripple.style.width = ripple.style.height = `${diameter}px`;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - (diameter / 2);
            const y = e.clientY - rect.top - (diameter / 2);

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            card.appendChild(ripple);

            ripple.addEventListener("animationend", () => ripple.remove());
        });
    });

    /**
     * 24-Hour Looping Flash Sale Premium Countdown System
     */
    const gcsShopRunTimer = () => {
        const hBlock = document.getElementById("gcsShopTimerH");
        const mBlock = document.getElementById("gcsShopTimerM");
        const sBlock = document.getElementById("gcsShopTimerS");

        const updateClock = () => {
            const now = new Date();
            const target = new Date();
            target.setHours(23, 59, 59, 999); // Set target to tonight's end block

            const diff = target - now;

            if (diff <= 0) {
                hBlock.textContent = "00";
                mBlock.textContent = "00";
                sBlock.textContent = "00";
                return;
            }

            const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            hBlock.textContent = String(hrs).padStart(2, "0");
            mBlock.textContent = String(mins).padStart(2, "0");
            sBlock.textContent = String(secs).padStart(2, "0");
        };

        setInterval(updateClock, 1000);
        updateClock();
    };
    gcsShopRunTimer();

    // Init state active trigger
    const initialActive = document.querySelector(".gcsShopMenuSection.gcsShopSectionVisible");
    if (initialActive) initialActive.classList.add("gcsShopAnimateFade");
});