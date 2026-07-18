
(() => {
    const API_BASE = "https://goces-api.vercel.app/api";
    let campaign = null;

    function formatRupiah(number) {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(Number(number) || 0);

    }

    /*==================================
            LOAD CAMPAIGN
    ==================================*/

    function loadCampaign() {

        document.getElementById("gpayLoading").style.display = "block";
        document.getElementById("gpayContent").style.display = "none";

        campaign = window.selectedCampaign;

        if (!campaign) {

            alert("Campaign tidak ditemukan.");

            showPage("home");

            return;

        }

        document.getElementById("gpayLoading").style.display = "none";
        document.getElementById("gpayContent").style.display = "block";

        const image = document.getElementById("gpayImage");

        if (image) {
            image.src = campaign.cover_image || "";
        }

        document.getElementById("gpayTitle").textContent =
            campaign.title;

        document.getElementById("gpayTarget").textContent =
            "Target " + formatRupiah(campaign.target_amount);

        document.getElementById("donationAmount").value = 10000;
        updateTotal();

    }

    /*==================================
            UPDATE TOTAL
    ==================================*/

    function updateTotal() {

        const amount = Number(
            document.getElementById("donationAmount").value || 0
        );

        document.getElementById("gpayTotal").textContent =
            formatRupiah(amount);

    }

    /*==================================
            QUICK BUTTON
    ==================================*/

    document.querySelectorAll(".gpay-quick button").forEach(button => {

        button.onclick = function () {

            document.getElementById("donationAmount").value =
                button.dataset.value;

            updateTotal();

        };

    });

    /*==================================
            INPUT NOMINAL
    ==================================*/

    document
        .getElementById("donationAmount")
        .addEventListener("input", updateTotal);

    /*==================================
            SUBMIT DONATION
    ==================================*/

    document.getElementById("gpaySubmit").onclick = async function () {

        const donor_name =
            document.getElementById("donorName").value.trim();

        const donor_email =
            document.getElementById("donorEmail").value.trim();

        const donor_phone =
            document.getElementById("donorPhone").value.trim();

        const amount =
            Number(document.getElementById("donationAmount").value);

        const is_anonymous =
            document.getElementById("isAnonymous").checked;

        if (!donor_name)
            return alert("Nama wajib diisi.");

        if (!donor_email)
            return alert("Email wajib diisi.");

        if (!donor_phone)
            return alert("Nomor WhatsApp wajib diisi.");

        if (amount < 10000)
            return alert("Minimal donasi Rp10.000");

        try {

            const submit =
                document.getElementById("gpaySubmit");

            submit.disabled = true;
            submit.textContent = "Memproses...";

            const response = await fetch(

                API_BASE + "/donations/create",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        campaign_id: campaign.id,

                        title: campaign.title,

                        method: "QRIS",

                        amount,

                        donor_name,

                        donor_email,

                        donor_phone,

                        is_anonymous

                    })

                }

            );

            const json = await response.json();

            if (!json.success) {

                throw new Error(

                    json.message ||

                    "Gagal membuat transaksi."

                );

            }

            /*==============================
                SIMPAN PAYMENT
            ==============================*/

            window.currentPayment = json.data.payment;

            window.currentReference =
                json.data.payment.reference;

            /*==============================
                OPEN WAITING
            ==============================*/
            submit.disabled = false;
            submit.textContent = "Lanjutkan Pembayaran";

            showPage("goces-waiting");

            if (typeof loadPayment === "function") {
                loadPayment();
            }

        }

        catch (err) {

            alert(err.message);

            console.error(err);

            const submit =
                document.getElementById("gpaySubmit");

            submit.disabled = false;

            submit.textContent =
                "Lanjutkan Pembayaran";

        }

    };

    window.loadCampaign = loadCampaign;

})();