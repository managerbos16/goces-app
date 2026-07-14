/*==================================
        GOCES VOUCHER MODAL
==================================*/

window.GocesVoucherModal = {

    modal: null,

    init() {

        this.modal = document.getElementById(

            "gocesVoucherModal"

        );

        if (!this.modal) return;

        document.addEventListener(

            "click",

            (e) => {

                const card = e.target.closest(".gcv-card");

                if (card) {

                    this.open(card);

                }

                if (

                    e.target.classList.contains(

                        "gcv-modal-close"

                    )

                ) {

                    this.close();

                }

            }

        );

    },

    open(card) {

        this.modal.querySelector(

            ".gcv-modal-image"

        ).src =

            card.dataset.image;

        this.modal.querySelector(

            ".gcv-modal-title"

        ).textContent =

            card.dataset.title;

        this.modal.querySelector(

            ".gcv-modal-description"

        ).textContent =

            card.dataset.description;

        this.modal.querySelector(

            ".gcv-modal-code"

        ).textContent =

            card.dataset.code;

        this.modal.querySelector(

            ".gcv-modal-period"

        ).textContent =

            card.dataset.period;

        this.modal.querySelector(

            ".gcv-modal-min-order"

        ).textContent =

            "Minimal Belanja Rp " +

            Number(

                card.dataset.minimum

            ).toLocaleString("id-ID");

        this.modal.querySelector(

            ".gcv-modal-max-discount"

        ).textContent =

            "Maksimal Diskon Rp " +

            Number(

                card.dataset.maximum

            ).toLocaleString("id-ID");

        const list =

            this.modal.querySelector(

                ".gcv-terms-list"

            );

        list.innerHTML = "";

        JSON.parse(

            card.dataset.terms

        ).forEach(term => {

            list.insertAdjacentHTML(

                "beforeend",

                `<li>${term}</li>`

            );

        });

        this.modal.classList.add(

            "show"

        );

    },

    close() {

        this.modal.classList.remove(

            "show"

        );

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () =>

        GocesVoucherModal.init()

);