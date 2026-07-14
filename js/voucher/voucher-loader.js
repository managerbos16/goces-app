/*==================================
        GOCES VOUCHER LOADER
==================================*/

window.GocesVoucherLoader = {

    categories: [

        {
            page: "populer",
            container: "gocesVoucherPopuler"
        },

        {
            page: "terbaru",
            container: "gocesVoucherTerbaru"
        },

        {
            page: "eksklusif",
            container: "gocesVoucherEksklusif"
        },

        {
            page: "cashback",
            container: "gocesVoucherCashback"
        },

        {
            page: "terbatas",
            container: "gocesVoucherTerbatas"
        }

    ],

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

                return;

            }

            const vouchers = result.data || [];

            vouchers.forEach(voucher => {

                container.insertAdjacentHTML(

                    "beforeend",

                    renderVoucherCard(voucher)

                );

            });

        }

        catch (err) {

            console.error(

                "Voucher Loader Error:",

                err

            );

        }

    },

    updateSemua() {

        const semua = document.getElementById(

            "gocesVoucherSemua"

        );

        if (!semua) return;

        semua.innerHTML = "";

        this.categories.forEach(item => {

            const source = document.getElementById(

                item.container

            );

            if (!source) return;

            source.querySelectorAll(".gcv-card").forEach(card => {

                semua.insertAdjacentHTML(

                    "beforeend",

                    card.outerHTML

                );

            });

        });

    },

    updateVoucherCount() {

        const total = document.querySelectorAll(

            "#gocesVoucherSemua .gcv-card"

        ).length;

        const text = document.getElementById(

            "gprActiveVoucherCount"

        );

        if (text) {

            text.textContent =

                total +

                " Voucher Aktif";

        }

    },

    async init() {

        for (const item of this.categories) {

            await this.load(

                item.page,

                item.container

            );

        }

        this.updateSemua();

        this.updateVoucherCount();

        if (window.GocesVoucherCountdown) {

            GocesVoucherCountdown.update();

        }

    }

};

document.addEventListener(

    "DOMContentLoaded",

    function () {

        GocesVoucherLoader.init();

    }

);