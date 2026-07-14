/*==================================
        GOCES VOUCHER COUNTDOWN
==================================*/

window.GocesVoucherCountdown = {

    init() {

        this.update();

        // Update setiap 1 menit
        setInterval(() => {

            this.update();

        }, 60000);

    },

    update() {

        const cards = document.querySelectorAll(".gcv-card");

        const now = new Date().getTime();

        cards.forEach(card => {

            const countdown = card.querySelector(".gcv-countdown");

            if (!countdown) return;

            const start = new Date(

                card.dataset.start.replace(" ", "T")

            ).getTime();

            const end = new Date(

                card.dataset.end.replace(" ", "T")

            ).getTime();

            // Voucher belum dimulai
            if (now < start) {

                const diff = start - now;

                countdown.innerHTML =

                    "🕒 Dimulai dalam " +

                    this.format(diff);

                countdown.className =

                    "gcv-countdown upcoming";

                return;

            }

            // Voucher sudah berakhir
            if (now > end) {

                countdown.innerHTML =

                    "❌ Voucher telah berakhir";

                countdown.className =

                    "gcv-countdown expired";

                return;

            }

            // Voucher sedang aktif
            const diff = end - now;

            countdown.innerHTML =

                "⏳ Berakhir dalam " +

                this.format(diff);

            countdown.className =

                "gcv-countdown active";

        });

    },

    format(ms) {

        const minute = 60 * 1000;

        const hour = 60 * minute;

        const day = 24 * hour;

        const days = Math.floor(ms / day);

        const hours = Math.floor(

            (ms % day) / hour

        );

        const minutes = Math.floor(

            (ms % hour) / minute

        );

        if (days > 0) {

            return days +

                " hari";

        }

        if (hours > 0) {

            return hours +

                " jam";

        }

        return minutes +

            " menit";

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        GocesVoucherCountdown.init();

    }

);