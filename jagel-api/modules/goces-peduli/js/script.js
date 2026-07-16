/*=========================================
            GOCES PEDULI
=========================================*/

const API_BASE = "https://api.goces.com/api";

/*=========================================
            ELEMENT
=========================================*/

const gpdlList =
    document.querySelector(".gpdl-list");

const gpdlLoading =
    document.querySelector(".gpdl-loading");

const gpdlError =
    document.querySelector(".gpdl-error");

const gpdlEmpty =
    document.querySelector(".gpdl-empty");

const gpdlRetry =
    document.querySelector(".gpdl-retry");

const gpdlRefresh =
    document.querySelector(".gpdl-refresh-btn");

const gpdlTotalCollected =
    document.querySelector(".gpdl-total-collected");

const gpdlTotalDonors =
    document.querySelector(".gpdl-total-donors");

const gpdlTotalCampaigns =
    document.querySelector(".gpdl-total-campaigns");

const gpdlTemplate =
    document.querySelector("#gpdl-card-template");

/*=========================================
            FORMAT RUPIAH
=========================================*/

function formatRupiah(number) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR",

            maximumFractionDigits: 0

        }

    ).format(number);

}

/*=========================================
            LOADING
=========================================*/

function showLoading() {

    gpdlLoading.style.display = "flex";

    gpdlError.style.display = "none";

    gpdlEmpty.style.display = "none";

    gpdlList.style.display = "none";

}

function hideLoading() {

    gpdlLoading.style.display = "none";

}

function showError() {

    gpdlError.style.display = "block";

    gpdlLoading.style.display = "none";

    gpdlEmpty.style.display = "none";

    gpdlList.style.display = "none";

}

function showEmpty() {

    gpdlEmpty.style.display = "block";

    gpdlLoading.style.display = "none";

    gpdlError.style.display = "none";

    gpdlList.style.display = "none";

}

function showList() {

    gpdlList.style.display = "flex";

    gpdlLoading.style.display = "none";

    gpdlError.style.display = "none";

    gpdlEmpty.style.display = "none";

}

/*=========================================
        LOAD HOME
=========================================*/

async function loadHome() {

    try {

        showLoading();

        const response = await fetch(

            API_BASE +

            "/goces-peduli/home"

        );

        const json =

            await response.json();

        if (!json.success) {

            throw new Error(

                json.message

            );

        }

        renderHome(

            json.data

        );

    }

    catch (err) {

        console.error(err);

        showError();

    }

}

/*=========================================
        RENDER
=========================================*/

function renderHome(data) {

    gpdlTotalCollected.textContent =

        formatRupiah(

            data.statistics.total_collected

        );

    gpdlTotalDonors.textContent =

        data.statistics.donors;

    gpdlTotalCampaigns.textContent =

        data.statistics.campaigns;

    if (

        data.campaigns.length === 0

    ) {

        showEmpty();

        return;

    }

    showList();

    gpdlList.innerHTML = "";

    data.campaigns.forEach(

        campaign => {

            renderCampaign(

                campaign

            );

        }

    );

}

/*=========================================
        CARD
=========================================*/

function renderCampaign(campaign) {

    const card =

        gpdlTemplate.content

            .cloneNode(true);

    card.querySelector("img").src =

        campaign.cover_image;

    card.querySelector("img").alt =

        campaign.title;

    card.querySelector(

        ".gpdl-card-title"

    ).textContent =

        campaign.title;

    card.querySelector(

        ".gpdl-progress-fill"

    ).style.width =

        campaign.progress + "%";

    card.querySelector(

        ".gpdl-progress-percent"

    ).textContent =

        campaign.progress + "%";

    card.querySelector(

        ".gpdl-donor-count"

    ).textContent =

        campaign.donor_count +

        " Donatur";

    card.querySelector(

        ".gpdl-collected"

    ).textContent =

        formatRupiah(

            campaign.collected_amount

        );

    card.querySelector(

        ".gpdl-target"

    ).textContent =

        formatRupiah(

            campaign.target_amount

        );

    /*==================================
    DETAIL
==================================*/

    const detailBtn =

        card.querySelector(

            ".gpdl-detail-btn"

        );

    detailBtn.addEventListener(

        "click",

        function (e) {

            e.stopPropagation();

            window.location.href =

                "detail.html?id=" +

                campaign.id;

        }

    );

    /*==================================
            DONASI
    ==================================*/

    const donateBtn =

        card.querySelector(

            ".gpdl-donate-btn"

        );

    donateBtn.addEventListener(

        "click",

        function (e) {

            e.stopPropagation();

            window.location.href =

                "payment.html?id=" +

                campaign.id;

        }

    );

    /*==================================
            CARD CLICK
    ==================================*/

    const article =

        card.querySelector(

            ".gpdl-card"

        );

    article.addEventListener(

        "click",

        function () {

            window.location.href =

                "detail.html?id=" +

                campaign.id;

        }

    );

    gpdlList.appendChild(card);

}

/*=========================================
            REFRESH
=========================================*/

if (gpdlRefresh) {

    gpdlRefresh.addEventListener(

        "click",

        loadHome

    );

}

/*=========================================
            RETRY
=========================================*/

if (gpdlRetry) {

    gpdlRetry.addEventListener(

        "click",

        loadHome

    );

}

/*=========================================
            AUTO LOAD
=========================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        loadHome();

    }

);