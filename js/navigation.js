/*==================================
  GOCES NAVIGATION
==================================*/

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".goces-nav-item").forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            if (page) {
                showPage(page);
            }

        });

    });

});