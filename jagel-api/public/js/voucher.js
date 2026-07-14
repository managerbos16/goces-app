"use strict";

/*==================================================
                GOCES VOUCHER V2
==================================================*/

const gcv = {

    cards: [],

    toast: null,

    modal: null,

    modalTitle: null,

    modalDescription: null,

    modalCode: null,

    modalImage: null,

    modalPeriod: null,

    modalMinimumOrder: null,

    modalMaximumDiscount: null,

    modalTerms: null,

    modalCopy: null,

    interval: null,

};


/*==================================================
                INIT
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        gcv.cards =
            document.querySelectorAll(".gcv-card");

        gcv.toast =
            document.querySelector(".gcv-toast");

        gcv.modal =
            document.querySelector(".gcv-modal");

        gcv.modalTitle =
            document.querySelector(".gcv-modal-title");

        gcv.modalDescription =
            document.querySelector(".gcv-modal-description");

        gcv.modalCode =
            document.querySelector(".gcv-modal-code");

        gcv.modalImage =
            document.querySelector(".gcv-modal-image");

        gcv.modalPeriod =
            document.querySelector(".gcv-modal-period");

        gcv.modalMinimumOrder =
            document.querySelector(".gcv-modal-min-order");

        gcv.modalMaximumDiscount =
            document.querySelector(".gcv-modal-max-discount");

        gcv.modalTerms =
            document.querySelector(".gcv-terms-list");

        gcv.modalCopy =
            document.querySelector(".gcv-modal-copy");

        gcvBindEvents();

        gcvUpdateCountdown();

        gcv.interval =

            setInterval(

                gcvUpdateCountdown,

                1000

            );

    }

);



/*==================================================
                EVENTS
==================================================*/

function gcvBindEvents() {

    // ==========================
    // Klik Card → Buka Modal
    // ==========================
    gcv.cards.forEach(card => {

        card.addEventListener(

            "click",

            () => {

                gcvOpenModal(card);

            }

        );

    });

    // ==========================
    // Tombol Salin di Card
    // ==========================
    document
        .querySelectorAll(".gcv-copy")
        .forEach(button => {

            button.addEventListener(

                "click",

                event => {

                    event.stopPropagation();

                    gcvCopyVoucher(

                        button.closest(".gcv-card")

                    );

                }

            );

        });

    // ==========================
    // Tombol Tutup Modal
    // ==========================
    document
        .querySelector(".gcv-modal-close")
        .addEventListener(

            "click",

            gcvCloseModal

        );

    // ==========================
    // Klik Background Modal
    // ==========================
    gcv.modal.addEventListener(

        "click",

        event => {

            if (

                event.target === gcv.modal

            ) {

                gcvCloseModal();

            }

        }

    );

    // ==========================
    // Tombol Salin di Modal
    // ==========================
    gcv.modalCopy.addEventListener(

        "click",

        async () => {

            const code =
                gcv.modalCopy.dataset.code || "";

            try {

                await navigator.clipboard.writeText(code);

            } catch {

                const input = document.createElement("input");

                input.value = code;

                document.body.appendChild(input);

                input.select();

                document.execCommand("copy");

                input.remove();

            }

            gcvShowToast(
                "✅ Kode voucher berhasil disalin"
            );

        }

    );

}
/*==================================================
            COUNTDOWN
==================================================*/

function gcvUpdateCountdown() {

    const now = new Date().getTime();

    gcv.cards.forEach(card => {

        const countdown =
            card.querySelector(".gcv-countdown");

        const end =
            new Date(
                card.dataset.end
            ).getTime();

        const start =
            new Date(
                card.dataset.start
            ).getTime();

        if (now < start) {

            countdown.innerHTML =
                "⏳ Belum Dimulai";

            card.classList.remove("gcv-active");

            card.classList.remove("gcv-expired");

            return;

        }

        if (now >= end) {

            countdown.innerHTML =
                "❌ Voucher Berakhir";

            card.classList.remove("gcv-active");

            card.classList.add("gcv-expired");

            return;

        }

        card.classList.remove("gcv-expired");

        card.classList.add("gcv-active");

        const distance =
            end - now;

        const days =
            Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (
                    distance %
                    (1000 * 60 * 60 * 24)
                ) /
                (1000 * 60 * 60)
            );

        const minutes =
            Math.floor(
                (
                    distance %
                    (1000 * 60 * 60)
                ) /
                (1000 * 60)
            );

        const seconds =
            Math.floor(
                (
                    distance %
                    (1000 * 60)
                ) /
                1000
            );

        if (days > 0) {

            countdown.innerHTML =
                `⏳ ${days} Hari ${hours} Jam`;

            return;

        }

        if (hours > 0) {

            countdown.innerHTML =
                `⏳ ${hours} Jam ${minutes} Menit`;

            return;

        }

        countdown.innerHTML =
            `⏳ ${minutes} Menit ${seconds} Detik`;

    });

}

/*==================================================
                OPEN MODAL
==================================================*/

function gcvOpenModal(card) {

    gcv.modal.classList.add("show");

    gcv.modalTitle.textContent =
        card.dataset.title;

    gcv.modalDescription.textContent =
        card.dataset.description;

    gcv.modalCode.textContent =
        card.dataset.code;

    gcv.modalImage.src =
        card.dataset.image;

    gcv.modalImage.alt =
        card.dataset.title;

    gcv.modalPeriod.innerHTML =
        `<strong>Periode :</strong><br>${card.dataset.period}`;

    gcv.modalMinimumOrder.innerHTML =
        `<strong>Minimum Belanja :</strong><br>Rp ${Number(
            card.dataset.minOrder
        ).toLocaleString("id-ID")}`;

    gcv.modalMaximumDiscount.innerHTML =
        `<strong>Maksimal Diskon :</strong><br>Rp ${Number(
            card.dataset.maxDiscount
        ).toLocaleString("id-ID")}`;

    gcv.modalTerms.innerHTML = "";

    const terms =
        JSON.parse(
            card.dataset.terms || "[]"
        );

    terms.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = item;

        gcv.modalTerms.appendChild(li);

    });

    gcv.modalCopy.dataset.code =
        card.dataset.code;

}


/*==================================================
                CLOSE MODAL
==================================================*/

function gcvCloseModal() {

    gcv.modal.classList.remove("show");

}

/*==================================================
                COPY VOUCHER
==================================================*/

async function gcvCopyVoucher(card) {

    const code =
        card.dataset.code;

    try {

        await navigator
            .clipboard
            .writeText(code);

        gcvShowToast(
            "✅ Kode voucher berhasil disalin"
        );

    }

    catch (err) {

        const input =
            document.createElement("input");

        input.value = code;

        document.body.appendChild(input);

        input.select();

        document.execCommand("copy");

        input.remove();

        gcvShowToast(
            "✅ Kode voucher berhasil disalin"
        );

    }

}

/*==================================================
                TOAST
==================================================*/

let gcvToastTimer = null;

function gcvShowToast(message) {

    if (!gcv.toast) {

        return;

    }

    gcv.toast.textContent = message;

    gcv.toast.classList.add("show");

    clearTimeout(gcvToastTimer);

    gcvToastTimer = setTimeout(() => {

        gcv.toast.classList.remove("show");

    }, 2500);

}


/*==================================================
            ESC CLOSE MODAL
==================================================*/

document.addEventListener(

    "keydown",

    event => {

        if (

            event.key === "Escape"

        ) {

            gcvCloseModal();

        }

    }

);

/*==================================================
                DESTROY
==================================================*/

function gcvDestroy() {

    clearInterval(

        gcv.interval

    );

}