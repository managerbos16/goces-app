/*==================================
        GOCES VOUCHER COUNTDOWN
==================================*/

window.GocesVoucherCountdown = {

    init() {

        this.update();

        setInterval(() => {

            this.update();

        }, 60000);

    },

    update() {

        const cards = document.querySelectorAll(

            "#gocesVoucherSemua .gcv-card"

        );

        const now = Date.now();

        let totalAktif = 0;

        cards.forEach(card => {

            const countdown = card.querySelector(".gcv-countdown");

            if (!countdown) return;

            const status =
                card.dataset.status === "true";

            const start =
                new Date(
                    card.dataset.start.replace(" ", "T")
                ).getTime();

            const end =
                new Date(
                    card.dataset.end.replace(" ", "T")
                ).getTime();

            // ===========================
            // STATUS ADMIN
            // ===========================

            if (!status) {

                card.style.display = "none";

                return;

            }

            // ===========================
            // SUDAH BERAKHIR
            // ===========================

            if (now > end) {

                card.style.display = "none";

                return;

            }

            // tampilkan kembali bila aktif
            card.style.display = "";

            totalAktif++;

            // ===========================
            // BELUM DIMULAI
            // ===========================

            if (now < start) {

                countdown.textContent =

                    "🕒 Dimulai dalam " +

                    this.format(start - now);

                countdown.className =

                    "gcv-countdown upcoming";

                return;

            }

            // ===========================
            // SEDANG BERLANGSUNG
            // ===========================

            countdown.textContent =

                "⏳ Berakhir dalam " +

                this.format(end - now);

            countdown.className =

                "gcv-countdown active";

        });

        // ===========================
        // UPDATE JUMLAH VOUCHER
        // ===========================

        const total =
            document.getElementById(
                "gprActiveVoucherCount"
            );

        if (total) {

            total.textContent =

                totalAktif +

                " Voucher Aktif";

        }

    },

    format(ms) {

        const minute = 60000;

        const hour = minute * 60;

        const day = hour * 24;

        const days = Math.floor(ms / day);

        const hours = Math.floor(

            (ms % day) / hour

        );

        const minutes = Math.floor(

            (ms % hour) / minute

        );

        if (days > 0) {

            return days + " hari";

        }

        if (hours > 0) {

            return hours + " jam";

        }

        return minutes + " menit";

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        GocesVoucherCountdown.init();

    }

);