(() => {

    const GPDL_API = "https://goces-api.vercel.app/api/goces-peduli/home";
    const FALLBACK_IMAGE = "https://placehold.co/600x400?text=GOCES+Peduli";

    const gpdlWrapper = document.getElementById("gpdl-wrapper");
    const gpdlTemplate = document.getElementById("gpdl-template");

    if (!gpdlWrapper || !gpdlTemplate) {
        return;
    }

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(Number(value) || 0);
    }

    function getProgress(collected, target, apiProgress) {
        const collectedAmount = Number(collected) || 0;
        const targetAmount = Number(target) || 0;
        const progressApi = Number(apiProgress);

        if (Number.isFinite(progressApi)) {
            return Math.min(Math.max(Math.round(progressApi), 0), 100);
        }

        if (targetAmount <= 0) return 0;

        return Math.min(
            Math.max(
                Math.round((collectedAmount / targetAmount) * 100),
                0
            ),
            100
        );
    }

    function badgeClass(category = "") {

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

    function showMessage(message, className = "gpdl-message") {

        if (!gpdlWrapper) return;

        gpdlWrapper.innerHTML = "";

        const el = document.createElement("p");

        el.className = className;
        el.textContent = message;

        gpdlWrapper.appendChild(el);

    }

    /*==========================================
            NAVIGATION
    ==========================================*/

    function selectCampaign(campaign) {

        window.selectedCampaign = campaign;

    }

    function openDetailPage(campaign) {

        selectCampaign(campaign);

        if (typeof showPage === "function") {

            showPage("goces-detail");

            if (typeof loadCampaignDetail === "function") {

                loadCampaignDetail();

            }

        }

    }

    function openPaymentPage(campaign) {

        selectCampaign(campaign);

        if (typeof showPage === "function") {

            showPage("goces-payment");

            if (typeof loadCampaign === "function") {

                loadCampaign();

            }

        }

    }

    /*==========================================
            CREATE CARD
    ==========================================*/

    function createCard(campaign) {

        const fragment = gpdlTemplate.content.cloneNode(true);

        const card = fragment.querySelector(".gpdl-card");
        const badge = fragment.querySelector(".gpdl-badge");
        const image = fragment.querySelector(".gpdl-cover");
        const title = fragment.querySelector(".gpdl-title");
        const target = fragment.querySelector(".gpdl-target-amount");
        const collected = fragment.querySelector(".gpdl-collected");
        const percent = fragment.querySelector(".gpdl-percent");
        const progressBar = fragment.querySelector(".gpdl-progress-bar");
        const donor = fragment.querySelector(".gpdl-donor");
        const donateButton = fragment.querySelector(".gpdl-donate");

        const progress = getProgress(
            campaign.collected_amount,
            campaign.target_amount,
            campaign.progress
        );

        badge.textContent = campaign.category || "Donasi";
        badge.classList.add(badgeClass(campaign.category));

        image.src = campaign.cover_image || FALLBACK_IMAGE;
        image.alt = campaign.title || "Campaign";

        image.onerror = function () {

            image.onerror = null;
            image.src = FALLBACK_IMAGE;

        };

        title.textContent = campaign.title || "-";
        target.textContent = formatRupiah(campaign.target_amount);
        collected.textContent = formatRupiah(campaign.collected_amount);
        percent.textContent = progress + "%";
        progressBar.style.width = progress + "%";
        donor.textContent = `👥 ${campaign.donor_count || 0} Donatur`;

        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", campaign.title || "Campaign");

        card.onclick = () => {

            openDetailPage(campaign);

        };

        card.onkeydown = (e) => {

            if (e.key === "Enter" || e.key === " ") {

                e.preventDefault();

                openDetailPage(campaign);

            }

        };

        donateButton.onclick = (e) => {

            e.preventDefault();
            e.stopPropagation();

            openPaymentPage(campaign);

            return false;

        };

        gpdlWrapper.appendChild(fragment);

    }

    /*==========================================
            LOAD CAMPAIGN
    ==========================================*/

    async function loadCampaigns() {

        showMessage("Memuat campaign...");

        try {

            const response = await fetch(GPDL_API);

            if (!response.ok) {

                throw new Error("HTTP " + response.status);

            }

            const json = await response.json();

            console.log("API HOME =", json);

            if (!json.success) {

                throw new Error(json.message);

            }

            gpdlWrapper.innerHTML = "";

            const campaigns = json.data.campaigns || [];

            if (campaigns.length === 0) {

                showMessage("Belum ada campaign.");

                return;

            }

            campaigns.forEach(createCard);

        } catch (err) {

            console.error(err);

            showMessage(
                "Tidak dapat memuat campaign.",
                "gpdl-message gpdl-message-error"
            );

        }

    }

    /*==========================================
            EXPORT
    ==========================================*/

    window.loadCampaigns = loadCampaigns;
    window.openDetailPage = openDetailPage;
    window.openPaymentPage = openPaymentPage;

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", loadCampaigns);

    } else {

        loadCampaigns();

    }

})();