/*==================================================
            GOCES NAVIGATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll(".goces-nav-item, .goces-qris-btn")
        .forEach(button => {

            button.addEventListener("click", function () {

                const page = this.dataset.page;

                if (!page) return;

                showPage(page);

            });

        });

});