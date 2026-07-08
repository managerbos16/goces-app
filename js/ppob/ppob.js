/**
 * GOCES PPOB (Payment Point Online Bank) CONTROLLER
 * iOS-grade Interactions and Strict Modular Prefixing
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsPpobInit();
});

function gcsPpobInit() {
    const gcsPpobSearchInput = document.getElementById("search");
    const gcsPpobFilterChips = document.querySelectorAll(".gcsPpobFilterChip");
    const gcsPpobServiceCards = document.querySelectorAll(".gcsPpobServiceCard");
    const gcsPpobHistoryCards = document.querySelectorAll(".gcsPpobHistoryCard");
    const gcsPpobPromoCards = document.querySelectorAll(".gcsPpobPromoCard");
    const gcsPpobSections = document.querySelectorAll(".gcsPpobSection");

    // 1. Unified Ripple Feedback Engine for Clickable Cards
    const gcsPpobAttachRipple = (elements) => {
        elements.forEach(card => {
            card.addEventListener("pointerdown", function (e) {
                const ripple = document.createElement("span");
                ripple.classList.add("gcsPpobRipple");

                const rect = this.getBoundingClientRect();
                const diameter = Math.max(this.clientWidth, this.clientHeight);
                const radius = diameter / 2;

                ripple.style.width = ripple.style.height = `${diameter}px`;
                ripple.style.left = `${e.clientX - rect.left - radius}px`;
                ripple.style.top = `${e.clientY - rect.top - radius}px`;

                this.appendChild(ripple);

                ripple.addEventListener("animationend", () => ripple.remove());
            });

            // Accessibility Enter Key Logic
            card.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    console.log("PPOB Action Triggered:", this.innerText.trim());
                    // Placeholder navigation logic: location.href="action://..."
                }
            });
        });
    };

    gcsPpobAttachRipple(gcsPpobServiceCards);
    gcsPpobAttachRipple(gcsPpobHistoryCards);
    gcsPpobAttachRipple(gcsPpobPromoCards);

    // 2. Interactive Quick Filter Navigation (UI State Mockup)
    gcsPpobFilterChips.forEach(chip => {
        chip.addEventListener("click", function (e) {
            e.preventDefault();
            if (this.classList.contains("gcsPpobActive")) return;

            gcsPpobFilterChips.forEach(c => c.classList.remove("gcsPpobActive"));
            this.classList.add("gcsPpobActive");

            const selectedFilter = this.getAttribute("data-filter");

            // Logika UI filter - menyembunyikan/memunculkan layout grid sections
            gcsPpobSections.forEach(section => {
                // Gunakan requestAnimationFrame untuk optimasi re-paint
                requestAnimationFrame(() => {
                    section.style.opacity = '0';
                    setTimeout(() => {
                        if (selectedFilter === "semua" || selectedFilter === "promo") {
                            section.style.display = "";
                        } else {
                            // Dummy filter simulation
                            const title = section.querySelector(".gcsPpobSectionTitle").innerText.toLowerCase();
                            if (selectedFilter === "sering-dipakai" && title === "layanan utama") {
                                section.style.display = "";
                            } else {
                                section.style.display = (selectedFilter === "semua") ? "" : "none";
                            }
                        }

                        requestAnimationFrame(() => {
                            section.style.opacity = '1';
                        });
                    }, 150);
                });
            });

            this.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
    });

    // 3. High-Performance Debounced Global Search Engine
    const gcsPpobDebounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    if (gcsPpobSearchInput) {
        gcsPpobSearchInput.addEventListener("input", gcsPpobDebounce((e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === "") {
                gcsPpobServiceCards.forEach(card => card.style.display = "");
                gcsPpobSections.forEach(block => block.style.display = "");
                return;
            }

            // Engine filter pencarian per-kategori block
            gcsPpobSections.forEach(block => {
                let hasVisibleCard = false;
                const cardsInBlock = block.querySelectorAll(".gcsPpobServiceCard");

                cardsInBlock.forEach(card => {
                    const label = card.querySelector(".gcsPpobServiceLabel");
                    if (label) {
                        const text = label.textContent.toLowerCase();
                        if (text.includes(query)) {
                            card.style.display = "";
                            hasVisibleCard = true;
                        } else {
                            card.style.display = "none";
                        }
                    }
                });

                // Jika grid block khusus layanan, hide parent jika kosong
                if (cardsInBlock.length > 0) {
                    block.style.display = hasVisibleCard ? "" : "none";
                }
            });

        }, 200));
    }
}