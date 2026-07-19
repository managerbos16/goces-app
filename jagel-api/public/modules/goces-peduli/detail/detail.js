(() => {

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

    function getProgress(campaign) {
        const apiProgress = Number(campaign.progress);

        if (Number.isFinite(apiProgress)) {
            return Math.min(Math.max(apiProgress, 0), 100);
        }

        const target = Number(campaign.target_amount) || 0;
        const collected = Number(campaign.collected_amount) || 0;

        return target > 0
            ? Math.min(Math.max(Math.round((collected / target) * 1000) / 10, 0), 100)
            : 0;
    }

    function formatProgress(progress) {
        return new Intl.NumberFormat("id-ID", {
            maximumFractionDigits: 1
        }).format(progress) + "%";
    }

    /*==================================
            LOAD DETAIL
    ==================================*/
    function loadCampaignDetail() {

        document.getElementById("gpdLoading").style.display = "block";
        document.getElementById("gpdContent").style.display = "none";
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

        document.getElementById("gpdAbout").textContent =
            campaign.description || "-";

        document.getElementById("gpdCollected").textContent =
            formatRupiah(campaign.collected_amount);

        document.getElementById("gpdTarget").textContent =
            formatRupiah(campaign.target_amount);

        document.getElementById("gpdDonor").textContent =
            Number(campaign.donor_count) || 0;

        const progress = getProgress(campaign);

        document.getElementById("gpdPercent").textContent =
            formatProgress(progress);

        const progressBar = document.getElementById("gpdBar");
        progressBar.style.width = progress + "%";
        progressBar.style.minWidth = progress > 0 ? "4px" : "0";
        progressBar.setAttribute("aria-valuenow", String(progress));

        document.getElementById("gpdDonate").onclick = function () {

            window.selectedCampaign = campaign;

            showPage("goces-payment");

            if (typeof loadCampaign === "function") {

                loadCampaign();

            }

        };

    }

    window.loadCampaignDetail = loadCampaignDetail;

})();

