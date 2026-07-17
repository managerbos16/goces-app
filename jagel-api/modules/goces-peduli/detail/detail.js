/*==================================
        CONFIG
==================================*/

const API = "http://localhost:3000/api";

/*==================================
        FORMAT RUPIAH
==================================*/

function formatRupiah(number) {

    return "Rp" + Number(number).toLocaleString("id-ID");

}

/*==================================
        GET PARAMETER
==================================*/

const params = new URLSearchParams(window.location.search);

const campaignId = params.get("id");

/*==================================
        LOAD CAMPAIGN
==================================*/

async function loadCampaign() {

    if (!campaignId) {

        alert("Campaign tidak ditemukan.");

        history.back();

        return;

    }

    try {

        const response = await fetch(

            `${API}/campaigns/${campaignId}`

        );

        const json = await response.json();

        if (!json.success) {

            throw new Error(json.message);

        }

        const campaign = json.data;

        document.getElementById("gpdLoading").style.display = "none";

        document.getElementById("gpdContent").style.display = "block";

        /*==============================
                IMAGE
        ==============================*/

        document.getElementById("gpdImage").src =
            campaign.cover_image;

        /*==============================
                CATEGORY
        ==============================*/

        document.getElementById("gpdCategory").textContent =
            "❤️ Donasi";

        /*==============================
                TITLE
        ==============================*/

        document.getElementById("gpdTitle").textContent =
            campaign.title;

        /*==============================
                DESCRIPTION
        ==============================*/

        document.getElementById("gpdDescription").textContent =
            campaign.description;

        document.getElementById("gpdAbout").textContent =
            campaign.description;

        /*==============================
                MONEY
        ==============================*/

        document.getElementById("gpdCollected").textContent =
            formatRupiah(campaign.collected_amount);

        document.getElementById("gpdTarget").textContent =
            formatRupiah(campaign.target_amount);

        /*==============================
                DONOR
        ==============================*/

        document.getElementById("gpdDonor").textContent =
            campaign.donor_count;

        /*==============================
                PROGRESS
        ==============================*/

        document.getElementById("gpdPercent").textContent =
            campaign.progress + "%";

        document.getElementById("gpdBar").style.width =
            campaign.progress + "%";

        /*==============================
                BUTTON
        ==============================*/

        document.getElementById("gpdDonate").onclick = () => {

            location.href =
                "../payment/payment.html?id=" +
                campaign.id;

        };

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/*==================================
        START
==================================*/

loadCampaign();