/*==================================
        GOCES VOUCHER COPY
==================================*/

window.GocesVoucherCopy = {

    timer: null,

    async copy(button, code = null) {

        let card = null;

        // Jika kode tidak dikirim, berarti berasal dari Card Voucher
        if (!code) {

            card = button.closest(".gcv-card");

            if (!card) return;

            code = card.dataset.code;

            // Efek animasi hanya untuk card
            card.classList.add("gcv-copy-click");

        }

        try {

            await navigator.clipboard.writeText(code);

        }

        catch (err) {

            try {

                const input = document.createElement("input");

                input.value = code;

                document.body.appendChild(input);

                input.select();

                document.execCommand("copy");

                document.body.removeChild(input);

            }

            catch (e) {

                console.error(e);

                this.toast("Gagal menyalin kode");

                if (card) {

                    card.classList.remove("gcv-copy-click");

                }

                return;

            }

        }

        // Efek tombol
        button.classList.add("copied");

        const originalText = button.textContent;

        button.textContent = "Disalin ✓";

        this.toast("Kode " + code + " berhasil disalin");

        setTimeout(() => {

            button.classList.remove("copied");

            button.textContent = originalText;

            if (card) {

                card.classList.remove("gcv-copy-click");

            }

        }, 1500);

    },

    toast(message) {

        const toast = document.querySelector(".gcv-toast");

        if (!toast) return;

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {

            toast.classList.remove("show");

        }, 2000);

    }

};

/*==================================
        CLICK EVENT
==================================*/

document.addEventListener(

    "click",

    function (e) {

        /*==============================
            Tombol Salin pada Card
        ==============================*/
        const cardButton = e.target.closest(".gcv-copy");

        if (cardButton) {

            e.preventDefault();

            e.stopPropagation();

            e.stopImmediatePropagation();

            GocesVoucherCopy.copy(cardButton);

            return;

        }

        /*==============================
            Tombol Salin pada Modal
        ==============================*/
        const modalButton = e.target.closest(".gcv-modal-copy");

        if (modalButton) {

            e.preventDefault();

            e.stopPropagation();

            e.stopImmediatePropagation();

            const modal = document.getElementById("gocesVoucherModal");

            if (!modal) return;

            const code = modal
                .querySelector(".gcv-modal-code")
                .textContent
                .trim();

            if (!code) return;

            GocesVoucherCopy.copy(modalButton, code);

            return;

        }

    },

    true

);