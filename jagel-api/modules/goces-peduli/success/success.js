/*==================================
        CONFIG
==================================*/

const API_BASE = "http://localhost:3000/api";

/*==================================
        PARAMETER
==================================*/

const params = new URLSearchParams(

    window.location.search

);

const reference = params.get("reference");

/*==================================
        FORMAT RUPIAH
==================================*/

function formatRupiah(number) {

    return "Rp" +

        Number(number).toLocaleString("id-ID");

}

/*==================================
        LOAD DONATION
==================================*/

async function loadDonation() {

    try {

        const response = await fetch(

            `${API_BASE}/donations/status/${reference}`

        );

        const json = await response.json();

        if (!json.success) {

            throw new Error(

                json.message

            );

        }

        const donation = json.data;

        document.getElementById(

            "successReference"

        ).textContent =

            donation.reference;

        document.getElementById(

            "successDonor"

        ).textContent =

            donation.is_anonymous

                ? "Anonim"

                : donation.donor_name;

        document.getElementById(

            "successMethod"

        ).textContent =

            donation.payment_name;

        document.getElementById(

            "successAmount"

        ).textContent =

            formatRupiah(

                donation.amount

            );

        document.getElementById(

            "successCampaign"

        ).textContent =

            donation.campaign_title ||

            "GOCES Peduli";

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

).onclick = () => {

    window.location.href =

        "/";

};

/*==================================
        START
==================================*/

loadDonation();