/*==========================================
            GOCES PEDULI
==========================================*/

const GPDL_API =
    "http://localhost:3000/api/goces-peduli/home";

const gpdlWrapper =
    document.getElementById("gpdl-wrapper");

const gpdlTemplate =
    document.getElementById("gpdl-template");

/*==========================================
            FORMAT RUPIAH
==========================================*/

function formatRupiah(number) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR",

            maximumFractionDigits: 0

        }

    ).format(Number(number));

}

/*==========================================
            BADGE
==========================================*/

function badgeClass(category) {

    if (!category) return "gpdl-sosial";

    switch (category.toLowerCase()) {

        case "bencana":

            return "gpdl-bencana";

        case "kemanusiaan":

            return "gpdl-kemanusiaan";

        case "kesehatan":

            return "gpdl-kesehatan";

        case "pendidikan":

            return "gpdl-pendidikan";

        case "lingkungan":

            return "gpdl-lingkungan";

        default:

            return "gpdl-sosial";

    }

}

/*==========================================
            LOAD CAMPAIGN
==========================================*/

async function loadCampaigns() {

    try {

        const response =
            await fetch(GPDL_API);

        const json =
            await response.json();

        if (!json.success) {

            console.log(json);

            return;

        }

        gpdlWrapper.innerHTML = "";

        json.data.campaigns.forEach(campaign => {

            createCard(campaign);

        });

    }

    catch (err) {

        console.error(err);

    }

}

/*==========================================
            CREATE CARD
==========================================*/

function createCard(campaign) {

    const card =

        gpdlTemplate.content

            .cloneNode(true);

    /*========================*/

    const badge =

        card.querySelector(".gpdl-badge");

    badge.textContent =

        campaign.category || "Donasi";

    badge.classList.add(

        badgeClass(campaign.category)

    );

    /*========================*/

    const image =

        card.querySelector(".gpdl-cover");

    image.src =

        campaign.cover_image;

    image.alt =

        campaign.title;

    /*========================*/

    card.querySelector(

        ".gpdl-title"

    ).textContent =

        campaign.title;

    /*========================*/

    card.querySelector(

        ".gpdl-target-amount"

    ).textContent =

        formatRupiah(

            campaign.target_amount

        );

    /*========================*/

    card.querySelector(

        ".gpdl-collected"

    ).textContent =

        formatRupiah(

            campaign.collected_amount

        );

    /*========================*/

    card.querySelector(

        ".gpdl-percent"

    ).textContent =

        campaign.progress + "%";

    /*========================*/

    card.querySelector(

        ".gpdl-progress-bar"

    ).style.width =

        campaign.progress + "%";

    /*========================*/

    card.querySelector(

        ".gpdl-donor"

    ).textContent =

        "👥 " +

        campaign.donor_count +

        " Donatur";

    /*========================*/

    const cardElement =

        card.querySelector(".gpdl-card");

    cardElement.onclick = () => {

        window.location.href =

            "detail.html?id=" +

            campaign.id;

    };

    /*========================*/

    const donateButton =

        card.querySelector(

            ".gpdl-donate"

        );

    donateButton.onclick = (e) => {

        e.stopPropagation();

        window.location.href =

            "payment.html?id=" +

            campaign.id;

    };

    /*========================*/

    gpdlWrapper.appendChild(card);

}

/*==========================================
            START
==========================================*/

document.addEventListener(

    "DOMContentLoaded",

    loadCampaigns

);