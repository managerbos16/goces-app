/*==================================
        CONFIG
==================================*/

const FALLBACK_IMAGE =
    "https://placehold.co/600x400?text=GOCES+Peduli";

/*==================================
        FORMAT RUPIAH
==================================*/

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(number) || 0);

}

/*==================================
        LOAD DETAIL
==================================*/

function loadCampaignDetail() {

    const campaign = window.selectedCampaign;

    if (!campaign) {

        console.error("Campaign belum dipilih.");

        alert("Campaign tidak ditemukan.");

        showPage("home");

        return;

    }

    document.getElementById("gpdLoading").style.display = "none";
    document.getElementById("gpdContent").style.display = "block";

    const image = document.getElementById("gpdImage");

    image.src =
        campaign.cover_image || FALLBACK_IMAGE;

    image.onerror = function () {

        this.onerror = null;

        this.src = FALLBACK_IMAGE;

    };

    document.getElementById("gpdCategory").textContent =
        campaign.category || "Donasi";

    document.getElementById("gpdTitle").textContent =
        campaign.title || "-";

    document.getElementById("gpdDescription").textContent =
        campaign.description || "-";

    document.getElementById("gpdAbout").textContent =
        campaign.description || "-";

    document.getElementById("gpdCollected").textContent =
        formatRupiah(campaign.collected_amount);

    document.getElementById("gpdTarget").textContent =
        formatRupiah(campaign.target_amount);

    document.getElementById("gpdDonor").textContent =
        Number(campaign.donor_count) || 0;

    const progress =
        Number(campaign.progress) || 0;

    document.getElementById("gpdPercent").textContent =
        progress + "%";

    document.getElementById("gpdBar").style.width =
        progress + "%";

    document.getElementById("gpdDonate").onclick = function () {

        window.selectedCampaign = campaign;

        showPage("goces-payment");

        if (typeof loadPayment === "function") {

            loadPayment();

        }

    };

}