/*==================================
        GOCES VOUCHER LOADER
==================================*/

const GocesVoucher = {

    container: null,

    async load() {

        this.container = document.getElementById(

            "gocesVoucherContainer"

        );

        if (!this.container) return;

        this.container.innerHTML =

            "<div class='goces-loading'>Memuat voucher...</div>";

        try {

            const response = await fetch(

                "https://goces-api.vercel.app/voucher"

            );

            const result = await response.json();

            if (!result.success) {

                this.container.innerHTML =

                    "<div class='goces-empty'>Voucher tidak tersedia.</div>";

                return;

            }

            this.render(

                result.data

            );

        }

        catch (error) {

            console.error(error);

            this.container.innerHTML =

                "<div class='goces-empty'>Gagal memuat voucher.</div>";

        }

    },

    render(items) {

        this.container.innerHTML = "";

        items.forEach(item => {

            this.container.insertAdjacentHTML(

                "beforeend",

                renderVoucherCard(item)

            );

        });

    },

};

document.addEventListener(

    "DOMContentLoaded",

    () => GocesVoucher.load()

);