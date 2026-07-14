/*==================================
        GOCES VOUCHER COPY
==================================*/

window.GocesVoucherCopy = {

    timer: null,

    async copy(button) {

        const card = button.closest(".gcv-card");

        if (!card) return;

        const code = card.dataset.code;

        // Mencegah card ikut animasi
        card.classList.add("gcv-copy-click");

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

                card.classList.remove("gcv-copy-click");

                return;

            }

        }

        // Efek tombol
        button.classList.add("copied");

        button.textContent = "Disalin ✓";

        this.toast("Kode " + code + " berhasil disalin");

        setTimeout(() => {

            button.classList.remove("copied");

            button.textContent = "Salin";

            card.classList.remove("gcv-copy-click");

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

        const button = e.target.closest(".gcv-copy");

        if (!button) return;

        e.preventDefault();

        e.stopPropagation();

        e.stopImmediatePropagation();

        GocesVoucherCopy.copy(button);

    },

    true

);