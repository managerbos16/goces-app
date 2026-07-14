/*==================================
    GOCES HORIZONTAL VOUCHER
==================================*/

window.GocesVoucherHorizontal = {

    api:

        "https://goces-api.vercel.app/voucher",

    async load(category, containerId, limit = 5) {

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

            result.data

                .slice(0, limit)

                .forEach(voucher => {

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

            console.error(err);

        }

    }

};