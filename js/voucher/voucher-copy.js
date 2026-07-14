/*==================================
        GOCES VOUCHER COPY
==================================*/

window.GocesVoucherCopy = {

    async copy(button) {

        const card = button.closest(".gcv-card");

        if (!card) return;

        const code = card.dataset.code;

        try {

            await navigator.clipboard.writeText(code);

            this.toast("Kode voucher berhasil disalin");

        }

        catch (err) {

            // Fallback Android WebView

            const input = document.createElement("input");

            input.value = code;

            document.body.appendChild(input);

            input.select();

            document.execCommand("copy");

            document.body.removeChild(input);

            this.toast("Kode voucher berhasil disalin");

        }

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

document.addEventListener("click", function (e) {

    const button = e.target.closest(".gcv-copy");

    if (!button) return;

    e.preventDefault();

    e.stopPropagation();

    e.stopImmediatePropagation();

    GocesVoucherCopy.copy(button);

}, true);