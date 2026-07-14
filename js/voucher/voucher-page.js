/*==================================
        GOCES VOUCHER PAGE
==================================*/

window.GocesVoucherPage = {

    current: "semua",

    init() {

        this.show("semua");

    },

    show(category) {

        this.current = category;

        // Sembunyikan semua halaman
        document
            .querySelectorAll(".gpr-content")
            .forEach(page => {

                page.style.display = "none";

            });

        // Nonaktifkan semua tombol
        document
            .querySelectorAll(".gpr-category button")
            .forEach(button => {

                button.classList.remove("active");

            });

        // Tampilkan halaman yang dipilih
        const page =
            document.getElementById(category);

        if (page) {

            page.style.display = "block";

        }

        // Aktifkan tombol yang dipilih
        const activeButton =
            document.querySelector(

                '.gpr-category button[onclick*="' +

                category +

                '"]'

            );

        if (activeButton) {

            activeButton.classList.add("active");

        }

    }

};

/*==================================
        GLOBAL FUNCTION
==================================*/

function gprOpenCategory(event, category) {

    GocesVoucherPage.show(category);

}

function gprOpenAllVoucher() {

    GocesVoucherPage.show("semua");

}

/*==================================
        START
==================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        GocesVoucherPage.init();

    }

);