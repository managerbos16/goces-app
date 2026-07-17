/*==================================
        CONFIG
==================================*/

const API_BASE = "https://goces-api.vercel.app/api";

let payment =
    window.currentPayment || null;

let reference =
    window.currentReference || null;

let campaign =
    window.selectedCampaign || null;

/*==================================
        FORMAT RUPIAH
==================================*/

function formatRupiah(number) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR",

            maximumFractionDigits: 0

        }

    ).format(Number(number) || 0);

}

/*==================================
        LOAD DONATION
==================================*/

async function loadDonation() {

    payment = window.currentPayment || payment;
    reference = window.currentReference || reference;
    campaign = window.selectedCampaign || campaign;

    try {

        if (!reference) {

            alert("Data pembayaran tidak ditemukan.");

            showPage("home");

            if (typeof loadCampaigns === "function") {

                loadCampaigns();

            }

            return;

        }

        if (!payment) {

            const response = await fetch(

                API_BASE +
                "/donations/status/" +
                encodeURIComponent(reference)

            );

            const json =
                await response.json();

            if (!json.success) {

                throw new Error(

                    json.message ||

                    "Data donasi tidak ditemukan."

                );

            }

            payment =
                json.data;

            window.currentPayment =
                payment;

        }

        document.getElementById(

            "successReference"

        ).textContent =

            payment.reference || "-";

        document.getElementById(

            "successDonor"

        ).textContent =

            payment.is_anonymous

                ? "Anonim"

                : payment.donor_name;

        document.getElementById(

            "successMethod"

        ).textContent =

            payment.payment_name ||

            "QRIS";

        document.getElementById(

            "successAmount"

        ).textContent =

            formatRupiah(

                payment.amount

            );

        document.getElementById(

            "successCampaign"

        ).textContent =

            payment.campaign_title ||

            campaign?.title ||

            "GOCES Peduli";

        document.getElementById(

            "successStatus"

        ).textContent =

            "BERHASIL";

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/*==================================
        BUTTON HOME
==================================*/

document.getElementById(

    "btnBackHome"

).onclick = function () {

    window.currentPayment = null;

    window.currentReference = null;

    window.selectedCampaign = null;

    showPage(

        "home"

    );

};

/*==================================
        START
==================================*/

document.addEventListener(

    "DOMContentLoaded",

    loadDonation

);