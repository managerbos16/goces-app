/*==================================
        GOCES VOUCHER LOADER
==================================*/

window.GocesVoucherLoader = {

    api: "https://goces-api.vercel.app/voucher",

    data: {

        populer: [],

        terbaru: [],

        eksklusif: [],

        cashback: [],

        terbatas: []

    },

    categories: [

        "populer",

        "terbaru",

        "eksklusif",

        "cashback",

        "terbatas"

    ],

    async loadCategory(category) {

        try {

            const response = await fetch(

                this.api +

                "?category=" +

                category

            );

            const result = await response.json();

            if (

                result.success

            ) {

                this.data[category] =

                    result.data || [];

            }

            else {

                this.data[category] = [];

            }

        }

        catch (e) {

            console.error(e);

            this.data[category] = [];

        }

    }

};

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await GocesVoucherLoader.loadCategory(

            "populer"

        );

        console.log(

            GocesVoucherLoader.data

        );

    }

);