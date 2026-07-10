document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const chips = document.querySelectorAll(".gcsPromoChip");
    const contents = document.querySelectorAll(".gcsPromoTabContent");

    chips.forEach(chip => {
        chip.addEventListener("click", function () {
            // 1. Reset class Active pada tombol
            chips.forEach(c => c.classList.remove("gcsPromoActive"));
            this.classList.add("gcsPromoActive");

            // 2. Sembunyikan semua konten
            contents.forEach(content => content.classList.remove("gcsPromoTabActive"));

            // 3. Tampilkan konten yang dipilih
            const targetTab = this.getAttribute("data-tab");
            document.getElementById(targetTab).classList.add("gcsPromoTabActive");

            // 4. Scroll chip ke tengah
            this.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        });
    });
});