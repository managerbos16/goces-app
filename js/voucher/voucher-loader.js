/*==================================
        GOCES VOUCHER LOADER
==================================*/

window.GocesVoucherLoader = {

    api: "https://goces-api.vercel.app/voucher",

    pages: [

        {
            category: "semua",
            container: "gocesVoucherSemua"
        },

        {
            category: "populer",
            container: "gocesVoucherPopuler"
        },

        {
            category: "terbaru",
            container: "gocesVoucherTerbaru"
        },

        {
            category: "eksklusif",
            container: "gocesVoucherEksklusif"
        },

        {
            category: "cashback",
            container: "gocesVoucherCashback"
        },

        {
            category: "terbatas",
            container: "gocesVoucherTerbatas"
        }

    ],

    async load(category, containerId) {

        try {

            const response = await fetch(

                `${this.api}?category=${category}`

            );

            const result = await response.json();

            const container = document.getElementById(containerId);

            if (!container) return;

            container.innerHTML = "";

            if (!result.success) {

                return;

            }

            const vouchers = result.data || [];

            alert(category + " = " + vouchers.length);

            vouchers.forEach(voucher => {

                container.insertAdjacentHTML(

                    "beforeend",

                    renderVoucherCard(voucher)

                );

            });

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

        }

        catch (err) {

            console.error(

                "Voucher Loader:",

                err

            );

        }

    },

    async init() {

        for (const page of this.pages) {

            await this.load(

                page.category,

                page.container

            );

        }

        if (window.GocesVoucherCountdown) {

            GocesVoucherCountdown.update();

        }

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        GocesVoucherLoader.init();

    }

);