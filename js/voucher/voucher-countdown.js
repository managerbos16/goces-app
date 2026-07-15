/*==================================
        GOCES VOUCHER COUNTDOWN
==================================*/

window.GocesVoucherCountdown = {

    init() {

        this.update();

        setInterval(() => {

            this.update();

        }, 1000);

    },

    update() {

        const cards = document.querySelectorAll(".gcv-card");

        const now = Date.now();

        cards.forEach(card => {

            const countdown = card.querySelector(".gcv-countdown");

            if (!countdown) return;

            const id = card.dataset.id;

            const status = card.dataset.status === "true";

            const start = new Date(

                card.dataset.start.replace(" ", "T")

            ).getTime();

            const end = new Date(

                card.dataset.end.replace(" ", "T")

            ).getTime();

            // ==================================
            // STATUS ADMIN
            // ==================================

            if (!status) {

                this.syncVoucher(id, false);

                return;

            }

            // ==================================
            // VOUCHER BERAKHIR
            // ==================================

            if (now > end) {

                this.syncVoucher(id, false);

                return;

            }

            // ==================================
            // VOUCHER MASIH AKTIF
            // ==================================

            this.syncVoucher(id, true);

            // ==================================
            // BELUM DIMULAI
            // ==================================

            if (now < start) {

                countdown.textContent =

                    "🕒 Dimulai dalam " +

                    this.format(start - now);

                countdown.className =

                    "gcv-countdown upcoming";

                return;

            }

            // ==================================
            // SEDANG BERLANGSUNG
            // ==================================

            countdown.textContent =

                "⏳ Berakhir dalam " +

                this.format(end - now);

            countdown.className =

                "gcv-countdown active";

        });

        this.updateHorizontalSections();

        this.updateVoucherCount();


    },

    // ==================================
    // SINKRONKAN SEMUA HALAMAN
    // ==================================

    updateHorizontalSections() {

        document.querySelectorAll(".gcvh-section").forEach(section => {

            const hasVisibleVoucher = Array.from(
                section.querySelectorAll(".gcv-card")
            ).some(card => {

                return card.style.display !== "none";

            });

            section.style.display =
                hasVisibleVoucher
                    ? ""
                    : "none";

        });

    },

    syncVoucher(id, visible) {

        document

            .querySelectorAll(

                `.gcv-card[data-id="${id}"]`

            )

            .forEach(card => {

                card.style.display =

                    visible

                        ? ""

                        : "none";

            });

    },

    // ==================================
    // HITUNG HANYA HALAMAN SEMUA
    // ==================================

    updateVoucherCount() {

        const total =

            document.getElementById(

                "gprActiveVoucherCount"

            );

        if (!total) return;

        const aktif =

            document.querySelectorAll(

                "#gocesVoucherSemua .gcv-card:not([style*='display: none'])"

            ).length;

        total.textContent =

            aktif +

            " Voucher Aktif";

    },

    // ==================================
    // FORMAT COUNTDOWN
    // ==================================

    format(ms) {

        const minute = 60000;

        const hour = minute * 60;

        const day = hour * 24;

        const days = Math.floor(

            ms / day

        );

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