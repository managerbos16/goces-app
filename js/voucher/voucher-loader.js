/*==================================
        GOCES VOUCHER LOADER
==================================*/

window.GocesVoucherLoader = {

    async load(category, containerId) {

        try {

            const response = await fetch(

                "https://goces-api.vercel.app/voucher?category=" + category

            );

            const result = await response.json();

            const container = document.getElementById(containerId);

            if (!container) return;

            container.innerHTML = "";

            if (!result.success) {

                container.innerHTML = "";

                return;

            }

            const vouchers = result.data || [];

            vouchers.forEach(voucher => {

                container.insertAdjacentHTML(

                    "beforeend",

                    renderVoucherCard(voucher)

                );

            });

            // Jumlah voucher aktif hanya dihitung dari halaman "Semua"
            if (category === "semua") {

                const total = document.getElementById(

                    "gprActiveVoucherCount"

                );

                if (total) {

                    total.textContent =

                        vouchers.length +

                        " Voucher Aktif";

                }

            }

            if (window.GocesVoucherCountdown) {

                GocesVoucherCountdown.update();

            }

        }

        catch (err) {

            console.error(

                "Voucher Loader Error:",

                err

            );

        }

    },

    init() {

        this.load(

            "semua",

            "gocesVoucherSemua"

        );

        this.load(

            "populer",

            "gocesVoucherPopuler"

        );

        this.load(

            "terbaru",

            "gocesVoucherTerbaru"

        );

        this.load(

            "eksklusif",

            "gocesVoucherEksklusif"

        );

        this.load(

            "cashback",

            "gocesVoucherCashback"

        );

        this.load(

            "terbatas",

            "gocesVoucherTerbatas"

        );

    }

};

document.addEventListener(

    "DOMContentLoaded",

    function () {

        GocesVoucherLoader.init();

    }

);