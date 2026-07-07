/**
 * GOCES MORE SERVICES CONTROLLER
 * iOS-grade Interactions and Strict Modular Prefixing
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    gcsMoreInit();
});

function gcsMoreInit() {
    const gcsMoreSearchInput = document.getElementById("search");
    const gcsMoreServiceCards = document.querySelectorAll(".gcsMoreServiceCard, .gcsMoreHelpCard");
    const gcsMoreCategoryBlocks = document.querySelectorAll(".gcsMoreCategoryBlock");

    // 1. Interactive Ripple Effect Engine (Event Delegation on Body/Card)
    gcsMoreServiceCards.forEach(card => {
        card.addEventListener("pointerdown", function (e) {
            // Ciptakan span ripple
            const ripple = document.createElement("span");
            ripple.classList.add("gcsMoreRipple");

            // Hitung diameter optimal
            const rect = this.getBoundingClientRect();
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;

            this.appendChild(ripple);

            // Bersihkan memori setelah animasi
            ripple.addEventListener("animationend", () => ripple.remove());
        });
    });

    // 2. High-Performance Debounced Search Engine
    const gcsMoreDebounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    if (gcsMoreSearchInput) {
        gcsMoreSearchInput.addEventListener("input", gcsMoreDebounce((e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === "") {
                // Tampilkan semua jika kosong
                gcsMoreServiceCards.forEach(card => card.style.display = "");
                gcsMoreCategoryBlocks.forEach(block => block.style.display = "");
                return;
            }

            // Engine filter
            gcsMoreCategoryBlocks.forEach(block => {
                let hasVisibleCard = false;
                const cardsInBlock = block.querySelectorAll(".gcsMoreServiceCard");

                cardsInBlock.forEach(card => {
                    const label = card.querySelector(".gcsMoreServiceLabel");
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

                // Sembunyikan block/kategori jika seluruh isinya tidak cocok (bersih)
                block.style.display = hasVisibleCard ? "" : "none";
            });

            // Handle section atas secara terpisah agar rapi
            const topGridCards = document.querySelectorAll(".gcsMoreGridTop .gcsMoreServiceCard");
            topGridCards.forEach(card => {
                const label = card.querySelector(".gcsMoreServiceLabel");
                if (label) {
                    const text = label.textContent.toLowerCase();
                    card.style.display = text.includes(query) ? "" : "none";
                }
            });

        }, 200));
    }

    // 3. Accessibility: Support eksekusi menggunakan keyboard "Enter"
    gcsMoreServiceCards.forEach(card => {
        card.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                // Logic aksi ketika layanan di-klik di kemudian hari, 
                // e.g. location.href = "action://act/..."
                console.log("Service Accessed:", this.innerText.trim());
            }
        });
    });
}