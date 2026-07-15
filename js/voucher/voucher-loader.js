/*==================================
        GOCES VOUCHER LOADER
==================================*/

window.GocesVoucherLoader = {

    api: "https://goces-api.vercel.app/voucher",

    async load(options = {}) {

        const category = options.category || "semua";

        const containerId = options.container;

        const limit = options.limit || 0;

        try {

            const response = await fetch(

                `${this.api}?category=${category}`

            );

            const result = await response.json();

            if (!result.success) return;

            const container =

                document.getElementById(containerId);

            if (!container) return;

            container.innerHTML = "";

            let vouchers = result.data || [];

            if (limit > 0) {

                vouchers = vouchers.slice(0, limit);

            }

            vouchers.forEach(voucher => {

                container.insertAdjacentHTML(

                    "beforeend",

                    renderVoucherCard(voucher)

                );

            });

            if (window.GocesVoucherCountdown) {

                GocesVoucherCountdown.update();

            }

        }

        catch (err) {

            console.error(

                "Voucher Loader",

                err

            );

        }

    },

    init() {

        // =====================
        // HALAMAN PROMO
        // =====================

        this.load({

            category: "semua",

            container: "gocesVoucherSemua"

        });

        this.load({

            category: "populer",

            container: "gocesVoucherPopuler"

        });

        this.load({

            category: "terbaru",

            container: "gocesVoucherTerbaru"

        });

        this.load({

            category: "eksklusif",

            container: "gocesVoucherEksklusif"

        });

        this.load({

            category: "cashback",

            container: "gocesVoucherCashback"

        });

        this.load({

            category: "terbatas",

            container: "gocesVoucherTerbatas"

        });

        this.load({

            category: "populer",

            container: "gocesVoucherHome",

            limit: 5

        });

        this.load({

            category: "cashback",

            container: "gocesVoucherFood",

            limit: 5

        });

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        GocesVoucherLoader.init();

    }

);